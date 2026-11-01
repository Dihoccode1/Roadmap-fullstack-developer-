// TUẦN 2 — NGÀY 1 (NGÀY 8 TOÀN LỘ TRÌNH): ASYNC JAVASCRIPT CƠ BẢN.
// Học chủ đề -> docs/video -> viết trực tiếp trong các hàm.
// Không cần điền Markdown; tổng kết cuối buổi khi bạn yêu cầu.
// Input hợp lệ theo từng bài; không có mạng thật, package mới hay API key.
// fetchProduct là dependency được test truyền vào, không phải global fetch.
// Nó nhận productId và trả Promise<Product>; không cần tự viết dependency này.
// Giữ tên export, không sửa file check để bỏ qua lỗi; làm lần lượt 1–4.
//
// Docs:
// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Promises
// Video:
// F8 sync/async: https://www.youtube.com/watch?v=QJmNEqy0zV0
// F8 Promise chain: https://www.youtube.com/watch?v=Ldl571DAlXI
// Web Dev Simplified async/await: https://www.youtube.com/watch?v=V_Kr9OSfDeU
//
// Chạy từng bài: node Week2/Day1/check.mjs 1  (đổi 1–4).
// Chạy cả buổi: node Week2/Day1/check.mjs
// Runner tự await từng case; báo lỗi nếu Promise không settle trong thời hạn kiểm tra.
// Chưa làm Promise.all, retry hoặc event loop nâng cao ở bài đầu tiên này.
// Review: bốn bài đạt 12/12 tình huống, đúng cách dùng timer/then/await/finally.

// BÀI 1 — Tạo Promise hoàn thành sau timer.
// delay(ms, value) trả Promise fulfill bằng đúng value sau timer setTimeout.
// ms là số nguyên hợp lệ >= 0, trong bài test chỉ dùng vài millisecond.
// Kể cả ms=0 vẫn dùng timer; không resolve ngay bằng Promise.resolve(value).
// Giữ được mọi value, gồm 0, false, '', undefined và reference của object.
// Không dùng vòng lặp chờ/busy wait. Return bên trong timer không thay cho resolve.
// Ví dụ: await delay(5, 'ready') -> 'ready'.
export function delay(ms, value) {
  const timer = new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, ms);
  });
  return timer;
}

// BÀI 2 — Return một Promise chain.
// fetchProduct(id) -> Promise<{ id, name, priceMinor }>.
// Gọi dependency đúng một lần với productId, dùng .then để trả product.name.
// Nếu dependency reject thì Promise trả về reject với chính Error đó.
// Không nuốt lỗi thành undefined; không dùng async/await trong bài 2.
// Ví dụ: await getProductName('p1', fetchProduct) -> 'Keyboard'.
// Gợi ý: cần return cả Promise chain lẫn giá trị ở callback then.
export function getProductName(productId, fetchProduct) {
  const product = fetchProduct(productId);
  return product.then((product) => {
    return product.name;
  });
}

// BÀI 3 — Lấy kết quả Promise bằng await trước khi tính toán.
// quantity là số nguyên dương hợp lệ; giá và tổng nằm trong miền safe integer.
// Gọi fetchProduct một lần; dùng await để lấy product rồi trả object:
// { productId: product.id, name: product.name, quantity,
//   total: product.priceMinor * quantity }.
// Không sửa product do dependency trả về. Lỗi dependency phải tiếp tục reject.
// Không tự tạo new Promise để bọc một dependency vốn đã trả Promise.
// Ví dụ product giá 100000, quantity=2 -> total=200000.
export async function getOrderPreview(productId, quantity, fetchProduct) {
  const product = await fetchProduct(productId);
  return {
    productId: product.id,
    name: product.name,
    quantity: quantity,
    total: product.priceMinor * quantity,
  };
}

// BÀI 4 — try/catch/finally với Promise.
// Dùng async/await; fetchProduct có thể reject hoặc throw đồng bộ bằng Error.
// Thành công: fulfill { ok: true, name: product.name }.
// Thất bại: fulfill { ok: false, error: error.message }, không reject ra ngoài.
// Ghi events đúng thứ tự:
// - đầu hàm: 'start'; thành công: 'success'; bắt lỗi: 'error'; cuối cùng: 'end'.
// Thành công -> ['start', 'success', 'end']; lỗi -> ['start', 'error', 'end'].
// Dùng finally để ghi 'end', kể cả khi return trong try/catch.
// Chỉ gọi fetchProduct một lần; events mặc định là array riêng cho mỗi lần gọi.
export async function getProductNameSafe(productId, fetchProduct, events = []) {
  events.push("start");
  try {
    const product = await fetchProduct(productId);
    events.push("success");
    return { ok: true, name: product.name };
  } catch (error) {
    events.push("error");
    return { ok: false, error: error.message };
  } finally {
    events.push("end");
  }
}
