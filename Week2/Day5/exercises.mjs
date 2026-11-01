// TUẦN 2 — NGÀY 5 (NGÀY 12): TIMEOUT, ABORTCONTROLLER VÀ REQUEST CŨ.
// Học chủ đề -> docs/video -> code trực tiếp trong hàm. Tổng kết sau khi review.
// Node .mjs, không package mới, không gọi mạng thật. Input hợp lệ theo từng đề.
// Error/reason trong bài là Error (gồm DOMException). Không đổi Error khi truyền ra.
// timers mặc định là globalThis; check truyền { setTimeout(callback, ms), clearTimeout(id) }
// cùng hợp đồng timer một lần, không gọi callback đồng bộ. Dùng timers được truyền vào.
// Không dùng AbortSignal.timeout/any hoặc node:timers/promises để bỏ qua phần luyện cleanup.
//
// WHY: ngừng chờ kết quả không tự hủy việc đang chạy; kết quả cũ có thể ghi đè state mới.
// HOW: Promise.race, controller.signal, aborted/reason, abort event và request identity.
// TRADE-OFF: abort cần dependency hỗ trợ. Vẫn cần kiểm tra request hiện hành khi ghi state.
// WHEN: tìm kiếm/đổi sản phẩm nhanh, giới hạn chờ, dọn tác vụ không còn cần thiết.
// Không coi abort phía client là bảo đảm server đã dừng hay rollback công việc.
//
// Docs — đọc theo thứ tự:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
// https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
// https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
// Chú ý: Aborting a fetch operation; Implementing an abortable API; signal dùng một lần.
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#canceling_a_request
// Video: Web Dev Simplified — I Cannot Believe Abort Controller Can Do This
// https://www.youtube.com/watch?v=BeZfiCPhZbI
// Ưu tiên 01:15 phần cơ bản và 09:00 custom support; event listeners DOM xem thêm.
// Ôn Promise trước khi làm race: https://www.youtube.com/watch?v=DHvZLI7Db8E
//
// Gợi ý 5 giờ: 50 phút docs/video; 40 phút bài 1; 40 phút bài 2;
// 60 phút bài 3; 90 phút bài 4; 20 phút chạy check và tự giải thích.
// Chạy: node Week2/Day5/check.mjs 1 (đổi 1–4); bỏ số để chạy cả ngày.

// BÀI 1 — Timeout chỉ giới hạn chờ, không hủy promise gốc.
// withTimeout(promise, ms, timers=globalThis) -> Promise kết quả promise hoặc lỗi timeout.
// promise là Promise đã khởi động; ms là số nguyên dương.
// Dùng Promise.race với một Promise timer. Nếu timer thắng, reject Error có:
// name = 'TimeoutError', message = `Timeout after ${ms}ms`.
// Nếu promise gốc thắng, giữ nguyên value (kể cả falsy) hoặc Error của nó.
// Dùng finally clearTimeout với đúng handle do timers.setTimeout trả, ở cả hai nhánh.
// Không abort, không sửa promise gốc; nó vẫn có thể hoàn thành sau khi wrapper timeout.
export async function withTimeout(promise, ms, timers = globalThis) {
  Promise.race([
    promise,
    (newPromise = new Promise((_, reject) => {
      timers.setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    })),
  ]).then(
    (value) => {
      return value;
    },
    (error) => {
      throw error;
    },
  );
  throw new Error("TODO: withTimeout");
}

// BÀI 2 — Truyền signal vào Fetch và giữ lỗi gốc.
// fetchJsonWithSignal(url, signal, fetchImpl) -> Promise JSON; signal bắt buộc hợp lệ.
// Nếu signal đã aborted trước lời gọi: reject signal.reason, KHÔNG gọi fetchImpl.
// Nếu chưa: gọi fetchImpl(url, { signal }) đúng một lần, truyền CHÍNH signal đó.
// fetchImpl hỗ trợ abort: nếu abort khi fetch/json còn chờ, nó reject với signal.reason.
// ok=false -> Error(`HTTP ${response.status}`), không đọc json; ok=true -> await json().
// Giữ nguyên lỗi mạng, parse và abort; không đổi thành null/fallback hay tạo controller mới.
// Không tự thêm abort listener: fetchImpl chịu trách nhiệm dừng I/O và báo lỗi.
export async function fetchJsonWithSignal(url, signal, fetchImpl) {
  // TODO
  if (signal.aborted) {
    throw signal.reason;
  }
  const response = await fetchImpl(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.json();

  throw new Error("TODO: fetchJsonWithSignal");
}

// BÀI 3 — Tự xây API chờ có thể hủy.
// abortableDelay(ms, signal, timers=globalThis) -> Promise<void>; ms nguyên dương.
// Signal bắt buộc. Đã aborted -> reject signal.reason ngay, không tạo timer/listener.
// Chưa aborted -> setTimeout và nghe event 'abort' bằng addEventListener.
// Timer đến trước -> fulfill undefined. Abort đến trước -> reject chính signal.reason.
// Dọn timer và abort listener khi settle, cả thành công và abort; không listener sót lại.
// Abort sau khi hoàn thành không làm thay đổi Promise đã fulfill.
// Dùng new Promise để bọc callback timer/event; không polling hoặc Promise.race ở bài này.
export function abortableDelay(ms, signal, timers = globalThis) {
  if (signal.aborted) {
    return Promise.reject(signal.reason);
  }
  const promise = new Promise((resolve, reject) => {
    const timer = timers.setTimeout(() => {
      resolve();
    }, ms);
    signal.addEventListener("abort", () => {
      timers.clearTimeout(timer);
      reject(signal.reason);
    });
  });
  return promise;
  throw new Error("TODO: abortableDelay");
}

// BÀI 4 — Loader chỉ cho request mới nhất ghi state.
// createLatestProductLoader(fetchProduct) -> { getState(), load(id) } dùng closure.
// State: { status:'idle'|'loading'|'success'|'error', data:Product|null, error:Error|null }.
// Ban đầu idle/null/null; getState trả shallow snapshot object mới, giữ data/Error reference.
// load(id) async: tạo AbortController RIÊNG cho mỗi lần load; nếu còn request trước đang
// pending, abort controller cũ với DOMException('Superseded', 'AbortError').
// Chuyển loading/null/null trước khi gọi fetchProduct(id, { signal }) đúng một lần.
// fetchProduct có thể throw/reject hoặc IGNORE abort và hoàn thành muộn.
// Chỉ request hiện hành được cập nhật success/product/null hoặc error/null/ErrorGoc.
// catch/finally của request cũ cũng không được reset state/controller của request mới.
// Promise của TỪNG load vẫn trả product hoặc reject đúng Error của dependency riêng nó,
// kể cả request cũ: không đổi kết quả caller thành undefined hoặc lỗi tự tạo.
// Khi request đã settle thì không abort controller đó khi load lần sau.
// Load sau lỗi reset data/error; method tách ra vẫn chạy; các instance độc lập.
// Gợi ý: phân biệt signal yêu cầu dừng công việc và identity bảo vệ quyền ghi state.
// Caller chịu trách nhiệm await/catch các load. Không timer/retry/UI hoặc cancel() hôm nay.
export function createLatestProductLoader(fetchProduct) {
  const state = { status: "idle", data: null, error: null };

  // TODO: state, controller và identity request hiện hành nằm trong closure.
  return {
    getState() {
      throw new Error("TODO: latestLoader.getState");
    },
    async load(id) {
      throw new Error("TODO: latestLoader.load");
    },
  };
}
