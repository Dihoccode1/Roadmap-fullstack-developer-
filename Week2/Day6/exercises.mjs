// TUẦN 2 — NGÀY 6 (NGÀY 13): TASK FACTORY VÀ GIỚI HẠN CONCURRENCY.
// Chủ đề -> docs/video -> làm trong hàm. Không cần trả lời bằng Markdown.
// Node .mjs, không package/mạng thật; không import bài Ngày 12 còn dở.
// Không sửa input, không busy-wait/timer/thread. Dependency giả lập được truyền vào.
//
// Mục tiêu: trì hoãn khởi động tác vụ đến khi có slot, giữ thứ tự kết quả,
// chọn reject sớm hay thu đủ thành công/lỗi dưới cùng một giới hạn concurrency.
// WHY: ids.map(fetchProduct) khởi động toàn bộ trước khi Promise.all chờ kết quả.
// HOW: task factory () => Promise; worker async lấy index chưa dùng và await từng item.
// TRADE-OFF: limit nhỏ giảm số tác vụ đang chờ nhưng tăng tổng thời gian hoàn thành.
// WHEN: tải danh sách sản phẩm hoặc xử lý batch I/O; không tạo thêm CPU thread.
// Giới hạn concurrency không đồng nghĩa giới hạn số request mỗi giây (rate limit).
//
// Docs — ôn theo thứ tự:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
// Đọc usage/FAQ để thấy giới hạn concurrency nhận function; KHÔNG cài thư viện để giải bài:
// https://github.com/sindresorhus/p-limit
// Video nền tảng cho worker async và phối hợp Promise (không phải đáp án limiter):
// F8 — Promise methods: https://www.youtube.com/watch?v=pxyxbaq8i8c
// Web Dev Simplified — Async/Await: https://www.youtube.com/watch?v=V_Kr9OSfDeU
//
// Gợi ý 5 giờ: 50 phút docs/video; 35 phút bài 1; 35 phút bài 2;
// 100 phút bài 3; 50 phút bài 4; 30 phút chạy check và tự giải thích.
// Chạy: node Week2/Day6/check.mjs 1 (đổi 1–4); bỏ số để chạy cả ngày.
// Task factory chưa chạy cho đến khi được GỌI; khác Promise đã khởi động từ trước.

// BÀI 1 — Ôn tuần tự bằng task factory.
// runTasksSequential(tasks) -> Promise<array value>. tasks là array function không args,
// mỗi function trả Promise hoặc throw Error đồng bộ. Không gọi task trước lượt của nó.
// Dùng for...of + await; giữ thứ tự; [] -> []; mỗi task gọi đúng một lần.
// Một task lỗi thì reject chính Error và không gọi task phía sau; không sửa array tasks.
export async function runTasksSequential(tasks) {
  throw new Error('TODO: runTasksSequential');
}

// BÀI 2 — Ôn khởi động đồng thời, không giới hạn số tác vụ.
// runTasksConcurrent(tasks) -> Promise<array value>. Riêng bài này task luôn trả Promise,
// KHÔNG throw đồng bộ, nhưng Promise có thể reject với Error.
// Gọi tất cả factory đúng một lần trước khi chờ; dùng Promise.all; [] -> [].
// Kết quả theo thứ tự input dù hoàn thành ngược. Reject sớm cùng Error đầu tiên quan sát.
// Không hủy hoặc đợi xong toàn bộ mới báo lỗi; task đã khởi động vẫn tiếp tục.
export async function runTasksConcurrent(tasks) {
  throw new Error('TODO: runTasksConcurrent');
}

// BÀI 3 — Worker pool, lấp slot trống thay vì đợi cả batch.
// mapWithConcurrency(items, limit, mapper) -> Promise<array result theo thứ tự INPUT>.
// mapper(item, index) trả Promise hoặc value, có thể throw/reject Error.
// limit phải là số nguyên dương; sai -> reject RangeError('limit must be a positive integer')
// TRƯỚC khi gọi bất kỳ mapper nào, kể cả khi items rỗng. Limit hợp lệ + [] -> [].
// Tối đa limit mapper chưa settle cùng lúc; có đủ item thì khởi động đủ số slot này.
// Slot nào xong thì lấy item chưa chạy tiếp theo theo index, không đợi slot khác.
// Mỗi index được xử lý một lần; không sửa items; limit > length vẫn hợp lệ.
// Khi quan sát lỗi đầu tiên: reject sớm cùng Error, ngừng khởi động item mới.
// Mapper đã chạy không tự hủy; phải quan sát lỗi của chúng để không có unhandled rejection.
// Không dùng Promise.all(items.map(mapper)), không chia batch cố định, không thư viện.
// Có thể Promise.all một số worker hữu hạn. Mỗi worker cần lấy index trước await.
export async function mapWithConcurrency(items, limit, mapper) {
  throw new Error('TODO: mapWithConcurrency');
}

// BÀI 4 — Thu đủ kết quả tải sản phẩm với concurrency giới hạn.
// loadProductResultsLimited(ids, limit, fetchProduct) tái sử dụng mapWithConcurrency.
// fetchProduct(id) trả Promise<Product>, có thể throw/reject Error.
// Kết quả theo thứ tự ids (giữ ID lặp), mỗi vị trí gọi fetch một lần:
// { productId: ids[i], status:'fulfilled', value:product }
// { productId: ids[i], status:'rejected', reason:error.message }
// Lỗi từng fetch là dữ liệu nên không chặn ID sau; chờ đủ. Giới hạn concurrency vẫn giữ.
// Limit không hợp lệ phải reject RangeError như bài 3, không biến thành kết quả rejected.
// [] + limit hợp lệ -> []; không sửa ids/product và không import hàm Ngày 12.
export async function loadProductResultsLimited(ids, limit, fetchProduct) {
  throw new Error('TODO: loadProductResultsLimited');
}
