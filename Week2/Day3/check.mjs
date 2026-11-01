import assert from 'node:assert/strict';
import { traceQueues, deferWork, traceAwait, createMicrotaskBatcher } from './exercises.mjs';

// Kiểm tra hành vi quan sát được. Khi review còn đọc code để xác nhận đúng API đề yêu cầu.
// Không so số millisecond: timer chỉ cần chạy sau phần đồng bộ và microtask trong ví dụ.
const queueOrder = ['sync:start', 'sync:end', 'promise', 'queueMicrotask', 'timer'];
const checks = [
  [1, 'Phần đồng bộ chạy trước, hai microtask trước timer', async () => {
    const events = [];
    const pending = traceQueues(events);
    assert.equal(typeof pending?.then, 'function', 'Hàm cần trả Promise');
    assert.deepEqual(events, ['sync:start', 'sync:end']);
    const result = await pending;
    assert.deepEqual(result, queueOrder);
    assert.deepEqual(events, queueOrder);
    assert.notEqual(result, events, 'Trả snapshot, không trả chung array');
  }],
  [1, 'Giữ events có sẵn và phần caller chạy ngay sau lời gọi', async () => {
    const events = ['seed'];
    const pending = traceQueues(events);
    events.push('caller');
    const result = await pending;
    const expected = ['seed', 'sync:start', 'sync:end', 'caller', 'promise', 'queueMicrotask', 'timer'];
    assert.deepEqual(result, expected);
    assert.deepEqual(events, expected);
    events.push('later');
    assert.deepEqual(result, expected, 'Snapshot không đổi khi events đổi sau đó');
  }],
  [1, 'Hai lời gọi mặc định có state và snapshot độc lập', async () => {
    const [first, second] = await Promise.all([traceQueues(), traceQueues()]);
    assert.deepEqual(first, queueOrder);
    assert.deepEqual(second, queueOrder);
    assert.notEqual(first, second);
    first.push('only-first');
    assert.deepEqual(second, queueOrder);
  }],
  [2, 'work chưa chạy ngay; microtask gọi đúng một lần và không truyền arguments', async () => {
    const events = [];
    let calls = 0;
    const pending = deferWork((...args) => {
      calls += 1;
      assert.deepEqual(args, []);
      return 42;
    }, events);
    assert.equal(typeof pending?.then, 'function');
    assert.equal(calls, 0, 'Không gọi work trong phần đồng bộ');
    assert.deepEqual(events, ['sync:start', 'sync:end']);
    assert.equal(await pending, 42);
    assert.equal(calls, 1);
    assert.deepEqual(events, ['sync:start', 'sync:end', 'work']);
  }],
  [2, 'Error trong work trở thành rejection với chính Error đó', async () => {
    const events = [];
    const failure = new Error('Work failed');
    let calls = 0;
    await assert.rejects(() => deferWork(() => {
      calls += 1;
      throw failure;
    }, events), (error) => error === failure);
    assert.equal(calls, 1);
    assert.deepEqual(events, ['sync:start', 'sync:end', 'work']);
  }],
  [2, 'Giữ nguyên falsy/object và events có sẵn', async () => {
    for (const value of [0, false, '', undefined, { id: 'p1' }]) {
      const events = ['seed'];
      let calls = 0;
      assert.equal(await deferWork(() => { calls += 1; return value; }, events), value);
      assert.equal(calls, 1);
      assert.deepEqual(events, ['seed', 'sync:start', 'sync:end', 'work']);
    }
  }],
  [3, 'await nhường cho caller trước khi tiếp tục push after', async () => {
    const events = [];
    const pending = traceAwait(events);
    assert.equal(typeof pending?.then, 'function');
    assert.deepEqual(events, ['before']);
    events.push('caller');
    const result = await pending;
    assert.deepEqual(result, ['before', 'caller', 'after']);
    assert.notEqual(result, events);
  }],
  [3, 'Microtask đã xếp trước chạy trước continuation sau await', async () => {
    const events = [];
    const earlier = Promise.resolve().then(() => events.push('queued:first'));
    const pending = traceAwait(events);
    assert.deepEqual(events, ['before']);
    const result = await pending;
    await earlier;
    assert.deepEqual(result, ['before', 'queued:first', 'after']);
  }],
  [3, 'Events mặc định độc lập; kết quả là snapshot', async () => {
    const first = await traceAwait();
    const second = await traceAwait();
    assert.deepEqual(first, ['before', 'after']);
    assert.deepEqual(second, ['before', 'after']);
    assert.notEqual(first, second);
    first.push('only-first');
    assert.deepEqual(second, ['before', 'after']);
    const events = [];
    const snapshot = await traceAwait(events);
    events.push('later');
    assert.deepEqual(snapshot, ['before', 'after']);
  }],
  [4, 'Nhiều add cùng lượt tạo một batch, giữ thứ tự và giá trị trùng', async () => {
    const batches = [];
    const batcher = createMicrotaskBatcher((batch) => batches.push(batch));
    assert.equal(batcher.add('a'), undefined);
    assert.equal(batcher.add('a'), undefined);
    assert.equal(batcher.add('b'), undefined);
    assert.deepEqual(batches, [], 'Không gọi onBatch trong phần đồng bộ');
    await Promise.resolve();
    assert.deepEqual(batches, [['a', 'a', 'b']]);
    await Promise.resolve();
    assert.equal(batches.length, 1, 'Không gọi batch rỗng cho từng add');
  }],
  [4, 'Sau flush có batch mới và không dùng lại snapshot cũ', async () => {
    const batches = [];
    const batcher = createMicrotaskBatcher((batch) => batches.push(batch));
    batcher.add('first');
    await Promise.resolve();
    assert.deepEqual(batches, [['first']]);
    const oldSnapshot = batches[0];
    oldSnapshot.push('external');
    batcher.add('second');
    assert.equal(batches.length, 1);
    await Promise.resolve();
    assert.deepEqual(batches, [['first', 'external'], ['second']]);
    assert.equal(batches[0], oldSnapshot);
    assert.notEqual(batches[1], oldSnapshot);
  }],
  [4, 'Không add thì không flush; hai instance và method tách ra độc lập', async () => {
    const firstBatches = [];
    const secondBatches = [];
    const first = createMicrotaskBatcher((batch) => firstBatches.push(batch));
    const second = createMicrotaskBatcher((batch) => secondBatches.push(batch));
    await Promise.resolve();
    assert.deepEqual(firstBatches, []);
    assert.deepEqual(secondBatches, []);
    const { add } = first;
    add('A');
    second.add('B');
    assert.deepEqual(firstBatches, []);
    assert.deepEqual(secondBatches, []);
    await Promise.resolve();
    assert.deepEqual(firstBatches, [['A']]);
    assert.deepEqual(secondBatches, [['B']]);
  }],
];

const requested = process.argv.slice(2);
if (requested.length > 1 || (requested.length === 1 && !/^[1-4]$/.test(requested[0]))) {
  console.error('Cách chạy: node Week2/Day3/check.mjs [1|2|3|4]');
  process.exitCode = 1;
} else {
  const selected = requested.length ? checks.filter(([group]) => group === Number(requested[0])) : checks;
  let passed = 0;
  for (const [group, label, run] of selected) {
    let timeout;
    try {
      await Promise.race([
        Promise.resolve().then(run),
        new Promise((_, reject) => {
          timeout = setTimeout(() => reject(new Error('Quá thời gian chờ: kiểm tra Promise đã settle chưa')), 2000);
        }),
      ]);
      passed += 1;
      console.log(`PASS Bài ${group}: ${label}`);
    } catch (error) {
      console.error(`FAIL Bài ${group}: ${label}\n  ${error.message}`);
    } finally {
      clearTimeout(timeout);
    }
  }
  console.log(`\nKết quả: ${passed}/${selected.length} tình huống đạt.`);
  if (passed !== selected.length) process.exitCode = 1;
}
