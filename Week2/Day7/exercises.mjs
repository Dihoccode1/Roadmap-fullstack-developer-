// TUẦN 2 — NGÀY 7 (NGÀY 14): TỔNG HỢP ASYNC — PRODUCT LOADER.
// Chủ đề -> docs/video -> code trong hàm. Chưa tạo Markdown tổng kết cho ngày đang học.
// Node .mjs, không UI/package/mạng thật. Dependency được truyền vào, không global fetch.
// Không import bài Ngày 12 còn dở; hôm nay luyện lại timeout/cleanup và request identity.
// Error/reason là Error (gồm DOMException), giữ identity khi truyền ra.
// timers=globalThis hoặc { setTimeout(callback, ms), clearTimeout(id) } được check truyền.
// Timer một lần, callback không chạy đồng bộ, không đo chính xác số millisecond thực tế.
//
// WHY: HTTP, đọc body, deadline và state đều thuộc vòng đời tải sản phẩm.
// HOW: tách helper quản lý timer, helper Fetch, hàm ghép bằng try/finally, loader bằng closure.
// TRADE-OFF: abort cần dependency hỗ trợ; identity vẫn cần để chặn state cũ ghi đè.
// WHEN: đổi sản phẩm nhanh hoặc giới hạn thời gian tải. Không bảo đảm server đã rollback.
//
// Docs — ưu tiên mục liên quan:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// Đọc Checking response status, Reading the response body, Canceling a request.
// https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
// Đọc aborted/reason, Aborting a fetch operation; signal đã abort không dùng lại cho lần mới.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
// Đọc finally và vì sao không return trong finally.
// Video:
// Web Dev Simplified — AbortController: https://www.youtube.com/watch?v=BeZfiCPhZbI
// Web Dev Simplified — Fetch: https://www.youtube.com/watch?v=cuEtnrL9-H0
//
// Gợi ý 5 giờ: 45 phút ôn nguồn; 45 phút bài 1; 35 phút bài 2;
// 55 phút bài 3; 95 phút bài 4; 25 phút chạy check và tự giải thích.
// Nếu có thêm 2 giờ theo lịch Chủ nhật, dùng để sửa bài Ngày 12 còn dở và tự kiểm chứng.
// Chạy: node Week2/Day7/check.mjs 1 (đổi 1–4); bỏ số để chạy cả ngày.

// BÀI 1 — Deadline có thể dọn, tách việc sở hữu timer khỏi Fetch.
// createTimeoutSignal(ms, timers=globalThis) là hàm ĐỒNG BỘ -> { signal, dispose }.
// ms phải là số nguyên dương; sai -> throw RangeError('ms must be a positive integer')
// trước khi tạo timer. Mỗi lần gọi tạo một AbortController và đúng một timer ms.
// Timer đến hạn -> controller.abort(error), Error có name='TimeoutError',
// message=`Timeout after ${ms}ms`. Signal không aborted trước deadline.
// dispose() trả undefined, clearTimeout đúng handle và idempotent (clear tối đa một lần).
// Dispose trước deadline thì signal không bị abort; dispose sau abort giữ nguyên reason.
// Không dùng AbortSignal.timeout/any; không dùng Promise.race ở bài hôm nay.
export function createTimeoutSignal(ms, timers = globalThis) {
  throw new Error('TODO: createTimeoutSignal');
}

// BÀI 2 — Fetch một sản phẩm bằng signal từ caller.
// fetchProductWithSignal(id, signal, fetchImpl) -> Promise<Product>.
// id là string không rỗng. URL chính xác: `/products/${encodeURIComponent(id)}`.
// Signal đã abort -> reject signal.reason, không gọi fetchImpl.
// Chưa abort -> fetchImpl(url, { signal }) đúng một lần, truyền chính signal đó.
// ResponseLike: ok:boolean, status:number, json():Promise<Product>.
// ok=false -> Error(`HTTP ${response.status}`), không đọc body; ok=true -> chờ json().
// Network/parse/abort reject với chính Error gốc; giữ product reference, không sửa dữ liệu.
// fetchImpl và json hỗ trợ abort khi đang pending. Không tự thêm listener ở helper này.
export async function fetchProductWithSignal(id, signal, fetchImpl) {
  throw new Error('TODO: fetchProductWithSignal');
}

// BÀI 3 — Ghép timeout thật sự gửi abort với Fetch.
// fetchProductWithTimeout(id, ms, fetchImpl, timers=globalThis) -> Promise<Product>.
// Tái sử dụng bài 1 và bài 2 trong CÙNG file, không viết lại hai helper.
// Tạo deadline; try/await tải product; finally dispose deadline khi thành công hoặc lỗi.
// Deadline phải còn hiệu lực khi đang đọc json, không dispose ngay sau lúc có headers.
// Timeout -> dependency nhận signal.abort và reject đúng signal.reason (TimeoutError).
// HTTP/mạng/parse -> giữ lỗi từ helper. Không bọc lỗi mới, không nuốt lỗi thành null.
// Sai ms -> reject RangeError trước fetch. Mỗi lời gọi có signal/timer riêng.
// Hợp đồng fetchImpl hỗ trợ abort; helper không ép dừng được dependency cố ý bỏ qua abort.
export async function fetchProductWithTimeout(id, ms, fetchImpl, timers = globalThis) {
  throw new Error('TODO: fetchProductWithTimeout');
}

// BÀI 4 — Loader trang sản phẩm, chỉ request hiện hành được ghi state.
// createProductPageLoader(fetchProduct) -> { getState(), load(id) } dùng closure.
// Initial state: { status:'idle', data:null, error:null }.
// getState trả object mới (shallow snapshot), data/Error giữ cùng reference.
// load(id) async: tạo AbortController mới; nếu request trước CÒN PENDING, abort nó bằng
// DOMException('Superseded', 'AbortError'). Đặt state loading/null/null trước gọi dependency.
// fetchProduct(id, { signal }) đúng một lần; có thể throw/reject hoặc bỏ qua abort.
// Request hiện hành thành công -> success/product/null; lỗi -> error/null/ErrorGoc.
// Request cũ thành công/lỗi/cleanup muộn không sửa state hoặc controller của request mới.
// Promise của từng load vẫn fulfill/reject theo dependency riêng, giữ product/Error gốc.
// Không abort controller của request đã settle; load mới reset data/error cũ.
// Detached method vẫn chạy; instance độc lập. Không timer, retry hoặc UI trong factory.
// Gợi ý tích hợp sau khi đạt: dependency có thể là hàm bọc helper Fetch ở bài 2.
// Hôm nay không bắt buộc kết hợp signal supersede với signal timeout thành một signal.
export function createProductPageLoader(fetchProduct) {
  // TODO: state, controller và identity request trong closure.
  return {
    getState() {
      throw new Error('TODO: pageLoader.getState');
    },
    async load(id) {
      throw new Error('TODO: pageLoader.load');
    },
  };
}
