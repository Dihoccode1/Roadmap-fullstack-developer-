import assert from 'node:assert/strict';
import {
  mergeCartLines, calculateOrderSummary, createCheckoutSession, createReceiptPrinter,
} from './exercises.mjs';

function makeCatalog() {
  return [{ id: 'p1', priceMinor: 100000 }, { id: 'p2', priceMinor: 45000 }];
}

const checks = [
  [1, 'Gộp ID lặp và giữ thứ tự xuất hiện đầu', () => {
    assert.deepEqual(mergeCartLines([
      { productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 1 },
      { productId: 'p1', quantity: 3 },
    ]), [{ productId: 'p1', quantity: 5 }, { productId: 'p2', quantity: 1 }]);
  }],
  [1, 'Array rỗng và snapshot tách khỏi input', () => {
    assert.deepEqual(mergeCartLines([]), []);
    const lines = [{ productId: 'p1', quantity: 2 }];
    const before = structuredClone(lines);
    const merged = mergeCartLines(lines);
    assert.notEqual(merged, lines);
    assert.notEqual(merged[0], lines[0]);
    merged[0].quantity = 99;
    assert.deepEqual(lines, before);
  }],
  [1, 'Quantity sai bị từ chối và input không bị sửa', () => {
    for (const quantity of [0, -1, 1.5, NaN, '2', Infinity]) {
      const lines = [{ productId: 'p1', quantity: 1 }, { productId: 'p2', quantity }];
      const before = structuredClone(lines);
      assert.throws(() => mergeCartLines(lines), RangeError);
      assert.deepEqual(lines, before);
    }
    assert.throws(() => mergeCartLines([{ productId: 'p1', quantity: Number.MAX_SAFE_INTEGER + 1 }]), RangeError);
  }],
  [2, 'Lấy giá catalog, gộp dòng và áp dụng discount', () => {
    const catalog = makeCatalog();
    const lines = [
      { productId: 'p1', quantity: 1, priceMinor: 1 },
      { productId: 'p2', quantity: 1 }, { productId: 'p1', quantity: 1 },
    ];
    const before = structuredClone({ catalog, lines });
    assert.deepEqual(calculateOrderSummary(catalog, lines, 10), {
      itemCount: 3, subtotal: 245000, discountAmount: 24500, total: 220500,
    });
    assert.deepEqual({ catalog, lines }, before);
  }],
  [2, 'Giỏ rỗng, discount mặc định và quy tắc floor', () => {
    assert.deepEqual(calculateOrderSummary(makeCatalog(), []), {
      itemCount: 0, subtotal: 0, discountAmount: 0, total: 0,
    });
    const catalog = [{ id: 'odd', priceMinor: 10005 }];
    const lines = [{ productId: 'odd', quantity: 1 }];
    assert.deepEqual(calculateOrderSummary(catalog, lines, 10), {
      itemCount: 1, subtotal: 10005, discountAmount: 1000, total: 9005,
    });
    assert.equal(calculateOrderSummary(catalog, lines).total, 10005);
    assert.equal(calculateOrderSummary(catalog, lines, 100).total, 0);
  }],
  [2, 'Không chấp nhận ID lạ hoặc quantity sai', () => {
    assert.throws(() => calculateOrderSummary(makeCatalog(), [{ productId: 'missing', quantity: 1 }]), RangeError);
    assert.throws(() => calculateOrderSummary(makeCatalog(), [{ productId: 'p1', quantity: 0 }]), RangeError);
  }],
  [3, 'Session đọc giỏ và discount hiện tại qua closure', () => {
    const session = createCheckoutSession(makeCatalog());
    assert.equal(session.getSummary().total, 0);
    assert.equal(session.add('p1', 2), 2);
    assert.equal(session.add('p2'), 1);
    assert.equal(session.setDiscount(10), 10);
    assert.deepEqual(session.getSummary(), {
      itemCount: 3, subtotal: 245000, discountAmount: 24500, total: 220500,
    });
    assert.equal(session.remove('p2'), true);
    assert.equal(session.getSummary().total, 180000);
  }],
  [3, 'Receipt là snapshot và không tự thay đổi khi session đổi', () => {
    const session = createCheckoutSession(makeCatalog());
    session.add('p1');
    const receipt = session.getReceipt();
    assert.deepEqual(receipt, {
      items: [{ productId: 'p1', priceMinor: 100000, quantity: 1 }],
      summary: { itemCount: 1, subtotal: 100000, discountAmount: 0, total: 100000 },
    });
    const originalReceipt = structuredClone(receipt);
    session.add('p1');
    session.setDiscount(50);
    assert.deepEqual(receipt, originalReceipt);
    receipt.items[0].quantity = 999;
    receipt.summary.total = 1;
    assert.equal(session.getItems()[0].quantity, 2);
    assert.equal(session.getSummary().total, 100000);
  }],
  [3, 'Hai session độc lập, method tách ra được và discount sai không đổi state', () => {
    const catalog = makeCatalog();
    const before = structuredClone(catalog);
    const first = createCheckoutSession(catalog);
    const second = createCheckoutSession(catalog);
    const { add, setDiscount, getSummary, getReceipt } = first;
    add('p1');
    setDiscount(10);
    for (const percent of [-1, 101, 1.5, NaN, '10']) {
      assert.throws(() => setDiscount(percent), RangeError);
    }
    assert.equal(getSummary().total, 90000);
    assert.equal(getReceipt().summary.total, 90000);
    second.add('p2');
    assert.equal(second.getSummary().total, 45000);
    assert.equal(getSummary().total, 90000);
    assert.deepEqual(catalog, before);
  }],
  [4, 'Printer dùng summary hiện tại', () => {
    const session = { getSummary: () => ({ itemCount: 3, total: 220500 }) };
    assert.equal(createReceiptPrinter('Alpha', session).print(), 'Alpha | 3 items | 220500 VND');
  }],
  [4, 'Bound callback không gọi ngay, đọc tên shop và dữ liệu mới', () => {
    let calls = 0;
    let total = 100000;
    const session = { getSummary() { calls += 1; return { itemCount: 1, total }; } };
    const printer = createReceiptPrinter('Alpha', session);
    const callback = printer.createCallback();
    assert.equal(typeof callback, 'function');
    assert.equal(calls, 0);
    assert.equal(callback(), 'Alpha | 1 items | 100000 VND');
    total = 90000;
    printer.shopName = 'Beta';
    assert.equal(callback.call({ shopName: 'Wrong' }), 'Beta | 1 items | 90000 VND');
    assert.equal(calls, 2);
  }],
  [4, 'Mượn print bằng call sử dụng receiver mới', () => {
    const printer = createReceiptPrinter('Alpha', { getSummary: () => ({ itemCount: 1, total: 100000 }) });
    const other = { shopName: 'Other', session: { getSummary: () => ({ itemCount: 0, total: 0 }) } };
    assert.equal(printer.print.call(other), 'Other | 0 items | 0 VND');
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
