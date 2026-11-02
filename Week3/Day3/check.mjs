import assert from 'node:assert/strict';
import { isCartItem, parseCartItems, setCartQuantity, createCart } from './exercises.ts';

function item(id, quantity = 1, priceInCents = 100) {
  return Object.freeze({ product: Object.freeze({ id, name: id.toUpperCase(), priceInCents }), quantity });
}

const checks = [
  [1, 'CartItem hợp lệ với product giá 0, giữ nguyên input/trường phụ', () => {
    const value = Object.freeze({ ...item('p1', 2, 0), note: 'keep' });
    assert.equal(isCartItem(value), true);
    assert.deepEqual(value, { product: { id: 'p1', name: 'P1', priceInCents: 0 }, quantity: 2, note: 'keep' });
    assert.equal(isCartItem(item('p2', 1, 105)), true);
  }],
  [1, 'Null/primitive/array không phải CartItem, không throw', () => {
    const disguised = Object.assign([], item('p1'));
    for (const value of [null, undefined, 0, true, 'cart', () => {}, [], disguised]) {
      assert.equal(isCartItem(value), false);
    }
  }],
  [1, 'Kiểm tra cả Product lồng nhau và quantity nguyên dương', () => {
    const valid = item('p1');
    for (const quantity of [0, -1, 0.5, NaN, Infinity, '2', null, undefined]) {
      assert.equal(isCartItem({ ...valid, quantity }), false);
    }
    for (const product of [null, {}, [], { id: 'p1', name: 'P1', priceInCents: '100' }, { id: '', name: 'P1', priceInCents: 100 }]) {
      assert.equal(isCartItem({ product, quantity: 1 }), false);
    }
    assert.equal(isCartItem({ product: valid.product }), false);
  }],
  [2, 'Parse trả array mới, giữ item/product reference và rỗng hợp lệ', () => {
    const first = item('p1');
    const second = item('p2', 2, 0);
    const input = Object.freeze([first, second]);
    const result = parseCartItems(input);
    assert.deepEqual(result, input);
    assert.notEqual(result, input);
    assert.equal(result[0], first);
    assert.equal(result[0].product, first.product);
    const empty = [];
    assert.deepEqual(parseCartItems(empty), []);
    assert.notEqual(parseCartItems(empty), empty);
  }],
  [2, 'Không array hoặc item lỗi có thông báo đúng index', () => {
    for (const value of [null, undefined, {}, '[]', 0]) {
      assert.throws(() => parseCartItems(value), (error) => error instanceof Error && error.message === 'Cart must be an array');
    }
    assert.throws(() => parseCartItems([item('p1'), { product: {}, quantity: 1 }]),
      (error) => error.message === 'Invalid cart item at index 1');
    assert.throws(() => parseCartItems(new Array(1)), (error) => error.message === 'Invalid cart item at index 0');
  }],
  [2, 'Từ chối ID trùng, không gộp/bỏ dòng; lỗi đầu tiên theo thứ tự', () => {
    const first = item('p1');
    const input = Object.freeze([first, first]);
    assert.throws(() => parseCartItems(input), (error) => error.message === 'Duplicate product id: p1');
    assert.deepEqual(input, [first, first]);
    assert.throws(() => parseCartItems([first, first, {}]), (error) => error.message === 'Duplicate product id: p1');
    assert.throws(() => parseCartItems([{}, first, first]), (error) => error.message === 'Invalid cart item at index 0');
    const spaced = item(' p1 ');
    assert.deepEqual(parseCartItems([first, spaced]), [first, spaced], 'Không tự trim ID');
  }],
  [3, 'Update tạo array/item mới, giữ Product và các dòng không đổi', () => {
    const first = item('p1', 1, 105);
    const second = item('p2', 2, 50);
    const input = Object.freeze([first, second]);
    const result = setCartQuantity(input, 'p1', 3);
    assert.notEqual(result, input);
    assert.notEqual(result[0], first);
    assert.equal(result[0].product, first.product);
    assert.equal(result[0].quantity, 3);
    assert.equal(result[1], second);
    assert.equal(first.quantity, 1);
    const unchanged = setCartQuantity(input, 'p1', 1);
    assert.notEqual(unchanged, input);
    assert.notEqual(unchanged[0], first);
    assert.deepEqual(unchanged, input);
  }],
  [3, 'Set 0 xóa dòng; ID không tồn tại không tự thêm sản phẩm', () => {
    const first = item('p1');
    const second = item('p2');
    const input = Object.freeze([first, second]);
    const result = setCartQuantity(input, 'p1', 0);
    assert.deepEqual(result, [second]);
    assert.equal(result[0], second);
    assert.deepEqual(input, [first, second]);
    for (const quantity of [0, 2]) {
      assert.throws(() => setCartQuantity(input, 'missing', quantity), (error) => error.message === 'Product not found');
    }
    assert.throws(() => setCartQuantity([], 'p1', 0), (error) => error.message === 'Product not found');
  }],
  [3, 'Validate quantity trước tìm ID, không làm đổi input khi lỗi', () => {
    const input = Object.freeze([item('p1')]);
    const before = structuredClone(input);
    for (const quantity of [-1, 0.5, NaN, Infinity]) {
      for (const id of ['p1', 'missing']) {
        assert.throws(() => setCartQuantity(input, id, quantity),
          (error) => error instanceof RangeError && error.message === 'quantity must be a non-negative integer');
      }
    }
    assert.deepEqual(input, before);
  }],
  [4, 'Cart có state/snapshot riêng và summary mới đúng giá trị', () => {
    const first = item('p1', 2, 105);
    const initial = [first];
    const cart = createCart(initial);
    const snapshot = cart.getItems();
    assert.notEqual(snapshot, initial);
    assert.notEqual(snapshot, cart.getItems());
    assert.equal(snapshot[0], first);
    initial.push(item('p2'));
    assert.deepEqual(cart.getItems(), [first]);
    const summary = cart.getSummary();
    assert.deepEqual(summary, { lineCount: 1, totalQuantity: 2, totalInCents: 210 });
    summary.totalInCents = 999;
    assert.deepEqual(cart.getSummary(), { lineCount: 1, totalQuantity: 2, totalInCents: 210 });
    assert.notEqual(summary, cart.getSummary());
  }],
  [4, 'Update/xóa thành công; lỗi giữ state cũ, snapshot cũ không đổi', () => {
    const cart = createCart([item('p1', 1, 105), item('p2', 2, 50)]);
    const before = cart.getItems();
    assert.deepEqual(cart.setQuantity('p1', 3), { lineCount: 2, totalQuantity: 5, totalInCents: 415 });
    assert.equal(cart.getItems()[0].quantity, 3);
    assert.equal(before[0].quantity, 1);
    assert.deepEqual(cart.setQuantity('p2', 0), { lineCount: 1, totalQuantity: 3, totalInCents: 315 });
    const saved = cart.getItems();
    assert.throws(() => cart.setQuantity('p1', -1), (error) => error instanceof RangeError);
    assert.throws(() => cart.setQuantity('missing', 1), (error) => error.message === 'Product not found');
    assert.deepEqual(cart.getItems(), saved);
    assert.deepEqual(cart.getSummary(), { lineCount: 1, totalQuantity: 3, totalInCents: 315 });
  }],
  [4, 'Detached method/instance độc lập; initial lỗi không fallback giỏ rỗng', () => {
    const first = createCart([item('p1')]);
    const second = createCart([]);
    const { getItems, getSummary, setQuantity } = first;
    assert.deepEqual(setQuantity('p1', 2), { lineCount: 1, totalQuantity: 2, totalInCents: 200 });
    assert.equal(getItems()[0].quantity, 2);
    assert.deepEqual(getSummary(), { lineCount: 1, totalQuantity: 2, totalInCents: 200 });
    assert.deepEqual(second.getSummary(), { lineCount: 0, totalQuantity: 0, totalInCents: 0 });
    assert.throws(() => createCart(null), (error) => error.message === 'Cart must be an array');
    assert.throws(() => createCart([{}]), (error) => error.message === 'Invalid cart item at index 0');
    assert.throws(() => createCart([item('p1'), item('p1')]), (error) => error.message === 'Duplicate product id: p1');
  }],
];

const requested = process.argv.slice(2);
if (requested.length > 1 || (requested.length === 1 && !/^[1-4]$/.test(requested[0]))) {
  console.error('Cách chạy: node Week3/Day3/check.mjs [1|2|3|4]');
  process.exitCode = 1;
} else {
  const selected = requested.length ? checks.filter(([group]) => group === Number(requested[0])) : checks;
  let passed = 0;
  for (const [group, label, run] of selected) {
    try {
      await run();
      passed += 1;
      console.log(`PASS Bài ${group}: ${label}`);
    } catch (error) {
      console.error(`FAIL Bài ${group}: ${label}\n  ${error.message}`);
    }
  }
  console.log(`\nRuntime: ${passed}/${selected.length} tình huống đạt.`);
  console.log('Typecheck riêng: npm --prefix Week3 run typecheck:day3');
  if (passed !== selected.length) process.exitCode = 1;
}
