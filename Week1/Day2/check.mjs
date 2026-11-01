import assert from 'node:assert/strict';
import {
  calculateOrderTotal,
  getPriceSummary,
  formatProductLabel,
  calculateInvoice,
  summarizeCart,
} from './exercises.mjs';

// Chỉ kiểm tra hành vi; khi review sẽ đọc code để đối chiếu scope/cách khai báo.
const checks = [
  [1, 'Tổng của nhiều giá', () => {
    assert.equal(calculateOrderTotal([100000, 50000, 25000]), 175000);
  }],
  [1, 'Danh sách rỗng', () => {
    assert.equal(calculateOrderTotal([]), 0);
  }],
  [1, 'Các lần gọi không dùng chung biến cộng dồn', () => {
    assert.equal(calculateOrderTotal([10]), 10);
    assert.equal(calculateOrderTotal([20, 30]), 50);
  }],
  [2, 'Giảm giá 10%, giữ giá gốc', () => {
    assert.deepEqual(getPriceSummary(200000, 10), {
      originalPrice: 200000, finalPrice: 180000,
    });
  }],
  [2, 'Không giảm giá', () => {
    assert.deepEqual(getPriceSummary(150000, 0), {
      originalPrice: 150000, finalPrice: 150000,
    });
  }],
  [2, 'Giảm giá toàn bộ', () => {
    assert.deepEqual(getPriceSummary(80000, 100), {
      originalPrice: 80000, finalPrice: 0,
    });
  }],
  [3, 'Trim và viết hoa', () => {
    assert.equal(formatProductLabel('  keyboard  '), 'PRODUCT: KEYBOARD');
  }],
  [3, 'Tên gồm nhiều từ', () => {
    assert.equal(formatProductLabel('wireless mouse'), 'PRODUCT: WIRELESS MOUSE');
  }],
  [3, 'Tên đã viết hoa', () => {
    assert.equal(formatProductLabel('USB'), 'PRODUCT: USB');
  }],
  [4, 'Có thuế 10%', () => {
    assert.equal(calculateInvoice(100000, 0.1), 110000);
  }],
  [4, 'Thuế bằng 0', () => {
    assert.equal(calculateInvoice(50000, 0), 50000);
  }],
  [4, 'Subtotal bằng 0', () => {
    assert.equal(calculateInvoice(0, 0.1), 0);
  }],
  ['bonus', 'Giảm giá trước, thuế sau; input không bị sửa', () => {
    const items = [{ price: 100000, quantity: 2 }, { price: 50000, quantity: 1 }];
    const before = structuredClone(items);
    assert.deepEqual(summarizeCart(items, 10, 0.1), {
      subtotal: 250000, discountAmount: 25000, taxAmount: 22500,
      total: 247500, itemCount: 3,
    });
    assert.deepEqual(items, before);
  }],
  ['bonus', 'Giỏ rỗng với tỷ lệ mặc định', () => {
    assert.deepEqual(summarizeCart([]), {
      subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0, itemCount: 0,
    });
  }],
];

const argument = process.argv[2];
const group = argument === 'bonus' ? 'bonus' : Number(argument);
if (argument !== undefined && ![1, 2, 3, 4, 'bonus'].includes(group)) {
  console.error('Chọn bài 1, 2, 3, 4 hoặc bonus. Bỏ số để chạy bốn bài bắt buộc.');
  process.exitCode = 1;
} else {
  const selected = checks.filter(([id]) => argument === undefined ? id !== 'bonus' : id === group);
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
