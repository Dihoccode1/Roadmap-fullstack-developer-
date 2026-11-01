import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { withTimeout, fetchJsonWithSignal, abortableDelay, createLatestProductLoader } from './exercises.mjs';

// Timer giả lập cho phép chủ động chọn bên thắng, không đo thời gian máy/mạng.
// Review còn đọc code để xác nhận đúng Promise.race, finally và API theo đề.
function manualTimers() {
  const jobs = new Map();
  const scheduled = [];
  const cleared = [];
  let nextId = 0;
  return {
    scheduled, cleared,
    setTimeout(callback, ms) {
      const id = { id: ++nextId };
      scheduled.push({ id, ms });
      jobs.set(id, callback);
      return id;
    },
    clearTimeout(id) { cleared.push(id); jobs.delete(id); },
    fireNext() {
      assert.ok(jobs.size, 'Chưa có timer nào được lên lịch');
      const [id, callback] = jobs.entries().next().value;
      jobs.delete(id);
      callback();
      return id;
    },
    get pending() { return jobs.size; },
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  // Tránh unhandled rejection từ dependency khi bài còn TODO chưa gắn handler.
  // Promise gốc vẫn reject; các assertion bên dưới vẫn kiểm tra việc truyền lỗi.
  promise.catch(() => {});
  return { promise, resolve, reject };
}

function observe(promise) {
  const state = { status: 'pending' };
  state.done = Promise.resolve(promise).then(
    (value) => { state.status = 'fulfilled'; state.value = value; },
    (error) => { state.status = 'rejected'; state.error = error; },
  );
  return state;
}

async function flushJobs() {
  await new Promise((resolve) => setImmediate(resolve));
}

function untilAbort(signal) {
  return new Promise((_, reject) => {
    if (signal.aborted) { reject(signal.reason); return; }
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  });
}

const checks = [
  [1, 'Promise thắng giữ object/falsy và dọn đúng timer', async () => {
    for (const value of [{ id: 'p1' }, 0, false, '', null, undefined]) {
      const timers = manualTimers();
      assert.equal(await withTimeout(Promise.resolve(value), 30, timers), value);
      assert.equal(timers.scheduled.length, 1);
      assert.equal(timers.scheduled[0].ms, 30);
      assert.ok(timers.cleared.includes(timers.scheduled[0].id));
      assert.equal(timers.pending, 0);
    }
  }],
  [1, 'Promise reject trước timeout giữ chính Error và dọn timer', async () => {
    const timers = manualTimers();
    const gate = deferred();
    const state = observe(withTimeout(gate.promise, 50, timers));
    const failure = new Error('Request failed');
    gate.reject(failure);
    await state.done;
    assert.equal(state.status, 'rejected');
    assert.equal(state.error, failure);
    assert.equal(timers.scheduled.length, 1);
    assert.ok(timers.cleared.includes(timers.scheduled[0].id));
    assert.equal(timers.pending, 0);
  }],
  [1, 'Timeout không hủy Promise gốc; kết quả muộn không đổi wrapper', async () => {
    for (const lateFailure of [false, true]) {
      const timers = manualTimers();
      const gate = deferred();
      const original = observe(gate.promise);
      const state = observe(withTimeout(gate.promise, 17, timers));
      assert.equal(timers.scheduled.length, 1);
      assert.equal(state.status, 'pending');
      const id = timers.fireNext();
      await state.done;
      assert.equal(state.status, 'rejected');
      assert.ok(state.error instanceof Error);
      assert.equal(state.error.name, 'TimeoutError');
      assert.equal(state.error.message, 'Timeout after 17ms');
      assert.ok(timers.cleared.includes(id));
      assert.equal(original.status, 'pending');
      const error = new Error('Late failure');
      if (lateFailure) gate.reject(error); else gate.resolve('late value');
      await original.done;
      assert.equal(original.status, lateFailure ? 'rejected' : 'fulfilled');
      if (lateFailure) assert.equal(original.error, error); else assert.equal(original.value, 'late value');
      assert.equal(state.error.name, 'TimeoutError');
    }
  }],
  [2, 'Fetch nhận chính signal, chờ JSON và giữ data', async () => {
    const controller = new AbortController();
    const body = deferred();
    const calls = [];
    let jsonCalls = 0;
    const state = observe(fetchJsonWithSignal('/products/p1', controller.signal, async (...args) => {
      calls.push(args);
      return { ok: true, status: 200, json() { jsonCalls += 1; return body.promise; } };
    }));
    await flushJobs();
    assert.deepEqual(calls, [['/products/p1', { signal: controller.signal }]]);
    assert.equal(calls[0][1].signal, controller.signal);
    assert.equal(jsonCalls, 1);
    assert.equal(state.status, 'pending');
    const data = { id: 'p1' };
    body.resolve(data);
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.equal(state.value, data);
    assert.equal(controller.signal.aborted, false);
  }],
  [2, 'Signal đã abort không gọi fetch; abort khi đang chờ giữ reason', async () => {
    const before = new AbortController();
    const reason = new Error('Cancelled before start');
    before.abort(reason);
    let calls = 0;
    await assert.rejects(() => fetchJsonWithSignal('/before', before.signal, async () => {
      calls += 1;
      return {};
    }), (error) => error === reason);
    assert.equal(calls, 0);
    const during = new AbortController();
    const state = observe(fetchJsonWithSignal('/during', during.signal, (_url, { signal }) => {
      calls += 1;
      return untilAbort(signal);
    }));
    const cancellation = new DOMException('User cancelled', 'AbortError');
    during.abort(cancellation);
    await state.done;
    assert.equal(calls, 1);
    assert.equal(state.status, 'rejected');
    assert.equal(state.error, cancellation);
  }],
  [2, 'HTTP/mạng/parse và abort lúc đọc body đều được xử lý đúng', async () => {
    const controller = new AbortController();
    let bodyCalls = 0;
    await assert.rejects(() => fetchJsonWithSignal('/missing', controller.signal, async () => ({
      ok: false, status: 404, json() { bodyCalls += 1; return Promise.resolve({}); },
    })), (error) => error instanceof Error && error.message === 'HTTP 404');
    assert.equal(bodyCalls, 0);
    const network = new Error('Offline');
    const parse = new SyntaxError('Bad JSON');
    await assert.rejects(() => fetchJsonWithSignal('/network', controller.signal, async () => { throw network; }), (error) => error === network);
    await assert.rejects(() => fetchJsonWithSignal('/parse', controller.signal, async () => ({
      ok: true, status: 200, json: async () => { throw parse; },
    })), (error) => error === parse);
    assert.equal(await fetchJsonWithSignal('/zero', controller.signal, async () => ({
      ok: true, status: 200, json: async () => 0,
    })), 0);
    const reading = observe(fetchJsonWithSignal('/body', controller.signal, async () => ({
      ok: true, status: 200, json() { bodyCalls += 1; return untilAbort(controller.signal); },
    })));
    await flushJobs();
    assert.equal(bodyCalls, 1);
    controller.abort();
    await reading.done;
    assert.equal(reading.status, 'rejected');
    assert.equal(reading.error, controller.signal.reason);
  }],
  [3, 'Delay hoàn thành rồi dọn timer/listener; abort muộn không đổi kết quả', async () => {
    const controller = new AbortController();
    const timers = manualTimers();
    const state = observe(abortableDelay(25, controller.signal, timers));
    assert.equal(timers.scheduled.length, 1);
    assert.equal(timers.scheduled[0].ms, 25);
    assert.equal(getEventListeners(controller.signal, 'abort').length, 1);
    assert.equal(state.status, 'pending');
    timers.fireNext();
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.equal(state.value, undefined);
    assert.equal(timers.pending, 0);
    assert.ok(timers.cleared.includes(timers.scheduled[0].id));
    assert.equal(getEventListeners(controller.signal, 'abort').length, 0);
    controller.abort();
    await flushJobs();
    assert.equal(state.status, 'fulfilled');
  }],
  [3, 'Abort trước deadline reject cùng reason và không để timer/listener sót', async () => {
    const controller = new AbortController();
    const timers = manualTimers();
    const state = observe(abortableDelay(80, controller.signal, timers));
    assert.equal(timers.pending, 1);
    const reason = new Error('Cancelled delay');
    controller.abort(reason);
    await state.done;
    assert.equal(state.status, 'rejected');
    assert.equal(state.error, reason);
    assert.equal(timers.pending, 0);
    assert.ok(timers.cleared.includes(timers.scheduled[0].id));
    assert.equal(getEventListeners(controller.signal, 'abort').length, 0);
  }],
  [3, 'Signal đã abort không tạo timer hoặc listener mới', async () => {
    const controller = new AbortController();
    const timers = manualTimers();
    controller.abort();
    await assert.rejects(() => abortableDelay(10, controller.signal, timers), (error) => error === controller.signal.reason);
    assert.equal(timers.scheduled.length, 0);
    assert.equal(getEventListeners(controller.signal, 'abort').length, 0);
  }],
  [4, 'Request mới abort request cũ; response cũ vẫn không ghi đè state', async () => {
    const requests = [];
    const loader = createLatestProductLoader((id, options) => {
      const gate = deferred();
      requests.push({ id, signal: options.signal, gate });
      return gate.promise; // Cố ý ignore abort để kiểm tra bảo vệ state độc lập với hủy I/O.
    });
    assert.deepEqual(loader.getState(), { status: 'idle', data: null, error: null });
    const old = observe(loader.load('old'));
    const current = observe(loader.load('new'));
    assert.deepEqual(requests.map(({ id }) => id), ['old', 'new']);
    assert.ok(requests[0].signal instanceof AbortSignal);
    assert.notEqual(requests[0].signal, requests[1].signal);
    assert.equal(requests[0].signal.aborted, true);
    assert.equal(requests[0].signal.reason.name, 'AbortError');
    assert.equal(requests[0].signal.reason.message, 'Superseded');
    assert.equal(requests[1].signal.aborted, false);
    const newProduct = { id: 'new' };
    requests[1].gate.resolve(newProduct);
    await current.done;
    assert.equal(current.status, 'fulfilled');
    assert.equal(current.value, newProduct);
    const oldProduct = { id: 'old' };
    requests[0].gate.resolve(oldProduct);
    await old.done;
    assert.equal(old.status, 'fulfilled');
    assert.equal(old.value, oldProduct, 'Promise caller cũ vẫn phản ánh dependency cũ');
    assert.deepEqual(loader.getState(), { status: 'success', data: newProduct, error: null });
    assert.equal(loader.getState().data, newProduct);
  }],
  [4, 'Lỗi/cleanup cũ không ghi state hoặc bỏ controller của request mới', async () => {
    const requests = [];
    const loader = createLatestProductLoader((id, { signal }) => {
      const gate = deferred();
      signal.addEventListener('abort', () => gate.reject(signal.reason), { once: true });
      requests.push({ id, signal, gate });
      return gate.promise;
    });
    const old = observe(loader.load('old'));
    const middle = observe(loader.load('middle'));
    assert.equal(requests.length, 2, 'Hai load phải gọi fetchProduct hai lần');
    await old.done;
    assert.equal(old.status, 'rejected');
    assert.equal(old.error, requests[0].signal.reason);
    assert.deepEqual(loader.getState(), { status: 'loading', data: null, error: null });
    const latest = observe(loader.load('latest'));
    assert.equal(requests[1].signal.aborted, true, 'Cleanup cũ không được xóa controller middle');
    await middle.done;
    assert.equal(middle.status, 'rejected');
    assert.equal(middle.error, requests[1].signal.reason);
    assert.deepEqual(loader.getState(), { status: 'loading', data: null, error: null });
    const failure = new Error('Latest failed');
    requests[2].gate.reject(failure);
    await latest.done;
    assert.equal(latest.status, 'rejected');
    assert.equal(latest.error, failure);
    assert.deepEqual(loader.getState(), { status: 'error', data: null, error: failure });
    const recovery = observe(loader.load('recovery'));
    assert.equal(requests[2].signal.aborted, false, 'Không abort request đã settle');
    assert.deepEqual(loader.getState(), { status: 'loading', data: null, error: null });
    const product = { id: 'recovery' };
    requests[3].gate.resolve(product);
    await recovery.done;
    assert.equal(recovery.status, 'fulfilled');
    assert.deepEqual(loader.getState(), { status: 'success', data: product, error: null });
  }],
  [4, 'Snapshot/instance độc lập; detached method; throw đồng bộ và load nối tiếp', async () => {
    const failure = new Error('Sync failed');
    const first = createLatestProductLoader(() => { throw failure; });
    const signals = [];
    const second = createLatestProductLoader(async (id, { signal }) => { signals.push(signal); return { id }; });
    const { load: firstLoad, getState: firstState } = first;
    const { load: secondLoad, getState: secondState } = second;
    const idle = secondState();
    assert.notEqual(idle, secondState());
    idle.status = 'external';
    assert.equal(secondState().status, 'idle');
    await assert.rejects(() => firstLoad('bad'), (error) => error === failure);
    assert.deepEqual(firstState(), { status: 'error', data: null, error: failure });
    assert.equal(secondState().status, 'idle');
    const product = await secondLoad('p1');
    const snapshot = secondState();
    assert.equal(snapshot.data, product);
    snapshot.data = null;
    assert.equal(secondState().data, product);
    const next = await secondLoad('p2');
    assert.notEqual(signals[0], signals[1]);
    assert.equal(signals[0].aborted, false);
    assert.equal(snapshot.status, 'success');
    assert.deepEqual(secondState(), { status: 'success', data: next, error: null });
    assert.deepEqual(firstState(), { status: 'error', data: null, error: failure });
  }],
];

const requested = process.argv.slice(2);
if (requested.length > 1 || (requested.length === 1 && !/^[1-4]$/.test(requested[0]))) {
  console.error('Cách chạy: node Week2/Day5/check.mjs [1|2|3|4]');
  process.exitCode = 1;
} else {
  const selected = requested.length ? checks.filter(([group]) => group === Number(requested[0])) : checks;
  let passed = 0;
  for (const [group, label, run] of selected) {
    let timeout;
    try {
      await Promise.race([
        Promise.resolve().then(run),
        new Promise((_, reject) => {
          timeout = setTimeout(() => reject(new Error('Quá thời gian chờ: kiểm tra Promise đã settle chưa')), 2000);
        }),
      ]);
      passed += 1;
      console.log(`PASS Bài ${group}: ${label}`);
    } catch (error) {
      console.error(`FAIL Bài ${group}: ${label}\n  ${error.message}`);
    } finally {
      clearTimeout(timeout);
    }
  }
  console.log(`\nKết quả: ${passed}/${selected.length} tình huống đạt.`);
  if (passed !== selected.length) process.exitCode = 1;
}
