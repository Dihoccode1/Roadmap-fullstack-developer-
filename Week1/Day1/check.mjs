import assert from 'node:assert/strict';
import { makeProducts } from './fixtures.mjs';
import {
  findProductById,
  filterInStock,
  calculateTotal,
  updateProductStock,
  updateProductCategory,
} from './products.mjs';

// Đây là yêu cầu thực thi của bài học, không có implementation lời giải.
// Mỗi case dùng dữ liệu mới. Không sửa assertion để bỏ qua lỗi của hàm.
const checks = [];

function check(group, title, run) {
  checks.push({ group, title, run });
}

check('find', 'Tìm thấy product và giữ input nguyên vẹn', () => {
  const products = makeProducts();
  const before = structuredClone(products);
  assert.equal(findProductById(products, 'p003'), products[2]);
  assert.deepEqual(products, before);
});

check('find', 'ID không tồn tại trả undefined', () => {
  assert.equal(findProductById(makeProducts(), 'missing'), undefined);
});

check('find', 'Danh sách rỗng trả undefined', () => {
  assert.equal(findProductById([], 'p001'), undefined);
});

check('filter', 'Chỉ lấy sản phẩm còn hàng, đúng thứ tự', () => {
  const actual = filterInStock(makeProducts());
  assert.deepEqual(actual.map((product) => product.id), ['p001', 'p003', 'p004']);
});

check('filter', 'Danh sách rỗng trả array rỗng', () => {
  assert.deepEqual(filterInStock([]), []);
});

check('filter', 'Array kết quả là array mới, không sửa input', () => {
  const products = makeProducts();
  const before = structuredClone(products);
  const result = filterInStock(products);
  assert.notEqual(result, products);
  assert.deepEqual(products, before);
  result.push({ id: 'test-only' });
  assert.deepEqual(products, before);
});

check('total', 'Tính đúng tổng tiền từ giá trong products', () => {
  const items = [
    { productId: 'p001', quantity: 2 },
    { productId: 'p003', quantity: 1 },
  ];
  assert.equal(calculateTotal(makeProducts(), items), 1825000);
});

check('total', 'Giỏ rỗng có tổng bằng 0', () => {
  assert.equal(calculateTotal(makeProducts(), []), 0);
});

check('total', 'ID không tồn tại gây RangeError', () => {
  assert.throws(
    () => calculateTotal(makeProducts(), [{ productId: 'missing', quantity: 1 }]),
    RangeError,
  );
});

check('total', 'Quantity không hợp lệ gây RangeError', () => {
  const invalidQuantities = [-1, 0, 1.5, NaN, '2', Infinity, Number.MAX_SAFE_INTEGER + 1];
  for (const quantity of invalidQuantities) {
    assert.throws(
      () => calculateTotal(makeProducts(), [{ productId: 'p001', quantity }]),
      RangeError,
      `Quantity phải bị từ chối: ${String(quantity)}`,
    );
  }
});

check('total', 'Nhiều dòng cùng productId vẫn được cộng đủ', () => {
  assert.equal(
    calculateTotal(makeProducts(), [
      { productId: 'p003', quantity: 2 },
      { productId: 'p003', quantity: 3 },
    ]),
    225000,
  );
});

check('total', 'Không sửa products hoặc items', () => {
  const products = makeProducts();
  const items = [{ productId: 'p004', quantity: 2 }];
  const productsBefore = structuredClone(products);
  const itemsBefore = structuredClone(items);
  assert.equal(calculateTotal(products, items), 240000);
  assert.deepEqual(products, productsBefore);
  assert.deepEqual(items, itemsBefore);
});

check('stock', 'Tạo array và product mới, giữ các product khác và input cũ', () => {
  const products = makeProducts();
  const before = structuredClone(products);
  const updated = updateProductStock(products, 'p001', 3);
  assert.notEqual(updated, products);
  assert.notEqual(updated[0], products[0]);
  assert.deepEqual(updated[0], { ...before[0], stock: 3 });
  assert.equal(updated.length, products.length);
  for (let index = 1; index < products.length; index += 1) {
    assert.equal(updated[index], products[index]);
  }
  assert.deepEqual(products, before);
});

check('stock', 'Cho phép stock bằng 0', () => {
  const products = makeProducts();
  const updated = updateProductStock(products, 'p003', 0);
  assert.equal(updated[2].stock, 0);
  assert.equal(products[2].stock, 25);
});

check('stock', 'ID không tồn tại gây RangeError', () => {
  assert.throws(() => updateProductStock(makeProducts(), 'missing', 2), RangeError);
});

check('stock', 'Stock không hợp lệ gây RangeError', () => {
  const invalidStocks = [-1, 1.5, NaN, '2', Infinity, Number.MAX_SAFE_INTEGER + 1];
  for (const stock of invalidStocks) {
    assert.throws(
      () => updateProductStock(makeProducts(), 'p001', stock),
      RangeError,
      `Stock phải bị từ chối: ${String(stock)}`,
    );
  }
});

check('stock', 'Stock cùng giá trị vẫn tuân theo contract tạo bản mới', () => {
  const products = makeProducts();
  const updated = updateProductStock(products, 'p001', products[0].stock);
  assert.notEqual(updated, products);
  assert.notEqual(updated[0], products[0]);
  assert.deepEqual(updated, products);
});

check('category', 'Copy đúng tầng metadata, giữ nhánh không thay đổi', () => {
  const products = makeProducts();
  const before = structuredClone(products);
  const updated = updateProductCategory(products, 'p001', '  gaming  ');
  assert.notEqual(updated, products);
  assert.notEqual(updated[0], products[0]);
  assert.notEqual(updated[0].metadata, products[0].metadata);
  assert.equal(updated[0].metadata.tags, products[0].metadata.tags);
  assert.deepEqual(updated[0], {
    ...before[0],
    metadata: { ...before[0].metadata, category: 'gaming' },
  });
  assert.equal(updated.length, products.length);
  for (let index = 1; index < products.length; index += 1) {
    assert.equal(updated[index], products[index]);
  }
  assert.deepEqual(products, before);
});

check('category', 'ID không tồn tại gây RangeError', () => {
  assert.throws(() => updateProductCategory(makeProducts(), 'missing', 'books'), RangeError);
});

check('category', 'Category rỗng hoặc sai kiểu gây RangeError', () => {
  for (const category of ['', '   ', null, undefined, 42]) {
    assert.throws(() => updateProductCategory(makeProducts(), 'p001', category), RangeError);
  }
});

const selectedGroup = process.argv[2];
const requiredGroups = ['find', 'filter', 'total', 'stock'];
const validGroups = [...requiredGroups, 'category'];

if (selectedGroup !== undefined && !validGroups.includes(selectedGroup)) {
  console.error(`Nhóm không hợp lệ. Chọn: ${validGroups.join(', ')}`);
  process.exitCode = 1;
} else {
  const selectedChecks = checks.filter(({ group }) =>
    selectedGroup === undefined ? requiredGroups.includes(group) : group === selectedGroup,
  );
  let passed = 0;
  for (const { group, title, run } of selectedChecks) {
    try {
      run();
      passed += 1;
      console.log(`PASS [${group}] ${title}`);
    } catch (error) {
      console.log(`FAIL [${group}] ${title}`);
      console.log(`  ${error.name}: ${error.message}`);
    }
  }
  console.log(`\nKết quả: ${passed}/${selectedChecks.length} tình huống đạt.`);
  if (passed !== selectedChecks.length) process.exitCode = 1;
}
