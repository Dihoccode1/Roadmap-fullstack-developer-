import assert from 'node:assert/strict';
import { makeProducts } from './fixtures.mjs';
import {
  filterInStock,
  calculateTotal,
  updateProductStock,
} from './products.mjs';

// Kiểm tra bổ sung do trợ lý soạn trong lượt review Ngày 1.
// Người học có thể thêm tình huống của riêng mình ở cuối file.

{
  const products = makeProducts();
  const items = [{ productId: 'p001', quantity: 2, priceMinor: 1 }];
  assert.equal(calculateTotal(products, items), 1780000);
  console.log('PASS: tổng tiền dùng giá trong products, bỏ qua giá gắn thêm ở item.');
}

{
  const products = makeProducts();
  const before = structuredClone(products);
  const updated = updateProductStock(products, 'p004', 0);
  assert.equal(updated[3].stock, 0);
  assert.notEqual(updated, products);
  assert.notEqual(updated[3], products[3]);
  assert.equal(updated[0], products[0]);
  assert.deepEqual(products, before);
  console.log('PASS: cập nhật sản phẩm không nằm đầu array, không mutate dữ liệu cũ.');
}

{
  const products = makeProducts().map((product) => ({ ...product, stock: 0 }));
  const before = structuredClone(products);
  const result = filterInStock(products);
  assert.deepEqual(result, []);
  assert.notEqual(result, products);
  assert.deepEqual(products, before);
  console.log('PASS: tất cả sản phẩm hết hàng trả array rỗng, input còn nguyên.');
}

{
  const products = makeProducts();
  const items = [{ productId: 'p003', quantity: 2 }];
  const before = structuredClone({ products, items });
  assert.equal(calculateTotal(products, items), 90000);
  assert.equal(calculateTotal(products, items), 90000);
  assert.deepEqual({ products, items }, before);
  console.log('PASS: tính tổng lặp lại cho cùng input không làm thay đổi dữ liệu.');
}

console.log('\nKết quả: 4/4 tình huống bổ sung đạt.');
