import assert from 'node:assert/strict';
import { calculateLineTotal, applyDiscount, getDisplayName, summarizeCart } from './exercises.ts';

// Node chạy TypeScript bằng type stripping; đây chỉ là runtime check.
// Cần chạy thêm: npm --prefix Week3 run typecheck:day1
// Input đúng hợp đồng: kiểm tra bất biến, kết quả và optional property.
const checks = [
  [1, 'Đơn giá nhân số lượng, kết quả thực sự là number', () => {
    assert.equal(calculateLineTotal(1250, 3), 3750);
    assert.equal(typeof calculateLineTotal(1250, 3), 'number');
    assert.equal(calculateLineTotal(1, 1), 1);
  }],
  [1, 'Giá hoặc số lượng bằng 0 giữ đúng số 0', () => {
    assert.equal(calculateLineTotal(0, 5), 0);
    assert.equal(calculateLineTotal(1250, 0), 0);
    assert.equal(calculateLineTotal(0, 0), 0);
  }],
  [1, 'Không cộng nhầm đơn giá/số lượng hoặc làm tròn sớm', () => {
    assert.equal(calculateLineTotal(1999, 7), 13993);
    assert.equal(calculateLineTotal(105, 2), 210);
    assert.equal(calculateLineTotal(25, 12), 300);
  }],
  [2, 'Giảm giá và làm tròn đến cent, giữ id/name', () => {
    const product = Object.freeze({ id: 'p1', name: 'Book', priceInCents: 105 });
    const result = applyDiscount(product, 10);
    assert.deepEqual(result, { id: 'p1', name: 'Book', priceInCents: 95 });
    assert.notEqual(result, product);
    assert.deepEqual(product, { id: 'p1', name: 'Book', priceInCents: 105 });
  }],
  [2, 'Giảm 0% vẫn tạo object mới, không sửa input', () => {
    const product = Object.freeze({ id: 'p2', name: 'Pen', priceInCents: 999 });
    const result = applyDiscount(product, 0);
    assert.deepEqual(result, product);
    assert.notEqual(result, product);
    assert.equal(product.priceInCents, 999);
  }],
  [2, 'Giảm 100% và sản phẩm giá 0 giữ đúng kết quả', () => {
    assert.deepEqual(applyDiscount({ id: 'p3', name: 'Bag', priceInCents: 2500 }, 100), {
      id: 'p3', name: 'Bag', priceInCents: 0,
    });
    assert.deepEqual(applyDiscount({ id: 'free', name: 'Gift', priceInCents: 0 }, 25), {
      id: 'free', name: 'Gift', priceInCents: 0,
    });
  }],
  [3, 'Tên hiển thị được trim và profile giữ nguyên', () => {
    const profile = Object.freeze({ username: 'linh', displayName: '  Linh Nguyen  ' });
    assert.equal(getDisplayName(profile), 'Linh Nguyen');
    assert.equal(profile.displayName, '  Linh Nguyen  ');
  }],
  [3, 'Optional displayName thiếu thì trả username nguyên bản', () => {
    assert.equal(getDisplayName({ username: '  user01  ' }), '  user01  ');
    assert.equal(getDisplayName({ username: 'linh' }), 'linh');
  }],
  [3, 'Tên rỗng/toàn khoảng trắng fallback; chuỗi 0 vẫn là tên hợp lệ', () => {
    assert.equal(getDisplayName({ username: 'linh', displayName: '' }), 'linh');
    assert.equal(getDisplayName({ username: 'linh', displayName: ' \t\n ' }), 'linh');
    assert.equal(getDisplayName({ username: 'linh', displayName: ' 0 ' }), '0');
  }],
  [4, 'Tổng hợp giỏ hàng, không sửa array/item/product', () => {
    const first = Object.freeze({ id: 'p1', name: 'Book', priceInCents: 1250 });
    const second = Object.freeze({ id: 'p2', name: 'Pen', priceInCents: 105 });
    const items = Object.freeze([
      Object.freeze({ product: first, quantity: 2 }),
      Object.freeze({ product: second, quantity: 3 }),
    ]);
    const before = structuredClone(items);
    assert.deepEqual(summarizeCart(items), { lineCount: 2, totalQuantity: 5, totalInCents: 2815 });
    assert.deepEqual(items, before);
    assert.equal(items[0].product, first);
  }],
  [4, 'Giỏ rỗng hoặc dòng quantity/giá 0', () => {
    assert.deepEqual(summarizeCart([]), { lineCount: 0, totalQuantity: 0, totalInCents: 0 });
    assert.deepEqual(summarizeCart([
      { product: { id: 'gift', name: 'Gift', priceInCents: 0 }, quantity: 3 },
      { product: { id: 'p1', name: 'Book', priceInCents: 100 }, quantity: 0 },
    ]), { lineCount: 2, totalQuantity: 3, totalInCents: 0 });
  }],
  [4, 'ID lặp vẫn là dòng riêng; kết quả các lần gọi độc lập', () => {
    const product = { id: 'p1', name: 'Book', priceInCents: 105 };
    const result = summarizeCart([{ product, quantity: 1 }, { product, quantity: 2 }]);
    assert.deepEqual(result, { lineCount: 2, totalQuantity: 3, totalInCents: 315 });
    result.totalInCents = 999;
    assert.deepEqual(summarizeCart([{ product, quantity: 1 }]), {
      lineCount: 1, totalQuantity: 1, totalInCents: 105,
    });
  }],
];

const requested = process.argv.slice(2);
if (requested.length > 1 || (requested.length === 1 && !/^[1-4]$/.test(requested[0]))) {
  console.error('Cách chạy: node Week3/Day1/check.mjs [1|2|3|4]');
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
  console.log('Typecheck riêng: npm --prefix Week3 run typecheck:day1');
  if (passed !== selected.length) process.exitCode = 1;
}
