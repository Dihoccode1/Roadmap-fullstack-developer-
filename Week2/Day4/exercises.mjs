// TUẦN 2 — NGÀY 4 (NGÀY 11): XỬ LÝ LỖI ASYNC, FETCH VÀ LOADING STATE.
// Học chủ đề -> docs/video -> code trong hàm; tổng kết Markdown sau khi review.
// Node .mjs, không package mới, không gọi API/mạng thật trong bài.
// Dependency được truyền vào để kiểm tra: không dùng global fetch thay fetchImpl.
// Input hợp lệ; các lỗi là Error, có thể có thuộc tính code.
// Không sửa input, không console.log thay cho return, không nuốt lỗi thành undefined.
//
// Mục tiêu: await để catch/finally theo đúng vòng đời tác vụ; phân biệt lỗi HTTP,
// lỗi mạng và lỗi parse; chỉ fallback với lỗi đã biết; lưu trạng thái loader bằng closure.
// WHY: Promise fulfilled chưa chắc HTTP thành công; cleanup quá sớm gây sai loading.
// HOW: try/catch/finally, response.ok, await response.json(), state rõ từng nhánh.
// TRADE-OFF: fallback giúp tiếp tục khi lỗi dự kiến, nhưng catch mọi lỗi sẽ che sự cố.
// WHEN: tải dữ liệu cho giao diện và xử lý lỗi có chủ đích. Chưa timeout/retry/abort.
//
// Docs (đọc mục tương ứng, không cần đọc toàn bộ):
// try/catch, conditional catch và finally:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
// await và xử lý rejection:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
// Making a request, Checking response status, Reading the response body:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
// Video YouTube — Web Dev Simplified:
// Fetch: https://www.youtube.com/watch?v=cuEtnrL9-H0
// Ôn async/await + try/catch: https://www.youtube.com/watch?v=V_Kr9OSfDeU
//
// Gợi ý 5 giờ: 60 phút docs/video; 45 phút bài 1; 60 phút bài 2;
// 45 phút bài 3; 60 phút bài 4; 30 phút chạy check, sửa lỗi và tự giải thích.
// Chạy: node Week2/Day4/check.mjs 1  (đổi 1–4); bỏ số để chạy cả ngày.

// BÀI 1 — Cleanup đúng thời điểm bằng finally.
// runWithLoading(task, setLoading) trả Promise kết quả task.
// Gọi setLoading(true), gọi task() đúng một lần không arguments.
// task có thể trả Promise hoặc throw đồng bộ. Phải chờ task settle trước cleanup.
// Dùng try/finally và await: setLoading(false) đúng một lần cả khi thành công/lỗi.
// Khi task còn pending thì loading vẫn true. Giữ nguyên giá trị (kể cả falsy)
// hoặc reject với chính Error ban đầu; không return trong finally.
// setLoading là callback đồng bộ không throw. Không dùng timer/Promise.race.
export async function runWithLoading(task, setLoading) {
  throw new Error('TODO: runWithLoading');
}

// BÀI 2 — Fetch JSON và phân biệt HTTP error với rejection.
// fetchJson(url, fetchImpl): gọi fetchImpl(url) đúng một lần, không thêm options.
// fetchImpl -> Promise<ResponseLike>; ResponseLike có ok:boolean, status:number,
// json():Promise<JSON>. Nếu ok=true, gọi json() đúng một lần và chờ kết quả.
// Nếu ok=false, throw new Error(`HTTP ${response.status}`), KHÔNG đọc json().
// Lỗi mạng hoặc lỗi json: reject với chính Error, không đổi message hay fallback.
// JSON có thể là object/array hoặc falsy; không sửa dữ liệu. Dùng async/await.
// Không dùng .catch(() => null); fetch không tự reject chỉ vì status 404/500.
export async function fetchJson(url, fetchImpl) {
  throw new Error('TODO: fetchJson');
}

// BÀI 3 — Fallback có điều kiện, không che lỗi khác.
// getProductOrFallback(id, fetchProduct, createFallback) gọi fetchProduct(id) một lần.
// fetchProduct trả Promise<Product> hoặc throw đồng bộ; thành công trả chính product.
// Nếu lỗi có error.code === 'PRODUCT_NOT_FOUND': gọi createFallback(id) đúng một lần,
// trả kết quả đó. createFallback đồng bộ; nếu nó throw thì truyền đúng Error ra.
// Mọi lỗi khác: reject với chính Error gốc; không gọi createFallback.
// Không suy loại lỗi từ message, không sửa Error hay product; dùng try/catch và await.
export async function getProductOrFallback(id, fetchProduct, createFallback) {
  throw new Error('TODO: getProductOrFallback');
}

// BÀI 4 — Mini product loader: loading/success/error bằng closure.
// createProductLoader(fetchProduct) trả { getState(), load(id) }.
// State ban đầu: { status: 'idle', data: null, error: null }.
// getState() trả một object mới mỗi lần; là SHALLOW snapshot, data/Error giữ tham chiếu.
// Thay snapshot.status/data/error không được sửa state nội bộ; không cần deep clone product.
// load(id) là async; ngay khi gọi, state -> { status:'loading', data:null, error:null },
// rồi gọi fetchProduct(id) đúng một lần. fetchProduct có thể throw đồng bộ hoặc reject.
// Thành công: state -> { status:'success', data:product, error:null }, return product.
// Lỗi: state -> { status:'error', data:null, error:ErrorGoc }, reject chính Error đó.
// Load tiếp theo sau khi lần trước settle phải reset data/error từ lần trước.
// Không có hai load chồng nhau trong CÙNG instance hôm nay; bài hủy request học sau.
// Các instance độc lập; tách getState/load khỏi object vẫn dùng được, không dùng this/global.
export function createProductLoader(fetchProduct) {
  // TODO: state riêng trong closure.
  return {
    getState() {
      throw new Error('TODO: loader.getState');
    },
    async load(id) {
      throw new Error('TODO: loader.load');
    },
  };
}
