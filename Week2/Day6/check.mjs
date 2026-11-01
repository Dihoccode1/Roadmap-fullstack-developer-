import assert from 'node:assert/strict';
import { runTasksSequential, runTasksConcurrent, mapWithConcurrency, loadProductResultsLimited } from './exercises.mjs';

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

// Điều khiển Promise để kiểm tra số tác vụ đang chạy và thời điểm lấp slot;
// không đo thời gian thực. Khi review còn kiểm tra cách giải theo yêu cầu đề.
const checks = [
  [1, 'Factory tuần tự chưa được gọi trước lượt, không sửa array tasks', async () => {
    const gates = Array.from({ length: 3 }, deferred);
    const calls = [];
    const tasks = gates.map((gate, index) => (...args) => {
      assert.deepEqual(args, []);
      calls.push(index);
      return gate.promise;
    });
    const before = [...tasks];
    const state = observe(runTasksSequential(tasks));
    await flushJobs();
    assert.deepEqual(calls, [0]);
    gates[0].resolve(0);
    await flushJobs();
    assert.deepEqual(calls, [0, 1]);
    const product = { id: 'p1' };
    gates[1].resolve(product);
    await flushJobs();
    assert.deepEqual(calls, [0, 1, 2]);
    gates[2].resolve(false);
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.deepEqual(state.value, [0, product, false]);
    assert.equal(state.value[1], product);
    assert.deepEqual(tasks, before);
  }],
  [1, 'Lỗi đồng bộ/rejection dừng factory phía sau và giữ Error', async () => {
    for (const synchronous of [true, false]) {
      const failure = new Error('Task failed');
      const calls = [];
      await assert.rejects(() => runTasksSequential([
        () => { calls.push(0); if (synchronous) throw failure; return Promise.reject(failure); },
        async () => { calls.push(1); return 'unused'; },
      ]), (error) => error === failure);
      assert.deepEqual(calls, [0]);
    }
  }],
  [1, 'Input rỗng và kết quả falsy được giữ nguyên', async () => {
    assert.deepEqual(await runTasksSequential([]), []);
    const values = [undefined, '', false, null, 0];
    assert.deepEqual(await runTasksSequential(values.map((value) => async () => value)), values);
  }],
  [2, 'Khởi động tất cả nhưng kết quả theo input dù xong ngược', async () => {
    const gates = Array.from({ length: 3 }, deferred);
    const calls = [];
    const tasks = gates.map((gate, index) => (...args) => {
      assert.deepEqual(args, []);
      calls.push(index);
      return gate.promise;
    });
    const before = [...tasks];
    const state = observe(runTasksConcurrent(tasks));
    await flushJobs();
    assert.deepEqual(calls, [0, 1, 2]);
    assert.equal(state.status, 'pending');
    gates[2].resolve('C');
    gates[0].resolve('A');
    gates[1].resolve('B');
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.deepEqual(state.value, ['A', 'B', 'C']);
    assert.deepEqual(tasks, before);
  }],
  [2, 'Reject sớm; factory đã chạy không tự bị hủy', async () => {
    const first = deferred();
    const second = deferred();
    const other = observe(second.promise);
    const calls = [];
    const state = observe(runTasksConcurrent([
      () => { calls.push(0); return first.promise; },
      () => { calls.push(1); return second.promise; },
    ]));
    await flushJobs();
    assert.deepEqual(calls, [0, 1]);
    const failure = new Error('First failed');
    first.reject(failure);
    await flushJobs();
    assert.equal(state.status, 'rejected', 'Không chờ second settle mới báo lỗi');
    assert.equal(state.error, failure);
    assert.equal(other.status, 'pending');
    second.resolve('late');
    await other.done;
    assert.equal(other.value, 'late');
    assert.equal(state.error, failure);
  }],
  [2, 'Rỗng, falsy và cùng factory xuất hiện nhiều lần', async () => {
    assert.deepEqual(await runTasksConcurrent([]), []);
    let calls = 0;
    const sameTask = async () => { calls += 1; return 0; };
    assert.deepEqual(await runTasksConcurrent([sameTask, sameTask, async () => false]), [0, 0, false]);
    assert.equal(calls, 2);
  }],
  [3, 'Giữ limit và lấp slot ngay, không đợi cả batch; giữ thứ tự kết quả', async () => {
    const items = ['a', 'b', 'c', 'd', 'e'];
    const before = [...items];
    const gates = items.map(deferred);
    const calls = [];
    let active = 0;
    let peak = 0;
    const state = observe(mapWithConcurrency(items, 2, (item, index) => {
      assert.equal(item, items[index]);
      calls.push(index);
      active += 1;
      peak = Math.max(peak, active);
      return gates[index].promise.finally(() => { active -= 1; });
    }));
    await flushJobs();
    assert.deepEqual(calls, [0, 1]);
    assert.equal(active, 2);
    gates[1].resolve('B');
    await flushJobs();
    assert.deepEqual(calls, [0, 1, 2], 'Slot 1 xong thì item 2 chạy dù item 0 còn chờ');
    gates[2].resolve('C');
    await flushJobs();
    assert.deepEqual(calls, [0, 1, 2, 3]);
    gates[0].resolve('A');
    await flushJobs();
    assert.deepEqual(calls, [0, 1, 2, 3, 4]);
    gates[4].resolve('E');
    gates[3].resolve('D');
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.deepEqual(state.value, ['A', 'B', 'C', 'D', 'E']);
    assert.equal(peak, 2);
    assert.equal(active, 0);
    assert.deepEqual(items, before);
  }],
  [3, 'Validate limit trước mapper; rỗng, limit 1/lớn, item lặp và sync value', async () => {
    for (const limit of [0, -1, 1.5, NaN, Infinity, '2']) {
      for (const items of [[], ['a']]) {
        let calls = 0;
        await assert.rejects(() => mapWithConcurrency(items, limit, () => { calls += 1; }),
          (error) => error instanceof RangeError && error.message === 'limit must be a positive integer');
        assert.equal(calls, 0);
      }
    }
    assert.deepEqual(await mapWithConcurrency([], 2, () => assert.fail('Không gọi mapper')), []);
    for (const limit of [1, 10]) {
      const calls = [];
      assert.deepEqual(await mapWithConcurrency(['b', 'a', 'b'], limit, (item, index) => {
        calls.push(index);
        return `${item}:${index}`;
      }), ['b:0', 'a:1', 'b:2']);
      assert.deepEqual(calls, [0, 1, 2]);
    }
  }],
  [3, 'Lỗi đầu ngừng item mới, reject sớm; xử lý cả lỗi của task đã chạy', async () => {
    const gates = [deferred(), deferred()];
    const calls = [];
    const state = observe(mapWithConcurrency([0, 1, 2, 3], 2, (_item, index) => {
      calls.push(index);
      return gates[index].promise;
    }));
    await flushJobs();
    assert.deepEqual(calls, [0, 1]);
    const failure = new Error('First observed failure');
    gates[0].reject(failure);
    await flushJobs();
    assert.equal(state.status, 'rejected', 'Không chờ mapper khác kết thúc mới reject');
    assert.equal(state.error, failure);
    gates[1].reject(new Error('Late active failure'));
    await flushJobs();
    assert.deepEqual(calls, [0, 1]);
    assert.equal(state.error, failure);
    const synchronous = new Error('Sync mapper failed');
    let afterFailure = 0;
    await assert.rejects(() => mapWithConcurrency([0, 1], 1, (item) => {
      if (item === 0) throw synchronous;
      afterFailure += 1;
    }), (error) => error === synchronous);
    assert.equal(afterFailure, 0);
  }],
  [4, 'Thu đủ thành công/lỗi dưới limit và lấp slot sau thất bại', async () => {
    const ids = ['p0', 'p1', 'p2', 'p3'];
    const before = [...ids];
    const gates = ids.map(deferred);
    const calls = [];
    const products = ids.map((id) => ({ id }));
    const state = observe(loadProductResultsLimited(ids, 2, (id) => {
      calls.push(id);
      return gates[ids.indexOf(id)].promise;
    }));
    await flushJobs();
    assert.deepEqual(calls, ['p0', 'p1']);
    gates[1].reject(new Error('Missing p1'));
    await flushJobs();
    assert.deepEqual(calls, ['p0', 'p1', 'p2']);
    assert.equal(state.status, 'pending');
    gates[2].resolve(products[2]);
    await flushJobs();
    assert.deepEqual(calls, ids);
    gates[3].resolve(products[3]);
    await flushJobs();
    assert.equal(state.status, 'pending', 'Vẫn phải chờ p0');
    gates[0].resolve(products[0]);
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.deepEqual(state.value, [
      { productId: 'p0', status: 'fulfilled', value: products[0] },
      { productId: 'p1', status: 'rejected', reason: 'Missing p1' },
      { productId: 'p2', status: 'fulfilled', value: products[2] },
      { productId: 'p3', status: 'fulfilled', value: products[3] },
    ]);
    assert.equal(state.value[0].value, products[0]);
    assert.deepEqual(ids, before);
    assert.deepEqual(products, ids.map((id) => ({ id })));
  }],
  [4, 'ID lặp, rỗng và tất cả fetch lỗi vẫn có đủ kết quả', async () => {
    assert.deepEqual(await loadProductResultsLimited([], 1, () => assert.fail('Không gọi fetch')), []);
    const calls = [];
    const failure = new Error('Offline');
    assert.deepEqual(await loadProductResultsLimited(['p1', 'p1', 'p2'], 1, (id) => {
      calls.push(id);
      if (id === 'p2') throw failure;
      return Promise.reject(failure);
    }), ['p1', 'p1', 'p2'].map((productId) => ({ productId, status: 'rejected', reason: 'Offline' })));
    assert.deepEqual(calls, ['p1', 'p1', 'p2']);
  }],
  [4, 'Sai limit vẫn reject RangeError, không biến lỗi cấu hình thành dữ liệu', async () => {
    for (const limit of [0, -2, 1.2, NaN, '3']) {
      for (const ids of [[], ['p1']]) {
        let calls = 0;
        await assert.rejects(() => loadProductResultsLimited(ids, limit, async () => { calls += 1; return {}; }),
          (error) => error instanceof RangeError && error.message === 'limit must be a positive integer');
        assert.equal(calls, 0);
      }
    }
  }],
];

const requested = process.argv.slice(2);
if (requested.length > 1 || (requested.length === 1 && !/^[1-4]$/.test(requested[0]))) {
  console.error('Cách chạy: node Week2/Day6/check.mjs [1|2|3|4]');
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
