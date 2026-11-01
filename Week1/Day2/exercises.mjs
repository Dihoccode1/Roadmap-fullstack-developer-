// TUẦN 1 — NGÀY 2: SCOPE, HOISTING, TEMPORAL DEAD ZONE (TDZ).
// Cách học: chủ đề trong chat -> docs/video -> sửa trực tiếp các hàm dưới đây.
// Không cần điền Markdown. Tổng kết Markdown được viết cuối buổi khi bạn yêu cầu.
// Input của bài hôm nay được giả định hợp lệ; tập trung scope và thứ tự khởi tạo.
// Bốn hàm bắt buộc đã được sửa và review; bonus còn TODO.
// Các mô tả lỗi/gợi ý bên dưới giữ lại để ôn nguyên nhân của đề ban đầu.
// Không xem lời giải trước; có thể hỏi gợi ý theo từng bài.
// Chạy: node Week1/Day2/check.mjs 1  (đổi số 1–4); bỏ số để chạy cả bốn bài.
//
// Docs:
// https://developer.mozilla.org/en-US/docs/Glossary/Scope
// https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#hoisting
// Video F8 Official:
// Scope: https://www.youtube.com/watch?v=5N8vz_VmszE
// Hoisting: https://www.youtube.com/watch?v=3MLhU1DrUxM

// BÀI 1 — Block scope.
// Tính tổng các giá trị trong prices; array rỗng trả 0.
// Ví dụ: [100000, 50000, 25000] -> 175000.
// Điều kiện: dùng let/const, không dùng var hoặc biến global.
// Gợi ý: biến cộng dồn cần sống trong scope nào và khởi tạo mấy lần?
export function calculateOrderTotal(prices) {
  let total = 0;
  for (const price of prices) {
    total += price;
  }

  return total;
}

// BÀI 2 — Shadowing và TDZ.
// Trả { originalPrice, finalPrice } sau giảm giá discountPercent (0–100).
// Ví dụ: (200000, 10) -> { originalPrice: 200000, finalPrice: 180000 }.
// Giữ nguyên giá gốc trong kết quả. Không dùng biến global.
// Gợi ý: trong block if, tên price đang resolve đến binding nào?
export function getPriceSummary(price, discountPercent) {
  let finalPrice = price;

  if (discountPercent > 0) {
    finalPrice = price - (price * discountPercent) / 100;
  }

  return { originalPrice: price, finalPrice };
}

// BÀI 3 — Function declaration so với function expression.
// Trả nhãn PRODUCT: <TÊN ĐÃ TRIM VÀ VIẾT HOA>.
// Ví dụ: '  keyboard  ' -> 'PRODUCT: KEYBOARD'.
// Giữ dòng gọi buildLabel ở TRƯỚC phần định nghĩa helper.
// Sửa cách khai báo helper để lời gọi đó hợp lệ; không trả chuỗi hardcode.
export function formatProductLabel(name) {
  const label = buildLabel(name);

  function buildLabel(productName) {
    const trimmed = productName.trim();
    const uppercased = trimmed.toUpperCase();
    return `PRODUCT: ${uppercased}`;
  }

  return label;
}

// BÀI 4 — Thứ tự khởi tạo let/const.
// taxRate là tỷ lệ thập phân: 0.1 nghĩa là 10%.
// Trả subtotal + subtotal * taxRate. Ví dụ: (100000, 0.1) -> 110000.
// Điều kiện: giữ tax và total là const; không dùng var, global hoặc try/catch né lỗi.
// Gợi ý: tax cần được khởi tạo trước thời điểm nào?
export function calculateInvoice(subtotal, taxRate) {
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return total;
}

// BONUS — Tích hợp các hàm đã sửa, không bắt buộc.
// items: [{ price: 100000, quantity: 2 }, { price: 50000, quantity: 1 }].
// Giảm giá trên subtotal trước, rồi tính thuế trên giá sau giảm.
// Trả { subtotal, discountAmount, taxAmount, total, itemCount }.
// itemCount là tổng quantity, không phải số dòng.
// Ví dụ items trên, discountPercent=10, taxRate=0.1:
// { subtotal: 250000, discountAmount: 25000, taxAmount: 22500,
//   total: 247500, itemCount: 3 }.
// Input đã hợp lệ; không thêm validation của Ngày 1 nếu chưa cần.
export function summarizeCart(items, discountPercent = 0, taxRate = 0) {
  throw new Error("TODO bonus: summarizeCart");
}
