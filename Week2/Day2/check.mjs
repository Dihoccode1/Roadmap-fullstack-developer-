import assert from 'node:assert/strict';
import {
  getProductWithCategory, loadProductsSequential, loadProductsConcurrent, loadProductResults,
} from './exercises.mjs';

// Promise được điều khiển bởi bài kiểm tra; không cần mạng và không đo millisecond.
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

function product(id) {
  return { id, name: id.toUpperCase(), categoryId: `category-${id}` };
}

const checks = [
  [1, 'Chain dùng categoryId từ product và trả dữ liệu kết hợp', async () => {
    const calls = [];
    const item = product('p1');
    const before = structuredClone(item);
    const result = await getProductWithCategory('p1', async (id) => {
      calls.push(`product:${id}`);
      return item;
    }, async (id) => {
      calls.push(`category:${id}`);
      return { id, name: 'Accessories' };
    });
    assert.deepEqual(result, { productId: 'p1', name: 'P1', categoryName: 'Accessories' });
    assert.deepEqual(calls, ['product:p1', 'category:category-p1']);
    assert.deepEqual(item, before);
  }],
  [1, 'Chưa có product thì chưa gọi category', async () => {
    const gate = deferred();
    let categoryCalls = 0;
    const state = observe(getProductWithCategory('p2', () => gate.promise, async (id) => {
      categoryCalls += 1;
      assert.equal(id, 'category-p2');
      return { id, name: 'Books' };
    }));
    await flushJobs();
    assert.equal(categoryCalls, 0);
    assert.equal(state.status, 'pending');
    gate.resolve(product('p2'));
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.deepEqual(state.value, { productId: 'p2', name: 'P2', categoryName: 'Books' });
    assert.equal(categoryCalls, 1);
  }],
  [1, 'Lỗi ở cả hai bước được truyền ra, không gọi bước sau khi bước đầu lỗi', async () => {
    const failure = new Error('Product failed');
    let categoryCalls = 0;
    await assert.rejects(() => getProductWithCategory('p1', async () => { throw failure; }, async () => {
      categoryCalls += 1;
      return { id: 'unused', name: 'Unused' };
    }), (error) => error === failure);
    assert.equal(categoryCalls, 0);
    const categoryFailure = new Error('Category failed');
    await assert.rejects(() => getProductWithCategory('p1', async () => product('p1'), async () => {
      throw categoryFailure;
    }), (error) => error === categoryFailure);
  }],
  [2, 'Tuần tự giữ thứ tự, ID lặp và input rỗng', async () => {
    const ids = ['p2', 'p1', 'p2'];
    const before = [...ids];
    const calls = [];
    assert.deepEqual(await loadProductsSequential(ids, async (id) => {
      calls.push(id);
      return product(id);
    }), ids.map(product));
    assert.deepEqual(calls, ids);
    assert.deepEqual(ids, before);
    assert.deepEqual(await loadProductsSequential([], async () => { assert.fail('Không được gọi khi ids rỗng'); }), []);
  }],
  [2, 'Chỉ có một request đang chờ tại mỗi thời điểm', async () => {
    const first = deferred();
    const second = deferred();
    const calls = [];
    const state = observe(loadProductsSequential(['p1', 'p2'], (id) => {
      calls.push(id);
      return id === 'p1' ? first.promise : second.promise;
    }));
    await flushJobs();
    assert.deepEqual(calls, ['p1']);
    assert.equal(state.status, 'pending');
    first.resolve(product('p1'));
    await flushJobs();
    assert.deepEqual(calls, ['p1', 'p2']);
    assert.equal(state.status, 'pending');
    second.resolve(product('p2'));
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.deepEqual(state.value, [product('p1'), product('p2')]);
  }],
  [2, 'Thất bại thì không bắt đầu ID tiếp theo', async () => {
    const failure = new Error('p2 failed');
    const calls = [];
    await assert.rejects(() => loadProductsSequential(['p1', 'p2', 'p3'], async (id) => {
      calls.push(id);
      if (id === 'p2') throw failure;
      return product(id);
    }), (error) => error === failure);
    assert.deepEqual(calls, ['p1', 'p2']);
  }],
  [3, 'Khởi động tất cả, kết quả giữ thứ tự input dù hoàn thành ngược', async () => {
    const first = deferred();
    const second = deferred();
    const ids = ['p1', 'p2'];
    const calls = [];
    const state = observe(loadProductsConcurrent(ids, (id) => {
      calls.push(id);
      return id === 'p1' ? first.promise : second.promise;
    }));
    await flushJobs();
    assert.deepEqual(calls, ['p1', 'p2']);
    second.resolve(product('p2'));
    await flushJobs();
    assert.equal(state.status, 'pending');
    first.resolve(product('p1'));
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.deepEqual(state.value, [product('p1'), product('p2')]);
    assert.deepEqual(ids, ['p1', 'p2']);
  }],
  [3, 'Array rỗng và ID lặp được xử lý đúng', async () => {
    let calls = 0;
    assert.deepEqual(await loadProductsConcurrent([], async () => { calls += 1; }), []);
    assert.equal(calls, 0);
    assert.deepEqual(await loadProductsConcurrent(['p1', 'p1'], async (id) => {
      calls += 1;
      return product(id);
    }), [product('p1'), product('p1')]);
    assert.equal(calls, 2);
  }],
  [3, 'Reject sớm với cùng Error; request khác đã bắt đầu không tự bị hủy', async () => {
    const first = deferred();
    const second = deferred();
    const calls = [];
    let secondFinished = false;
    const state = observe(loadProductsConcurrent(['p1', 'p2'], (id) => {
      calls.push(id);
      return id === 'p1' ? first.promise : second.promise.then((value) => {
        secondFinished = true;
        return value;
      });
    }));
    await flushJobs();
    assert.deepEqual(calls, ['p1', 'p2']);
    const failure = new Error('p1 failed');
    first.reject(failure);
    await flushJobs();
    assert.equal(state.status, 'rejected');
    assert.equal(state.error, failure);
    assert.equal(secondFinished, false);
    second.resolve(product('p2'));
    await flushJobs();
    assert.equal(secondFinished, true);
  }],
  [4, 'Giữ đủ kết quả thành công/lỗi và ID tương ứng', async () => {
    const ids = ['p1', 'p2', 'p3'];
    const before = [...ids];
    const result = await loadProductResults(ids, async (id) => {
      if (id === 'p2') throw new Error('Not found');
      return product(id);
    });
    assert.deepEqual(result, [
      { productId: 'p1', status: 'fulfilled', value: product('p1') },
      { productId: 'p2', status: 'rejected', reason: 'Not found' },
      { productId: 'p3', status: 'fulfilled', value: product('p3') },
    ]);
    assert.deepEqual(ids, before);
  }],
  [4, 'Chờ tất cả settle, không reject sớm khi một request lỗi', async () => {
    const first = deferred();
    const second = deferred();
    const calls = [];
    const state = observe(loadProductResults(['p1', 'p2'], (id) => {
      calls.push(id);
      return id === 'p1' ? first.promise : second.promise;
    }));
    await flushJobs();
    assert.deepEqual(calls, ['p1', 'p2']);
    first.reject(new Error('Unavailable'));
    await flushJobs();
    assert.equal(state.status, 'pending');
    second.resolve(product('p2'));
    await state.done;
    assert.equal(state.status, 'fulfilled');
    assert.deepEqual(state.value, [
      { productId: 'p1', status: 'rejected', reason: 'Unavailable' },
      { productId: 'p2', status: 'fulfilled', value: product('p2') },
    ]);
  }],
  [4, 'Input rỗng và tất cả request lỗi vẫn fulfill kết quả', async () => {
    assert.deepEqual(await loadProductResults([], async () => { assert.fail('Không được gọi khi ids rỗng'); }), []);
    assert.deepEqual(await loadProductResults(['p2', 'p1'], async (id) => {
      throw new Error(`Missing ${id}`);
    }), [
      { productId: 'p2', status: 'rejected', reason: 'Missing p2' },
      { productId: 'p1', status: 'rejected', reason: 'Missing p1' },
    ]);
  }],
];

async function runWithDeadline(run) {
  let timer;
  try {
    await Promise.race([
      Promise.resolve().then(run),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Quá 2000ms: kiểm tra return/await và Promise đang chờ.')), 2000);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

const argument = process.argv[2];
const group = Number(argument);
if (argument !== undefined && ![1, 2, 3, 4].includes(group)) {
  console.error('Chọn bài 1–4. Bỏ số để chạy cả bốn bài.');
  process.exitCode = 1;
} else {
  const selected = checks.filter(([id]) => argument === undefined || id === group);
  let passed = 0;
  for (const [id, title, run] of selected) {
    try {
      await runWithDeadline(run);
      passed += 1;
      console.log(`PASS [Bài ${id}] ${title}`);
    } catch (error) {
      console.log(`FAIL [Bài ${id}] ${title}`);
      console.log(`  ${error.name}: ${error.message}`);
    }
  }
  console.log(`\nKết quả: ${passed}/${selected.length} tình huống đạt.`);
  if (passed !== selected.length) process.exitCode = 1;
}
