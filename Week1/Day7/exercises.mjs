// TUẦN 1 — NGÀY 7: ÔN TẬP VÀ TÍCH HỢP GIỎ HÀNG / HÓA ĐƠN.
// Chủ đề -> docs/video -> làm trực tiếp trong hàm. Tổng kết Markdown cuối buổi.
// Không yêu cầu constructor/prototype/class của bài 4 Ngày 6 đã được bỏ qua.
// Không thêm async, database, framework hoặc package.
// Làm theo thứ tự 1 -> 2 -> 3 -> 4; các bài sau có thể dùng các bài trước.
//
// Docs: array aggregation, closure/private state, snapshot, this/bind.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
// Video ôn, chỉ xem phần đang vướng:
// F8 reduce qua ví dụ: https://www.youtube.com/watch?v=gLIXXBIySZ8
// F8 closure: https://www.youtube.com/watch?v=xtQtGKL0NCI
// F8 this: https://www.youtube.com/watch?v=ii1Ra_zLDIo
//
// Chạy từng bài: node Week1/Day7/check.mjs 1  (đổi 1–4).
// Chạy cả ngày: node Week1/Day7/check.mjs
// Bài kiểm tra tổng hợp có 12 tình huống; review cuối buổi đọc thêm cách giữ state.

import { createCart } from '../Day5/exercises.mjs';

// BÀI 1 — Gộp các dòng sản phẩm mà không sửa input.
// lines: [{ productId, quantity }, ...]. productId là string hợp lệ.
// quantity phải là số nguyên an toàn > 0; sai thì throw RangeError.
// Cùng ID được cộng quantity, giữ thứ tự ID xuất hiện lần đầu.
// Trả array mới và từng dòng mới, chỉ có productId/quantity; [] -> [].
// Tổng quantity trong bộ dữ liệu nằm trong miền safe integer.
// Ví dụ [p1:2, p2:1, p1:3] -> [p1:5, p2:1].
// Được dùng for/find hoặc reduce; ưu tiên cách tự giải thích được.
export function mergeCartLines(lines) {
  throw new Error('TODO: mergeCartLines');
}

// BÀI 2 — Tổng tiền thuần, không giữ state giữa các lần gọi.
// catalog: [{ id, priceMinor }, ...], ID duy nhất, giá nguyên không âm hợp lệ.
// lines cùng cấu trúc bài 1, có thể có ID lặp; dùng lại mergeCartLines.
// discountPercent là số nguyên hợp lệ 0–100 ở bài 2; không cần validate lại nó.
// ID không có trong catalog -> RangeError; quantity sai theo contract bài 1.
// subtotal = tổng giá từ catalog * quantity; itemCount = tổng quantity.
// discountAmount = Math.floor(subtotal * discountPercent / 100).
// total = subtotal - discountAmount. Đây là quy tắc làm tròn của bài tập.
// Trả { itemCount, subtotal, discountAmount, total }; giỏ rỗng có tất cả bằng 0.
// Không sửa catalog/lines, không lấy giá do lines truyền thêm vào.
// Ví dụ p1 giá 100000 x2 + p2 giá 45000 x1, giảm 10%:
// { itemCount: 3, subtotal: 245000, discountAmount: 24500, total: 220500 }.
export function calculateOrderSummary(catalog, lines, discountPercent = 0) {
  throw new Error('TODO: calculateOrderSummary');
}

// BÀI 3 — Ghép cart Ngày 5 với cấu hình discount bằng closure.
// Method add/remove/getItems đã chuyển tiếp tới cart đã hoàn thành ở Ngày 5.
// Tự viết setDiscount, getSummary và getReceipt; không dùng this ở bài 3.
// setDiscount(percent): chỉ nhận số nguyên 0–100; sai -> RangeError, giữ state cũ.
// Sau setDiscount hợp lệ, trả percent vừa lưu.
// getSummary(): dùng calculateOrderSummary với giỏ hiện tại và discount hiện tại.
// getReceipt(): snapshot { items: cart.getItems(), summary: getSummary() }.
// Thay giỏ/discount sau đó không được đổi receipt cũ; sửa receipt không đổi session.
// getReceipt không tự xóa giỏ; chưa thực hiện thanh toán hoặc lưu đơn.
// Method tách ra vẫn hoạt động; hai session độc lập dù cùng catalog.
export function createCheckoutSession(catalog) {
  const cart = createCart(catalog);
  // TODO: state discount ban đầu bằng 0, nằm trong factory.

  function getSummary() {
    throw new Error('TODO: session.getSummary');
  }

  return {
    add: cart.add,
    remove: cart.remove,
    getItems: cart.getItems,
    setDiscount(percent) {
      throw new Error('TODO: session.setDiscount');
    },
    getSummary,
    getReceipt() {
      throw new Error('TODO: session.getReceipt');
    },
  };
}

// BÀI 4 — Printer dùng this và callback đã bind.
// session là object có getSummary() theo bài 3.
// print() đọc this.shopName/this.session và trả:
// '<shopName> | <itemCount> items | <total> VND'.
// Ví dụ 'Alpha | 3 items | 220500 VND'. Giữ chữ items kể cả 0 hoặc 1.
// createCallback() dùng bind trả function print gắn với printer này, không gọi ngay.
// Callback đọc tên shop và summary mới sau mỗi thay đổi, không cache string cũ.
// print là method thường; không capture parameter shopName/session trong print.
// Có thể mượn print bằng call với object có cùng shape.
export function createReceiptPrinter(shopName, session) {
  return {
    shopName,
    session,
    print() {
      throw new Error('TODO: printer.print');
    },
    createCallback() {
      throw new Error('TODO: printer.createCallback');
    },
  };
}
