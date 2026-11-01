import assert from 'node:assert/strict';
import { delay, getProductName, getOrderPreview, getProductNameSafe } from './exercises.mjs';

const checks = [
  [1, 'Trả Promise và fulfill đúng value', async () => {
    const pending = delay(5, 'ready');
    assert.equal(typeof pending?.then, 'function');
    assert.equal(await pending, 'ready');
  }],
  [1, 'Timer 0 vẫn không fulfill ngay trong microtask hiện tại', async () => {
    let settled = false;
    const pending = delay(0, 7);
    pending.then(() => { settled = true; }, () => { settled = true; });
    assert.equal(settled, false);
    await Promise.resolve();
    assert.equal(settled, false);
    assert.equal(await pending, 7);
  }],
  [1, 'Giữ kết quả falsy và object identity', async () => {
    for (const value of [0, false, '', undefined]) {
      assert.equal(await delay(0, value), value);
    }
    const object = { id: 'p1' };
    assert.equal(await delay(0, object), object);
  }],
  [2, 'Lấy tên từ giá trị fulfilled', async () => {
    const product = { id: 'p1', name: 'Keyboard', priceMinor: 100000 };
    const pending = getProductName('p1', (id) => {
      assert.equal(id, 'p1');
      return Promise.resolve(product);
    });
    assert.equal(typeof pending?.then, 'function');
    assert.equal(await pending, 'Keyboard');
  }],
  [2, 'Reject với chính Error của dependency', async () => {
    const failure = new Error('Product not found');
    await assert.rejects(
      () => getProductName('missing', () => Promise.reject(failure)),
      (error) => error === failure,
    );
  }],
  [2, 'Chỉ gọi dependency một lần và không sửa product', async () => {
    let calls = 0;
    const product = { id: 'p2', name: 'Mouse', priceMinor: 45000 };
    const before = structuredClone(product);
    const result = await getProductName('p2', (id) => {
      calls += 1;
      assert.equal(id, 'p2');
      return Promise.resolve(product);
    });
    assert.equal(result, 'Mouse');
    assert.equal(calls, 1);
    assert.deepEqual(product, before);
  }],
  [3, 'Await product trước khi tạo preview', async () => {
    const product = { id: 'p1', name: 'Keyboard', priceMinor: 100000 };
    assert.deepEqual(await getOrderPreview('p1', 2, async () => product), {
      productId: 'p1', name: 'Keyboard', quantity: 2, total: 200000,
    });
  }],
  [3, 'Đúng tham số, một lần gọi và không mutate product', async () => {
    let calls = 0;
    const product = { id: 'p2', name: 'Mouse', priceMinor: 45000 };
    const before = structuredClone(product);
    const preview = await getOrderPreview('p2', 3, async (id) => {
      calls += 1;
      assert.equal(id, 'p2');
      return product;
    });
    assert.deepEqual(preview, { productId: 'p2', name: 'Mouse', quantity: 3, total: 135000 });
    assert.equal(calls, 1);
    assert.deepEqual(product, before);
  }],
  [3, 'Lỗi dependency tiếp tục reject, không tạo preview sai', async () => {
    const failure = new Error('Service unavailable');
    await assert.rejects(
      () => getOrderPreview('p1', 1, async () => { throw failure; }),
      (error) => error === failure,
    );
  }],
  [4, 'Thành công và finally ghi end', async () => {
    const events = [];
    let calls = 0;
    const result = await getProductNameSafe('p1', async (id) => {
      calls += 1;
      assert.equal(id, 'p1');
      return { id, name: 'Keyboard', priceMinor: 100000 };
    }, events);
    assert.deepEqual(result, { ok: true, name: 'Keyboard' });
    assert.deepEqual(events, ['start', 'success', 'end']);
    assert.equal(calls, 1);
  }],
  [4, 'Bắt rejection và finally vẫn chạy', async () => {
    const events = [];
    const result = await getProductNameSafe('p1', async () => {
      throw new Error('Network error');
    }, events);
    assert.deepEqual(result, { ok: false, error: 'Network error' });
    assert.deepEqual(events, ['start', 'error', 'end']);
  }],
  [4, 'Bắt cả lỗi đồng bộ, events là tham số tùy chọn', async () => {
    const events = [];
    const fetchProduct = () => { throw new Error('Invalid request'); };
    assert.deepEqual(await getProductNameSafe('p1', fetchProduct, events), {
      ok: false, error: 'Invalid request',
    });
    assert.deepEqual(events, ['start', 'error', 'end']);
    assert.deepEqual(await getProductNameSafe('p1', fetchProduct), {
      ok: false, error: 'Invalid request',
    });
  }],
];

// Chỉ dùng trong công cụ kiểm tra: chặn case có Promise không bao giờ settle.
async function runWithDeadline(run) {
  let timer;
  try {
    await Promise.race([
      Promise.resolve().then(run),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('Quá 1500ms: kiểm tra return/resolve/await.')), 1500);
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
