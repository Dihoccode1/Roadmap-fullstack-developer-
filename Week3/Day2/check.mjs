import assert from 'node:assert/strict';
import { normalizeProductId, isProduct, parseProduct, getProductStateMessage } from './exercises.ts';

// Node chạy .ts không thay typecheck. Guard được kiểm tra với dữ liệu thật sự sai,
// vì compiler tin type predicate nhưng không chứng minh logic predicate đúng.
const checks = [
  [1, 'ID số thành string, gồm 0', () => {
    for (const id of [0, 1, 42, 1000]) {
      assert.equal(normalizeProductId(id), String(id));
      assert.equal(typeof normalizeProductId(id), 'string');
    }
  }],
  [1, 'Trim chuỗi, giữ số 0 đầu và không ép chuỗi sang số', () => {
    assert.equal(normalizeProductId(' p1 '), 'p1');
    assert.equal(normalizeProductId(' 001 '), '001');
    assert.equal(normalizeProductId('\t0\n'), '0');
    assert.equal(normalizeProductId(' x y '), 'x y');
  }],
  [1, 'Chuỗi rỗng hoặc toàn khoảng trắng là lỗi', () => {
    for (const id of ['', '   ', '\t\n']) {
      assert.throws(() => normalizeProductId(id), (error) => error instanceof Error && error.message === 'Invalid product id');
    }
  }],
  [2, 'Product hợp lệ, giá 0 và trường phụ được chấp nhận mà không normalize', () => {
    for (const product of [
      { id: 'p1', name: 'Book', priceInCents: 105 },
      { id: ' p2 ', name: ' Pen ', priceInCents: 0, stock: 5 },
    ]) {
      const before = structuredClone(product);
      Object.freeze(product);
      assert.equal(isProduct(product), true);
      assert.deepEqual(product, before);
    }
  }],
  [2, 'Primitive, null, function và array đều false, không throw', () => {
    const disguisedArray = Object.assign([], { id: 'p1', name: 'Book', priceInCents: 100 });
    for (const value of [null, undefined, true, false, 0, 'p1', 1n, Symbol('id'), () => {}, [], disguisedArray]) {
      assert.equal(isProduct(value), false);
    }
  }],
  [2, 'Thiếu/sai field hoặc giá không phải số nguyên không âm đều false', () => {
    const valid = { id: 'p1', name: 'Book', priceInCents: 100 };
    const invalid = [
      {}, { id: 'p1', name: 'Book' }, { id: 'p1', priceInCents: 100 },
      { name: 'Book', priceInCents: 100 },
      ...['', ' \t ', 1, null].map((id) => ({ ...valid, id })),
      ...['', '\n', false, undefined].map((name) => ({ ...valid, name })),
      ...[-1, 0.5, NaN, Infinity, -Infinity, '100', null, undefined].map((priceInCents) => ({ ...valid, priceInCents })),
    ];
    for (const value of invalid) assert.equal(isProduct(value), false);
  }],
  [3, 'Parse trả chính object hợp lệ, giữ giá 0 và trường phụ', () => {
    const product = Object.freeze({ id: 'p1', name: 'Gift', priceInCents: 0, metadata: 'keep' });
    const result = parseProduct(product);
    assert.equal(result, product);
    assert.deepEqual(result, { id: 'p1', name: 'Gift', priceInCents: 0, metadata: 'keep' });
  }],
  [3, 'Dữ liệu sai ném Error rõ ràng, không trả null hoặc undefined', () => {
    for (const value of [null, undefined, [], 'p1', {}, { id: 'p1', name: 'Book', priceInCents: '100' }]) {
      assert.throws(() => parseProduct(value), (error) => error instanceof Error && error.message === 'Invalid product');
    }
  }],
  [3, 'Guard và parse nhất quán; parse không tự trim dữ liệu', () => {
    const values = [
      { id: ' p1 ', name: ' Book ', priceInCents: 1 },
      { id: 'p2', name: 'Pen', priceInCents: -1 },
      { id: '', name: 'Pen', priceInCents: 10 },
    ];
    for (const value of values) {
      const before = structuredClone(value);
      Object.freeze(value);
      if (isProduct(value)) assert.equal(parseProduct(value), value);
      else assert.throws(() => parseProduct(value), (error) => error.message === 'Invalid product');
      assert.deepEqual(value, before);
    }
    assert.equal(parseProduct(values[0]).name, ' Book ');
  }],
  [4, 'Idle/loading không cần data/error', () => {
    const idle = Object.freeze({ status: 'idle' });
    const loading = Object.freeze({ status: 'loading' });
    assert.equal(getProductStateMessage(idle), 'Chưa tải');
    assert.equal(getProductStateMessage(loading), 'Đang tải');
    assert.deepEqual(idle, { status: 'idle' });
    assert.deepEqual(loading, { status: 'loading' });
  }],
  [4, 'Success đọc đúng data.name, giữ nguyên Product/state', () => {
    const product = Object.freeze({ id: 'p1', name: 'Book', priceInCents: 0 });
    const state = Object.freeze({ status: 'success', data: product });
    assert.equal(getProductStateMessage(state), 'Sản phẩm: Book');
    assert.equal(state.data, product);
    assert.deepEqual(product, { id: 'p1', name: 'Book', priceInCents: 0 });
  }],
  [4, 'Error đọc đúng message, kể cả rỗng, không sửa Error', () => {
    for (const message of ['Offline', '']) {
      const error = Object.freeze(new Error(message));
      const state = Object.freeze({ status: 'error', error });
      assert.equal(getProductStateMessage(state), `Lỗi: ${message}`);
      assert.equal(state.error, error);
      assert.equal(error.message, message);
    }
  }],
];

const requested = process.argv.slice(2);
if (requested.length > 1 || (requested.length === 1 && !/^[1-4]$/.test(requested[0]))) {
  console.error('Cách chạy: node Week3/Day2/check.mjs [1|2|3|4]');
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
  console.log('Typecheck riêng: npm --prefix Week3 run typecheck:day2');
  if (passed !== selected.length) process.exitCode = 1;
}
