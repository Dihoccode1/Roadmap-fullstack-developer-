// TUẦN 2 — NGÀY 2 (NGÀY 9): PROMISE CHAIN, TUẦN TỰ VÀ ĐỒNG THỜI.
// Học chủ đề -> docs/video -> code trực tiếp trong hàm; tổng kết cuối buổi.
// Không có mạng thật, package mới, thread mới hoặc dữ liệu từ API bên ngoài.
// Các dependency được check truyền vào, nhận ID và luôn trả Promise.
// Rejection trong bài dùng Error. Input ID là array/string hợp lệ, có thể lặp ID.
// Mỗi ID trong array cần một lần gọi dependency, không tự deduplicate.
// Không sửa input hoặc product nhận về; không tạo new Promise bọc API Promise.
//
// Docs: phần Chaining và Composition:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
// Video:
// F8 Promise chain: https://www.youtube.com/watch?v=Ldl571DAlXI
// F8 Promise methods/all: https://www.youtube.com/watch?v=pxyxbaq8i8c
// Ôn async/await: https://www.youtube.com/watch?v=V_Kr9OSfDeU
//
// Chạy từng bài: node Week2/Day2/check.mjs 1  (đổi 1–4).
// Chạy cả ngày: node Week2/Day2/check.mjs
// Bộ check điều khiển thời điểm hoàn tất của Promise, không so tốc độ máy.

// BÀI 1 — Hai tác vụ có phụ thuộc, return Promise qua chain.
// fetchProduct(productId) -> Promise<{ id, name, categoryId }>.
// Sau khi có product mới gọi fetchCategory(product.categoryId) đúng một lần.
// fetchCategory(id) -> Promise<{ id, name }>.
// Trả Promise fulfill { productId: product.id, name: product.name,
//                      categoryName: category.name }.
// Dùng then, không async/await. Không gọi fetchCategory khi fetchProduct thất bại.
// Lỗi ở bất kỳ bước nào phải reject với chính Error ban đầu.
// Không hardcode categoryId và không đọc thuộc tính của Promise chưa hoàn tất.
export function getProductWithCategory(productId, fetchProduct, fetchCategory) {
  throw new Error('TODO: getProductWithCategory');
}

// BÀI 2 — Tuần tự: chỉ bắt đầu ID tiếp theo khi ID trước thành công.
// fetchProduct(id) -> Promise<Product>. Trả array product theo thứ tự ids.
// [] -> []; một lỗi thì reject với chính Error, không gọi các ID phía sau nữa.
// Dùng async/await với for...of; không forEach(async...), Promise.all hay vòng chờ.
// Ví dụ ['p1', 'p2']: fetch p1 xong mới fetch p2.
export async function loadProductsSequential(ids, fetchProduct) {
  throw new Error('TODO: loadProductsSequential');
}

// BÀI 3 — Đồng thời: các request độc lập được khởi động trước khi đợi kết quả.
// Dùng Promise.all để trả array product theo thứ tự INPUT, không theo thứ tự xong.
// [] -> []; một request reject thì kết quả chung reject với chính Error đó.
// Không chuyển lỗi thành null/undefined hoặc bỏ sản phẩm lỗi.
// Các request khác đã khởi động không tự bị hủy khi Promise.all reject.
// Không await từng fetch trong vòng lặp rồi mới đưa các kết quả vào Promise.all.
export async function loadProductsConcurrent(ids, fetchProduct) {
  throw new Error('TODO: loadProductsConcurrent');
}

// BÀI 4 — Thu đủ kết quả kể cả lỗi, không fail-fast.
// Dùng Promise.allSettled; khởi động các request độc lập trước khi await.
// Đợi tất cả settle rồi trả array theo thứ tự ids:
// Thành công: { productId: ids[i], status: 'fulfilled', value: product }.
// Thất bại:   { productId: ids[i], status: 'rejected', reason: error.message }.
// [] -> []; nếu tất cả request lỗi vẫn fulfill array ghi nhận từng lỗi.
// Không bỏ kết quả lỗi và không gắn kết quả với ID theo thứ tự hoàn thành.
export async function loadProductResults(ids, fetchProduct) {
  throw new Error('TODO: loadProductResults');
}
