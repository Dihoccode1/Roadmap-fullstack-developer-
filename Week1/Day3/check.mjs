import assert from 'node:assert/strict';
import {
  calculateCheckout,
  sumTo,
  countCategoryProducts,
  sumToIterative,
} from './exercises.mjs';

const checks = [
  [1, 'Giá trị trả về đi qua các hàm con', () => {
    assert.equal(calculateCheckout(100000, 2, 30000), 230000);
  }],
  [1, 'Caller tiếp tục sau khi hàm con kết thúc', () => {
    const events = [];
    assert.equal(calculateCheckout(45000, 3, 0, events), 135000);
    assert.deepEqual(events, [
      'enter calculateCheckout',
      'enter calculateSubtotal',
      'enter multiply',
      'exit multiply',
      'exit calculateSubtotal',
      'enter addShipping',
      'exit addShipping',
      'exit calculateCheckout',
    ]);
  }],
  [1, 'Các lần gọi có dữ liệu riêng', () => {
    assert.equal(calculateCheckout(50000, 1, 10000), 60000);
    assert.equal(calculateCheckout(20000, 4, 5000), 85000);
  }],
  [2, 'Base case n bằng 0', () => {
    assert.equal(sumTo(0), 0);
  }],
  [2, 'Đệ quy tiến về base case và cộng khi quay về', () => {
    assert.equal(sumTo(3), 6);
    assert.equal(sumTo(1), 1);
  }],
  [2, 'Tổng với n bằng 100', () => {
    assert.equal(sumTo(100), 5050);
  }],
  [3, 'Node lá', () => {
    assert.equal(countCategoryProducts({ name: 'leaf', productCount: 4, children: [] }), 4);
  }],
  [3, 'Cây nhiều nhánh và nhiều tầng, input không đổi', () => {
    const tree = {
      name: 'root', productCount: 2,
      children: [
        { name: 'A', productCount: 3, children: [] },
        { name: 'B', productCount: 4,
          children: [{ name: 'B1', productCount: 1, children: [] }] },
      ],
    };
    const before = structuredClone(tree);
    assert.equal(countCategoryProducts(tree), 10);
    assert.deepEqual(tree, before);
  }],
  [3, 'Không giữ tổng của lần gọi trước', () => {
    assert.equal(countCategoryProducts({ name: 'A', productCount: 5, children: [] }), 5);
    assert.equal(countCategoryProducts({ name: 'B', productCount: 0, children: [] }), 0);
  }],
  [4, 'Vòng lặp với n bằng 0 và n nhỏ', () => {
    assert.equal(sumToIterative(0), 0);
    assert.equal(sumToIterative(3), 6);
  }],
  [4, 'Input lớn không cần chuỗi recursive frames', () => {
    assert.equal(sumToIterative(100000), 5000050000);
  }],
  [4, 'Gọi nhiều lần không dùng chung biến cộng dồn', () => {
    assert.equal(sumToIterative(10), 55);
    assert.equal(sumToIterative(2), 3);
  }],
];

const argument = process.argv[2];
const selectedGroup = Number(argument);

if (argument !== undefined && ![1, 2, 3, 4].includes(selectedGroup)) {
  console.error('Chọn bài 1–4. Bỏ số để chạy cả bốn bài.');
  process.exitCode = 1;
} else {
  const selected = checks.filter(([group]) => argument === undefined || group === selectedGroup);
  let passed = 0;
  for (const [group, title, run] of selected) {
    try {
      run();
      passed += 1;
      console.log(`PASS [Bài ${group}] ${title}`);
    } catch (error) {
      console.log(`FAIL [Bài ${group}] ${title}`);
      console.log(`  ${error.name}: ${error.message}`);
    }
  }
  console.log(`\nKết quả: ${passed}/${selected.length} tình huống đạt.`);
  if (passed !== selected.length) process.exitCode = 1;
}
