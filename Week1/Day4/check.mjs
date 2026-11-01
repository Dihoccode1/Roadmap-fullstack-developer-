import assert from 'node:assert/strict';
import {
  getShopLabel,
  createProductLabeler,
  createPriceCalculator,
  createAccessChecker,
} from './exercises.mjs';

// Assertion kiểm tra hành vi; cuối ngày review thêm cấu trúc lexical scope.
// Bài scope không kiểm tra làm tròn tiền; chấp nhận sai số floating-point rất nhỏ.
function assertAmount(actual, expected) {
  assert.ok(
    Number.isFinite(actual) && Math.abs(actual - expected) < 0.000001,
    `Tổng tiền mong đợi ${expected}, nhận ${actual}`,
  );
}

function assertPriceResult(actual, expected) {
  const { total, ...actualFields } = actual;
  const { total: expectedTotal, ...expectedFields } = expected;
  assert.deepEqual(actualFields, expectedFields);
  assertAmount(total, expectedTotal);
}

const checks = [
  [1, 'Đọc shopName nơi helper được khai báo', () => {
    assert.equal(getShopLabel('Book House'), 'Shop: Book House');
  }],
  [1, 'Không hardcode tên shop', () => {
    assert.equal(getShopLabel('Tech Corner'), 'Shop: Tech Corner');
  }],
  [1, 'Các lần gọi không dùng chung cấu hình', () => {
    assert.equal(getShopLabel('A'), 'Shop: A');
    assert.equal(getShopLabel('B'), 'Shop: B');
  }],
  [2, 'Factory trả function ghép category và name', () => {
    const label = createProductLabeler('Books');
    assert.equal(typeof label, 'function');
    assert.equal(label('JavaScript'), 'Books: JavaScript');
  }],
  [2, 'Hai factory độc lập, gọi xen kẽ vẫn đúng', () => {
    const books = createProductLabeler('Books');
    const devices = createProductLabeler('Devices');
    assert.equal(books('TypeScript'), 'Books: TypeScript');
    assert.equal(devices('Keyboard'), 'Devices: Keyboard');
    assert.equal(books('Node'), 'Books: Node');
  }],
  [2, 'Local variable của caller không thay category đã được giữ', () => {
    const label = createProductLabeler('Office');
    function callWithDifferentCategory() {
      const category = 'Caller Category';
      return label('Pen');
    }
    assert.equal(callWithDifferentCategory(), 'Office: Pen');
  }],
  [3, 'Giảm giá trước khi tính thuế', () => {
    assertPriceResult(createPriceCalculator(200000, 0.1)(10), {
      currency: 'VND', basePrice: 200000, discountedPrice: 180000, total: 198000,
    });
  }],
  [3, 'Discount mặc định và giảm toàn bộ', () => {
    const calculate = createPriceCalculator(100000, 0.1);
    assertPriceResult(calculate(), {
      currency: 'VND', basePrice: 100000, discountedPrice: 100000, total: 110000,
    });
    assertPriceResult(calculate(100), {
      currency: 'VND', basePrice: 100000, discountedPrice: 0, total: 0,
    });
  }],
  [3, 'Hai calculator giữ giá và thuế riêng; mỗi lần gọi có discount riêng', () => {
    const first = createPriceCalculator(200000, 0.1);
    const second = createPriceCalculator(50000, 0);
    assertAmount(first(10).total, 198000);
    assertAmount(second(20).total, 40000);
    assertAmount(first(0).total, 220000);
  }],
  [4, 'Kiểm tra role được cấu hình', () => {
    const canAdmin = createAccessChecker('admin');
    assert.equal(canAdmin({ roles: ['customer', 'admin'] }), true);
    assert.equal(canAdmin({ roles: ['customer'] }), false);
  }],
  [4, 'User không có role, input không bị sửa', () => {
    const user = { roles: [] };
    const before = structuredClone(user);
    assert.equal(createAccessChecker('editor')(user), false);
    assert.deepEqual(user, before);
  }],
  [4, 'Hai checker và các user độc lập', () => {
    const canAdmin = createAccessChecker('admin');
    const canEditor = createAccessChecker('editor');
    assert.equal(canAdmin({ roles: ['admin'] }), true);
    assert.equal(canEditor({ roles: ['admin'] }), false);
    assert.equal(canEditor({ roles: ['editor'] }), true);
    assert.equal(canAdmin({ roles: [] }), false);
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
