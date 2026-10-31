import assert from 'node:assert/strict';
import { makeProducts } from './fixtures.mjs';
import {
  findProductById,
  filterInStock,
  calculateTotal,
  updateProductStock,
} from './products.mjs';

// TODO: thêm ít nhất hai assertion do bạn nghĩ ra.
// Các import ở trên để bạn dùng khi viết kiểm tra, không phải lời giải.
// Gợi ý: một trường hợp bình thường và một trường hợp biên/lỗi.
// Ví dụ cú pháp assertion độc lập với bài:
// assert.equal(2 + 3, 5);
// assert.deepEqual([1, 2], [1, 2]);
// assert.throws(() => { throw new RangeError('demo'); }, RangeError);

console.log('File kiểm tra cá nhân: hãy thêm assertion trước khi đánh dấu hoàn thành.');
