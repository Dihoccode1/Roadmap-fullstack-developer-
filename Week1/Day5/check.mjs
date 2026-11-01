import assert from 'node:assert/strict';
import { createCounter, createOnce, createHistory, createCart } from './exercises.mjs';

function makeCatalog() {
  return [
    { id: 'p001', priceMinor: 100000 },
    { id: 'p002', priceMinor: 45000 },
  ];
}

// Hành vi được kiểm tra bằng assertion; cuối buổi review thêm vị trí giữ state.
const checks = [
  [1, 'Counter mặc định, các method đọc cùng state', () => {
    const counter = createCounter();
    assert.equal(counter.getValue(), 0);
    assert.equal(counter.increment(), 1);
    assert.equal(counter.increment(), 2);
    assert.equal(counter.decrement(), 1);
    assert.equal(counter.getValue(), 1);
  }],
  [1, 'Reset về initialValue và method tách ra vẫn hoạt động', () => {
    const { increment, getValue, reset } = createCounter(5);
    assert.equal(increment(), 6);
    assert.equal(getValue(), 6);
    assert.equal(reset(), 5);
    assert.equal(getValue(), 5);
  }],
  [1, 'Hai counter độc lập', () => {
    const first = createCounter(10);
    const second = createCounter(-2);
    assert.equal(first.increment(), 11);
    assert.equal(second.decrement(), -3);
    assert.equal(first.getValue(), 11);
    assert.equal(second.reset(), -2);
    assert.equal(first.getValue(), 11);
  }],
  [2, 'Chỉ gọi fn lần đầu, giữ kết quả với args đầu', () => {
    let calls = 0;
    const once = createOnce((a, b) => { calls += 1; return a + b; });
    assert.equal(once(2, 3), 5);
    assert.equal(once(50, 60), 5);
    assert.equal(calls, 1);
  }],
  [2, 'Kết quả falsy vẫn chỉ được tính một lần', () => {
    for (const result of [0, false, '', undefined]) {
      let calls = 0;
      const once = createOnce(() => { calls += 1; return result; });
      assert.equal(once(), result);
      assert.equal(once(), result);
      assert.equal(calls, 1);
    }
  }],
  [2, 'Hai wrapper độc lập và kết quả object giữ identity', () => {
    const object = { id: 'first' };
    let firstCalls = 0;
    let secondCalls = 0;
    const first = createOnce(() => { firstCalls += 1; return object; });
    const second = createOnce(() => { secondCalls += 1; return 99; });
    assert.equal(first(), object);
    assert.equal(first(), object);
    assert.equal(second(), 99);
    assert.equal(second(), 99);
    assert.equal(firstCalls, 1);
    assert.equal(secondCalls, 1);
  }],
  [3, 'History giữ thứ tự và trả độ dài', () => {
    const history = createHistory();
    assert.deepEqual(history.getAll(), []);
    assert.equal(history.add('login'), 1);
    assert.equal(history.add('checkout'), 2);
    assert.deepEqual(history.getAll(), ['login', 'checkout']);
  }],
  [3, 'Snapshot không làm lộ state và không tự đổi theo lần add sau', () => {
    const history = createHistory();
    history.add('first');
    const snapshot = history.getAll();
    snapshot.push('external');
    assert.deepEqual(history.getAll(), ['first']);
    history.add('second');
    assert.deepEqual(snapshot, ['first', 'external']);
    assert.deepEqual(history.getAll(), ['first', 'second']);
  }],
  [3, 'Clear dùng được qua method tách ra, hai history độc lập', () => {
    const first = createHistory();
    const second = createHistory();
    first.add('A');
    second.add('B');
    const { clear, getAll, add } = first;
    assert.equal(clear(), undefined);
    assert.deepEqual(getAll(), []);
    assert.equal(add('C'), 1);
    assert.deepEqual(second.getAll(), ['B']);
  }],
  [4, 'Cart thêm, cộng quantity, tính tổng và xóa đúng dòng', () => {
    const cart = createCart(makeCatalog());
    assert.deepEqual(cart.getItems(), []);
    assert.equal(cart.getTotal(), 0);
    assert.equal(cart.add('p001', 2), 2);
    assert.equal(cart.add('p002'), 1);
    assert.equal(cart.add('p001'), 3);
    assert.deepEqual(cart.getItems(), [
      { productId: 'p001', priceMinor: 100000, quantity: 3 },
      { productId: 'p002', priceMinor: 45000, quantity: 1 },
    ]);
    assert.equal(cart.getTotal(), 345000);
    assert.equal(cart.remove('p001'), true);
    assert.equal(cart.getTotal(), 45000);
    assert.equal(cart.remove('p001'), false);
    assert.equal(cart.remove('p002'), true);
    assert.equal(cart.getTotal(), 0);
  }],
  [4, 'Snapshot copy cả item, giỏ độc lập và catalog không bị sửa', () => {
    const catalog = makeCatalog();
    const before = structuredClone(catalog);
    const first = createCart(catalog);
    const second = createCart(catalog);
    const { add, getItems, getTotal } = first;
    add('p001', 2);
    const snapshot = getItems();
    snapshot[0].quantity = 999;
    snapshot[0].priceMinor = 1;
    snapshot.push({ productId: 'external', priceMinor: 1, quantity: 1 });
    assert.deepEqual(getItems(), [{ productId: 'p001', priceMinor: 100000, quantity: 2 }]);
    assert.equal(getTotal(), 200000);
    add('p001');
    assert.equal(snapshot[0].quantity, 999);
    assert.deepEqual(second.getItems(), []);
    second.add('p002');
    assert.equal(getTotal(), 300000);
    assert.equal(second.getTotal(), 45000);
    assert.deepEqual(catalog, before);
  }],
  [4, 'Input sai ném RangeError và không đổi giỏ đã có', () => {
    const cart = createCart(makeCatalog());
    cart.add('p001');
    const before = cart.getItems();
    assert.throws(() => cart.add('missing'), RangeError);
    for (const quantity of [0, -1, 1.5, NaN, '2', Infinity, Number.MAX_SAFE_INTEGER + 1]) {
      assert.throws(() => cart.add('p001', quantity), RangeError);
    }
    assert.deepEqual(cart.getItems(), before);
    assert.equal(cart.getTotal(), 100000);
  }],
];

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
      run();
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
