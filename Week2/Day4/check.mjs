import assert from 'node:assert/strict';
import {
  runWithLoading, fetchJson, getProductOrFallback, createProductLoader,
} from './exercises.mjs';

// Dependency giả lập: điều khiển thời điểm settle, không gọi mạng hoặc đo millisecond.
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
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

const checks = [
  [1, 'Giữ loading true trong lúc task chờ, cleanup sau thành công', async () => {
    const gate = deferred();
    const events = [];
    const value = { id: 'p1' };
    const pending = runWithLoading((...args) => {
      assert.deepEqual(args, []);
      events.push('task');
      return gate.promise;
    }, (loading) => events.push(loading));
    const state = observe(pending);
    assert.equal(typeof pending?.then, 'function');
    assert.deepEqual(events, [true, 'task']);
    await flushJobs();
    assert.equal(state.status, 'pending');
    assert.deepEqual(events, [true, 'task']);
    gate.resolve(value);
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.equal(state.value, value);
    assert.deepEqual(events, [true, 'task', false]);
  }],
  [1, 'Cleanup cả rejection lẫn throw đồng bộ, giữ nguyên Error', async () => {
    for (const synchronous of [false, true]) {
      const failure = new Error(synchronous ? 'Sync failure' : 'Async failure');
      const events = [];
      let calls = 0;
      await assert.rejects(() => runWithLoading(() => {
        calls += 1;
        if (synchronous) throw failure;
        return Promise.reject(failure);
      }, (loading) => events.push(loading)), (error) => error === failure);
      assert.equal(calls, 1);
      assert.deepEqual(events, [true, false]);
    }
  }],
  [1, 'Không làm mất kết quả falsy khi chạy finally', async () => {
    for (const value of [0, false, '', null, undefined]) {
      const loadingValues = [];
      assert.equal(await runWithLoading(async () => value, (loading) => loadingValues.push(loading)), value);
      assert.deepEqual(loadingValues, [true, false]);
    }
  }],
  [2, 'Chờ parse JSON, gọi đúng URL và đọc body đúng một lần', async () => {
    const body = deferred();
    const calls = [];
    let jsonCalls = 0;
    const response = {
      ok: true,
      status: 200,
      json() { jsonCalls += 1; return body.promise; },
    };
    const state = observe(fetchJson('/products/p1', async (...args) => {
      calls.push(args);
      return response;
    }));
    await flushJobs();
    assert.deepEqual(calls, [['/products/p1']]);
    assert.equal(jsonCalls, 1);
    assert.equal(state.status, 'pending', 'Phải chờ cả response.json()');
    const value = { id: 'p1', price: 0 };
    body.resolve(value);
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.equal(state.value, value);
    assert.equal(jsonCalls, 1);
  }],
  [2, 'HTTP 404/503 tạo Error rõ ràng và không đọc body', async () => {
    for (const status of [404, 503]) {
      let fetchCalls = 0;
      let jsonCalls = 0;
      await assert.rejects(() => fetchJson('/missing', async () => {
        fetchCalls += 1;
        return { ok: false, status, json() { jsonCalls += 1; return Promise.resolve({}); } };
      }), (error) => error instanceof Error && error.message === `HTTP ${status}`);
      assert.equal(fetchCalls, 1);
      assert.equal(jsonCalls, 0);
    }
  }],
  [2, 'Truyền lỗi mạng/parse nguyên vẹn và giữ JSON falsy', async () => {
    const networkFailure = new Error('Offline');
    const parseFailure = new SyntaxError('Invalid JSON');
    await assert.rejects(() => fetchJson('/network', async () => { throw networkFailure; }), (error) => error === networkFailure);
    await assert.rejects(() => fetchJson('/parse', async () => ({
      ok: true, status: 200, json: async () => { throw parseFailure; },
    })), (error) => error === parseFailure);
    for (const value of [0, false, '', null]) {
      assert.equal(await fetchJson('/value', async () => ({ ok: true, status: 200, json: async () => value })), value);
    }
  }],
  [3, 'Thành công trả đúng product và không gọi fallback', async () => {
    const product = { id: 'p1', name: 'Book' };
    const before = structuredClone(product);
    const ids = [];
    let fallbackCalls = 0;
    const result = await getProductOrFallback('p1', async (id) => {
      ids.push(id);
      return product;
    }, () => { fallbackCalls += 1; return {}; });
    assert.equal(result, product);
    assert.deepEqual(ids, ['p1']);
    assert.equal(fallbackCalls, 0);
    assert.deepEqual(product, before);
  }],
  [3, 'Chỉ mã PRODUCT_NOT_FOUND mới tạo fallback, kể cả throw đồng bộ', async () => {
    for (const synchronous of [false, true]) {
      const missing = Object.assign(new Error('Missing'), { code: 'PRODUCT_NOT_FOUND' });
      const fallback = { id: 'p2', name: 'Unavailable' };
      const calls = [];
      assert.equal(await getProductOrFallback('p2', (id) => {
        calls.push(['fetch', id]);
        if (synchronous) throw missing;
        return Promise.reject(missing);
      }, (id) => { calls.push(['fallback', id]); return fallback; }), fallback);
      assert.deepEqual(calls, [['fetch', 'p2'], ['fallback', 'p2']]);
      assert.equal(missing.code, 'PRODUCT_NOT_FOUND');
    }
  }],
  [3, 'Không fallback theo message; lỗi khác và lỗi fallback phải truyền ra', async () => {
    for (const failure of [new Error('PRODUCT_NOT_FOUND'), Object.assign(new Error('Offline'), { code: 'NETWORK_ERROR' })]) {
      let fallbackCalls = 0;
      await assert.rejects(() => getProductOrFallback('p3', async () => { throw failure; }, () => {
        fallbackCalls += 1;
      }), (error) => error === failure);
      assert.equal(fallbackCalls, 0);
    }
    const missing = Object.assign(new Error('Missing'), { code: 'PRODUCT_NOT_FOUND' });
    const fallbackFailure = new Error('Cannot create fallback');
    await assert.rejects(() => getProductOrFallback('p3', async () => { throw missing; }, () => {
      throw fallbackFailure;
    }), (error) => error === fallbackFailure);
  }],
  [4, 'Idle -> loading -> success; snapshot không sửa được state nội bộ', async () => {
    const gate = deferred();
    const ids = [];
    const loader = createProductLoader((id) => { ids.push(id); return gate.promise; });
    const idle = loader.getState();
    assert.deepEqual(idle, { status: 'idle', data: null, error: null });
    assert.notEqual(idle, loader.getState());
    idle.status = 'changed';
    assert.equal(loader.getState().status, 'idle');
    const state = observe(loader.load('p1'));
    const loading = loader.getState();
    assert.deepEqual(loading, { status: 'loading', data: null, error: null });
    assert.deepEqual(ids, ['p1']);
    await flushJobs();
    assert.equal(state.status, 'pending');
    const product = { id: 'p1' };
    gate.resolve(product);
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.equal(state.value, product);
    assert.deepEqual(loader.getState(), { status: 'success', data: product, error: null });
    assert.equal(loader.getState().data, product, 'Shallow snapshot giữ tham chiếu product');
    assert.deepEqual(loading, { status: 'loading', data: null, error: null });
    const snapshot = loader.getState();
    snapshot.data = null;
    snapshot.error = new Error('External');
    assert.deepEqual(loader.getState(), { status: 'success', data: product, error: null });
  }],
  [4, 'Load tiếp theo xóa data/error cũ; lỗi vẫn reject đúng Error', async () => {
    const failedRequest = deferred();
    const recoveredRequest = deferred();
    const ids = [];
    const firstProduct = { id: 'first' };
    const loader = createProductLoader((id) => {
      ids.push(id);
      if (id === 'first') return Promise.resolve(firstProduct);
      return id === 'failed' ? failedRequest.promise : recoveredRequest.promise;
    });
    assert.equal(await loader.load('first'), firstProduct);
    const failed = observe(loader.load('failed'));
    assert.deepEqual(loader.getState(), { status: 'loading', data: null, error: null });
    const failure = new Error('Unavailable');
    failedRequest.reject(failure);
    await failed.done;
    assert.equal(failed.status, 'rejected');
    assert.equal(failed.error, failure);
    assert.deepEqual(loader.getState(), { status: 'error', data: null, error: failure });
    assert.equal(loader.getState().error, failure);
    const recovered = observe(loader.load('recovered'));
    assert.deepEqual(loader.getState(), { status: 'loading', data: null, error: null });
    const recoveredProduct = { id: 'recovered' };
    recoveredRequest.resolve(recoveredProduct);
    await recovered.done;
    assert.equal(recovered.status, 'fulfilled');
    assert.equal(recovered.value, recoveredProduct);
    assert.deepEqual(loader.getState(), { status: 'success', data: recoveredProduct, error: null });
    assert.deepEqual(ids, ['first', 'failed', 'recovered']);
  }],
  [4, 'Hai instance độc lập, method tách ra dùng được; xử lý throw đồng bộ', async () => {
    const failure = new Error('Synchronous failure');
    const gate = deferred();
    const first = createProductLoader(() => { throw failure; });
    const second = createProductLoader((id) => { assert.equal(id, 'p2'); return gate.promise; });
    const { load: firstLoad, getState: firstState } = first;
    const { load: secondLoad, getState: secondState } = second;
    await assert.rejects(() => firstLoad('p1'), (error) => error === failure);
    assert.deepEqual(firstState(), { status: 'error', data: null, error: failure });
    assert.deepEqual(secondState(), { status: 'idle', data: null, error: null });
    const pending = observe(secondLoad('p2'));
    assert.deepEqual(secondState(), { status: 'loading', data: null, error: null });
    assert.deepEqual(firstState(), { status: 'error', data: null, error: failure });
    const product = { id: 'p2' };
    gate.resolve(product);
    await pending.done;
    assert.equal(pending.status, 'fulfilled');
    assert.equal(pending.value, product);
    assert.deepEqual(secondState(), { status: 'success', data: product, error: null });
  }],
];

const requested = process.argv.slice(2);
if (requested.length > 1 || (requested.length === 1 && !/^[1-4]$/.test(requested[0]))) {
  console.error('Cách chạy: node Week2/Day4/check.mjs [1|2|3|4]');
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
