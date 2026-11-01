import assert from 'node:assert/strict';
import {
  createPriceTag, createTotalCallback, createReceiptFormatter, Product, DiscountedProduct,
} from './exercises.mjs';

function makeCart() {
  return {
    items: [{ priceMinor: 100000, quantity: 2 }],
    getTotal() {
      return this.items.reduce((total, item) => total + item.priceMinor * item.quantity, 0);
    },
  };
}

// Assertion kiểm tra hành vi/identity; review cuối ngày đối chiếu thêm cách viết.
const checks = [
  [1, 'Method đọc thuộc tính hiện tại của receiver', () => {
    const tag = createPriceTag('Book', 45000);
    assert.equal(tag.getLabel(), 'Book: 45000 VND');
    tag.name = 'Notebook';
    tag.priceMinor = 50000;
    assert.equal(tag.getLabel(), 'Notebook: 50000 VND');
  }],
  [1, 'Mượn method bằng call sử dụng this mới', () => {
    const tag = createPriceTag('Book', 45000);
    const other = { name: 'Pen', priceMinor: 10000 };
    assert.equal(tag.getLabel.call(other), 'Pen: 10000 VND');
    assert.equal(tag.getLabel(), 'Book: 45000 VND');
  }],
  [1, 'Hai price tag giữ dữ liệu riêng', () => {
    const first = createPriceTag('A', 0);
    const second = createPriceTag('B', 90000);
    assert.equal(first.getLabel(), 'A: 0 VND');
    assert.equal(second.getLabel(), 'B: 90000 VND');
  }],
  [2, 'Callback tách ra vẫn tính total của cart', () => {
    const cart = makeCart();
    const callback = createTotalCallback(cart);
    assert.equal(typeof callback, 'function');
    assert.notEqual(callback, cart.getTotal);
    assert.equal(callback(), 200000);
    assert.equal(callback.call({ items: [] }), 200000);
  }],
  [2, 'Tạo callback không gọi method ngay và không thay method gốc', () => {
    let calls = 0;
    const cart = makeCart();
    const original = cart.getTotal;
    cart.getTotal = function () { calls += 1; return original.call(this); };
    const methodBefore = cart.getTotal;
    const callback = createTotalCallback(cart);
    assert.equal(calls, 0);
    assert.equal(cart.getTotal, methodBefore);
    assert.equal(callback(), 200000);
    assert.equal(calls, 1);
  }],
  [2, 'Callback đọc state mới; hai cart không lẫn receiver', () => {
    const first = makeCart();
    const second = makeCart();
    second.items = [];
    const firstCallback = createTotalCallback(first);
    const secondCallback = createTotalCallback(second);
    first.items.push({ priceMinor: 45000, quantity: 1 });
    assert.equal(firstCallback(), 245000);
    assert.equal(secondCallback(), 0);
  }],
  [3, 'Arrow callback dùng shopName của method bao ngoài', () => {
    const items = [{ name: 'Book', quantity: 2 }, { name: 'Pen', quantity: 1 }];
    const before = structuredClone(items);
    const formatter = createReceiptFormatter('Alpha');
    assert.deepEqual(formatter.formatItems(items), ['Alpha | Book x2', 'Alpha | Pen x1']);
    assert.deepEqual(items, before);
  }],
  [3, 'Borrow method và đổi thuộc tính không dùng tên factory đã capture', () => {
    const formatter = createReceiptFormatter('Alpha');
    const items = [{ name: 'USB', quantity: 3 }];
    assert.deepEqual(formatter.formatItems.call({ shopName: 'Beta' }, items), ['Beta | USB x3']);
    formatter.shopName = 'Gamma';
    assert.deepEqual(formatter.formatItems(items), ['Gamma | USB x3']);
  }],
  [3, 'Danh sách rỗng trả array rỗng', () => {
    assert.deepEqual(createReceiptFormatter('Empty').formatItems([]), []);
  }],
  [4, 'Constructor tạo dữ liệu riêng, method dùng chung trên prototype', () => {
    const first = new Product('Book', 45000);
    const second = new Product('Pen', 10000);
    assert.equal(Object.getPrototypeOf(first), Product.prototype);
    assert.equal(Object.hasOwn(first, 'name'), true);
    assert.equal(Object.hasOwn(first, 'priceMinor'), true);
    assert.equal(Object.hasOwn(first, 'getLabel'), false);
    assert.equal(first.getLabel, Product.prototype.getLabel);
    assert.equal(first.getLabel, second.getLabel);
    assert.equal(first.getLabel(), 'Book: 45000 VND');
    assert.equal(second.getLabel(), 'Pen: 10000 VND');
  }],
  [4, 'Prototype method đọc this, dữ liệu instance không bị dùng chung', () => {
    const first = new Product('A', 100000);
    const second = new Product('B', 200000);
    first.priceMinor = 150000;
    assert.equal(first.getLabel(), 'A: 150000 VND');
    assert.equal(second.getLabel(), 'B: 200000 VND');
    assert.equal(Product.prototype.getLabel.call({ name: 'C', priceMinor: 0 }), 'C: 0 VND');
  }],
  [4, 'Class con kế thừa qua prototype và giữ giá gốc', () => {
    const first = new DiscountedProduct('Book', 200000, 10);
    const second = new DiscountedProduct('Pen', 10000, 100);
    assert.equal(first instanceof DiscountedProduct, true);
    assert.equal(first instanceof Product, true);
    assert.equal(Object.getPrototypeOf(DiscountedProduct.prototype), Product.prototype);
    assert.equal(Object.hasOwn(first, 'discountPercent'), true);
    assert.equal(Object.hasOwn(DiscountedProduct.prototype, 'getLabel'), false);
    assert.equal(first.getLabel, Product.prototype.getLabel);
    assert.equal(first.getFinalPrice, second.getFinalPrice);
    assert.equal(Object.hasOwn(first, 'getFinalPrice'), false);
    assert.equal(first.getFinalPrice(), 180000);
    assert.equal(second.getFinalPrice(), 0);
    assert.equal(first.priceMinor, 200000);
    assert.equal(first.getLabel(), 'Book: 200000 VND');
  }],
];

const argument = process.argv[2];
const group = Number(argument);
if (argument !== undefined && ![1, 2, 3, 4].includes(group)) {
  console.error('Chọn bài 1–4. Bỏ số để chạy cả bốn bài.');
  process.exitCode = 1;
} else {
  // Người học yêu cầu bỏ bài 4; vẫn giữ nhóm để có thể mở lại khi chủ động chọn.
  const selected = checks.filter(([id]) => argument === undefined ? id !== 4 : id === group);
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
  if (argument === undefined) {
    console.log('SKIP [Bài 4]: 3 tình huống prototype/class bỏ qua theo yêu cầu người học.');
  }
  if (passed !== selected.length) process.exitCode = 1;
}
