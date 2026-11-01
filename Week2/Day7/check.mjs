import assert from 'node:assert/strict';
import { createTimeoutSignal, fetchProductWithSignal, fetchProductWithTimeout, createProductPageLoader } from './exercises.mjs';

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
      assert.ok(jobs.size, 'Chưa có timer được lên lịch');
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
  promise.catch(() => {}); // Bài còn TODO có thể chưa nhận dependency; vẫn kiểm tra lỗi qua observe.
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

// Dependency giả lập để chủ động chọn thứ tự hoàn thành; không mạng/thời gian thực.
// Review còn đọc code để xác nhận tái sử dụng helper và cleanup bằng finally.
const checks = [
  [1, 'Dispose trước deadline dọn đúng timer, idempotent và không abort', async () => {
    const timers = manualTimers();
    const deadline = createTimeoutSignal(40, timers);
    assert.ok(deadline.signal instanceof AbortSignal);
    assert.equal(deadline.signal.aborted, false);
    assert.equal(timers.scheduled.length, 1);
    assert.equal(timers.scheduled[0].ms, 40);
    assert.equal(deadline.dispose(), undefined);
    assert.equal(deadline.dispose(), undefined);
    assert.deepEqual(timers.cleared, [timers.scheduled[0].id]);
    assert.equal(timers.pending, 0);
    assert.equal(deadline.signal.aborted, false);
  }],
  [1, 'Deadline abort với TimeoutError; dispose sau đó giữ reason', async () => {
    const timers = manualTimers();
    const deadline = createTimeoutSignal(17, timers);
    timers.fireNext();
    assert.equal(deadline.signal.aborted, true);
    const reason = deadline.signal.reason;
    assert.ok(reason instanceof Error);
    assert.equal(reason.name, 'TimeoutError');
    assert.equal(reason.message, 'Timeout after 17ms');
    deadline.dispose();
    deadline.dispose();
    assert.equal(deadline.signal.reason, reason);
    assert.deepEqual(timers.cleared, [timers.scheduled[0].id]);
  }],
  [1, 'Validate ms trước timer; các deadline độc lập', async () => {
    for (const ms of [0, -1, 1.5, NaN, Infinity, '10']) {
      const timers = manualTimers();
      assert.throws(() => createTimeoutSignal(ms, timers),
        (error) => error instanceof RangeError && error.message === 'ms must be a positive integer');
      assert.equal(timers.scheduled.length, 0);
    }
    const timers = manualTimers();
    const first = createTimeoutSignal(10, timers);
    const second = createTimeoutSignal(20, timers);
    assert.notEqual(first.signal, second.signal);
    timers.fireNext();
    assert.equal(first.signal.aborted, true);
    assert.equal(second.signal.aborted, false);
    second.dispose();
    first.dispose();
    assert.equal(timers.pending, 0);
  }],
  [2, 'URL encode đúng, truyền chính signal và chờ body', async () => {
    const controller = new AbortController();
    const body = deferred();
    const calls = [];
    let jsonCalls = 0;
    const state = observe(fetchProductWithSignal('p/a ?', controller.signal, async (...args) => {
      calls.push(args);
      return { ok: true, status: 200, json() { jsonCalls += 1; return body.promise; } };
    }));
    await flushJobs();
    assert.deepEqual(calls, [['/products/p%2Fa%20%3F', { signal: controller.signal }]]);
    assert.equal(calls[0][1].signal, controller.signal);
    assert.equal(jsonCalls, 1);
    assert.equal(state.status, 'pending');
    const product = { id: 'p/a ?', name: 'Book' };
    body.resolve(product);
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.equal(state.value, product);
    assert.deepEqual(product, { id: 'p/a ?', name: 'Book' });
  }],
  [2, 'Pre-abort không fetch; abort khi Fetch pending giữ chính reason', async () => {
    const before = new AbortController();
    const reason = new Error('Cancelled before start');
    before.abort(reason);
    let calls = 0;
    await assert.rejects(() => fetchProductWithSignal('p1', before.signal, async () => {
      calls += 1;
      return {};
    }), (error) => error === reason);
    assert.equal(calls, 0);
    const during = new AbortController();
    const state = observe(fetchProductWithSignal('p2', during.signal, (_url, { signal }) => {
      calls += 1;
      return untilAbort(signal);
    }));
    during.abort();
    await state.done;
    assert.equal(calls, 1);
    assert.equal(state.status, 'rejected');
    assert.equal(state.error, during.signal.reason);
  }],
  [2, 'HTTP không đọc body; lỗi mạng/parse giữ Error gốc', async () => {
    const { signal } = new AbortController();
    let reads = 0;
    await assert.rejects(() => fetchProductWithSignal('missing', signal, async () => ({
      ok: false, status: 404, json() { reads += 1; return Promise.resolve({}); },
    })), (error) => error instanceof Error && error.message === 'HTTP 404');
    assert.equal(reads, 0);
    const network = new Error('Offline');
    const parse = new SyntaxError('Bad JSON');
    await assert.rejects(() => fetchProductWithSignal('p1', signal, async () => { throw network; }), (error) => error === network);
    await assert.rejects(() => fetchProductWithSignal('p1', signal, async () => ({
      ok: true, status: 200, json: async () => { throw parse; },
    })), (error) => error === parse);
  }],
  [3, 'Deadline còn hiệu lực khi đọc JSON và được dọn sau thành công', async () => {
    const timers = manualTimers();
    const body = deferred();
    let signal;
    let calls = 0;
    const state = observe(fetchProductWithTimeout('p1', 80, async (url, options) => {
      calls += 1;
      assert.equal(url, '/products/p1');
      signal = options.signal;
      return { ok: true, status: 200, json: () => body.promise };
    }, timers));
    await flushJobs();
    assert.equal(calls, 1);
    assert.ok(signal instanceof AbortSignal);
    assert.equal(timers.scheduled.length, 1);
    assert.equal(timers.pending, 1, 'Không dispose khi body còn chờ');
    assert.equal(state.status, 'pending');
    const product = { id: 'p1' };
    body.resolve(product);
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.equal(state.value, product);
    assert.equal(timers.pending, 0);
    assert.deepEqual(timers.cleared, [timers.scheduled[0].id]);
    assert.equal(signal.aborted, false);
  }],
  [3, 'Timeout hủy lúc chờ headers hoặc body, giữ signal.reason và cleanup', async () => {
    for (const phase of ['headers', 'body']) {
      const timers = manualTimers();
      let signal;
      const state = observe(fetchProductWithTimeout('p2', 25, (_url, options) => {
        signal = options.signal;
        if (phase === 'headers') return untilAbort(signal);
        return Promise.resolve({ ok: true, status: 200, json: () => untilAbort(signal) });
      }, timers));
      await flushJobs();
      assert.equal(state.status, 'pending');
      assert.equal(timers.scheduled.length, 1);
      timers.fireNext();
      await state.done;
      assert.equal(signal.aborted, true);
      assert.equal(state.status, 'rejected');
      assert.equal(state.error, signal.reason);
      assert.equal(state.error.name, 'TimeoutError');
      assert.equal(state.error.message, 'Timeout after 25ms');
      assert.deepEqual(timers.cleared, [timers.scheduled[0].id]);
      assert.equal(timers.pending, 0);
    }
  }],
  [3, 'HTTP/mạng/parse đều dọn timer; ms sai không gọi fetch', async () => {
    const network = new Error('Offline');
    const parse = new SyntaxError('Invalid JSON');
    for (const kind of ['http', 'network', 'parse']) {
      const timers = manualTimers();
      const state = observe(fetchProductWithTimeout('p3', 50, async () => {
        if (kind === 'network') throw network;
        return {
          ok: kind !== 'http', status: kind === 'http' ? 503 : 200,
          json: async () => { throw parse; },
        };
      }, timers));
      await state.done;
      assert.equal(state.status, 'rejected');
      if (kind === 'http') assert.equal(state.error.message, 'HTTP 503');
      else assert.equal(state.error, kind === 'network' ? network : parse);
      assert.equal(timers.scheduled.length, 1);
      assert.deepEqual(timers.cleared, [timers.scheduled[0].id]);
      assert.equal(timers.pending, 0);
    }
    const timers = manualTimers();
    let calls = 0;
    await assert.rejects(() => fetchProductWithTimeout('p1', 0, async () => { calls += 1; }, timers),
      (error) => error instanceof RangeError && error.message === 'ms must be a positive integer');
    assert.equal(calls, 0);
    assert.equal(timers.scheduled.length, 0);
  }],
  // Các ca loader được bổ sung từ hợp đồng latest-request đã học, độc lập bài Ngày 12.
  [4, 'Request mới abort request cũ; response cũ vẫn không ghi đè state', async () => {
    const requests = [];
    const loader = createProductPageLoader((id, options) => {
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
    const loader = createProductPageLoader((id, { signal }) => {
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
    const first = createProductPageLoader(() => { throw failure; });
    const signals = [];
    const second = createProductPageLoader(async (id, { signal }) => { signals.push(signal); return { id }; });
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
  console.error('Cách chạy: node Week2/Day7/check.mjs [1|2|3|4]');
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
