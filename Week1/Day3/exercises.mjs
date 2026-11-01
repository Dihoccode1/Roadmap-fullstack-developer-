// TUẦN 1 — NGÀY 3: EXECUTION CONTEXT, CALL STACK VÀ RECURSION.
// Chủ đề -> docs/video -> làm trực tiếp trong hàm. Không cần viết bài vào Markdown.
// Khi bạn yêu cầu tổng kết cuối buổi, trợ lý mới viết Markdown và commit/push.
// Hôm nay chỉ có code đồng bộ. Input giả định hợp lệ theo từng bài.
// Review: bài 1–3 đạt; bài 4 đúng kết quả nhưng cần đổi công thức sang vòng lặp.
//
// Docs:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#stack_and_execution_contexts
// https://developer.mozilla.org/en-US/docs/Glossary/Call_stack
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#recursion
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion
// Video (tiếng Anh, có hình minh họa):
// Lydia Hallie: https://www.youtube.com/watch?v=zdGfo6I1yrA
// Colt Steele: https://www.youtube.com/watch?v=W8AeMrVtFLY
// Video bổ trợ tiếng Việt về đệ quy — Kteam:
// https://www.youtube.com/watch?v=6yxtJRzx7Qs
//
// Chạy từng bài: node Week1/Day3/check.mjs 1  (thay số 1–4).
// Chạy tất cả: node Week1/Day3/check.mjs
// Debug: node --inspect-brk Week1/Day3/check.mjs 1
// Đặt breakpoint trong multiply; xem Call Stack và giá trị locals của từng frame.
// Không có yêu cầu chép lại output; hãy tự sửa hàm và kiểm chứng bằng debugger.

// BÀI 1 — Hàm con trả về đâu? Caller tiếp tục chạy từ đâu?
// calculateCheckout -> calculateSubtotal -> multiply; sau đó mới đến addShipping.
// Có một lỗi làm tổng tiền sai. Tìm và sửa lỗi, giữ nguyên call chain và events.
// Ví dụ calculateCheckout(100000, 2, 30000) -> 230000.
// Không tính lại toàn bộ công thức trong calculateCheckout để né hàm con.
// Khi debug ở multiply, xem ba frame của bài và biến riêng của mỗi frame.
export function calculateCheckout(price, quantity, shippingFee, events = []) {
  events.push("enter calculateCheckout");
  const subtotal = calculateSubtotal(price, quantity, events);
  const total = addShipping(subtotal, shippingFee, events);
  events.push("exit calculateCheckout");

  return total;
}

function calculateSubtotal(price, quantity, events) {
  events.push("enter calculateSubtotal");
  const subtotal = multiply(price, quantity, events);
  events.push("exit calculateSubtotal");
  // Trả giá trị về để calculateCheckout tiếp tục tính phí vận chuyển.
  return subtotal;
}

function multiply(price, quantity, events) {
  events.push("enter multiply");
  const result = price * quantity;
  events.push("exit multiply");
  return result;
}

function addShipping(subtotal, shippingFee, events) {
  events.push("enter addShipping");
  const total = subtotal + shippingFee;
  events.push("exit addShipping");
  return total;
}

// BÀI 2 — Sửa đệ quy không tiến về base case.
// sumTo(n) trả 0 + 1 + ... + n; n là số nguyên từ 0 đến 100 trong bài này.
// Ví dụ sumTo(3) -> 6, sumTo(0) -> 0.
// Giữ cách giải đệ quy; không thay bằng vòng lặp hoặc công thức trong bài 2.
// Code hiện tại có base case nhưng vẫn có thể tràn stack. Sửa recursive step.
// Debug với n=3 để thấy từng frame có một giá trị n riêng.
export function sumTo(n) {
  if (n === 0) {
    return 0;
  }

  return n + sumTo(n - 1);
}

// BÀI 3 — Mỗi lần gọi đệ quy có biến local riêng.
// category: { name, productCount, children: [category, ...] }.
// Tính tổng productCount của node hiện tại và mọi node con/cháu.
// Cây hợp lệ, không có vòng; mỗi product được tính ở đúng một node.
// Ví dụ root có 2, child A có 3, child B có 4, cháu B1 có 1 -> tổng 10.
// Điều kiện: đệ quy; biến cộng dồn local; không global, không sửa input.
export function countCategoryProducts(category) {
  // Mỗi lần gọi giữ biến total local cho node đang xử lý.
  let total = category.productCount;
  for (const child of category.children) {
    total += countCategoryProducts(child);
  }
  return total;
}

// BÀI 4 — Cùng kết quả, tránh tăng số frame theo n.
// Viết bản vòng lặp tính 0 + 1 + ... + n, với n từ 0 đến 100000.
// Ví dụ sumToIterative(3) -> 6; gọi lặp lại không cộng dồn từ lần trước.
// Không dùng recursion, không gọi sumTo, không dùng công thức tổng cấp số cộng.
// Mục tiêu: quan sát vòng lặp không tạo thêm frame cho từng lần lặp.
// Không cần chạy bản đệ quy với n lớn để làm máy tràn stack.
export function sumToIterative(n) {
  // REVIEW: lời giải hiện tại dùng công thức; cần tự đổi sang for/while theo đề.
  // Check chỉ kiểm tra kết quả, không chứng minh đã dùng vòng lặp.
  let total = 0;
  if (n == 0) {
    return 0;
  }
  return (total = (n * (n + 1)) / 2);
}
