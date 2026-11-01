// TUẦN 1 — NGÀY 4: LEXICAL SCOPE, LEXICAL ENVIRONMENT, SCOPE CHAIN.
// Học chủ đề -> docs/video -> viết trực tiếp trong hàm.
// Không cần điền Markdown; trợ lý tổng kết khi bạn yêu cầu cuối buổi.
// Input giả định hợp lệ; không cần validation hay package mới.
// Giữ cấu trúc hàm lồng nhau và tên export; chỉ thay TODO trong thân hàm.
// Không dùng biến global, eval hoặc this để lấy dữ liệu từ bên ngoài.
// Hôm nay tập trung đọc biến từ scope nơi khai báo; state thay đổi học ở Ngày 5.
//
// Docs — đọc phần Lexical scoping và ví dụ makeFunc/makeAdder:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
// https://developer.mozilla.org/en-US/docs/Glossary/Scope
// Hình minh họa scope chain từ chính tác giả:
// https://dev.to/lydiahallie/javascript-visualized-scope-chain-13pd
// Video:
// F8 Scope (ôn phần scope lồng nhau): https://www.youtube.com/watch?v=5N8vz_VmszE
// Lydia Hallie Execution Contexts, từ 10:14: https://www.youtube.com/watch?v=zdGfo6I1yrA&t=614s
// F8 Closure (bổ trợ factory function): https://www.youtube.com/watch?v=xtQtGKL0NCI
//
// Chạy từng bài: node Week1/Day4/check.mjs 1  (đổi 1–4).
// Chạy tất cả: node Week1/Day4/check.mjs
// Khi mắc: xác định tên biến cần đọc -> tìm khai báo gần nhất trong scope bao ngoài.

// BÀI 1 — Nơi khai báo khác nơi gọi.
// readShopName phải trả `Shop: <shopName của getShopLabel>`.
// Ví dụ getShopLabel('Book House') -> 'Shop: Book House'.
// Dù được gọi trong callFromAdmin, kết quả không được lấy 'Admin Shop'.
// Giữ readShopName nằm ngoài callFromAdmin và không truyền đối số cho helper.
export function getShopLabel(shopName) {
  function readShopName() {
    throw new Error('TODO: readShopName');
  }

  function callFromAdmin() {
    const shopName = 'Admin Shop';
    return readShopName();
  }

  return callFromAdmin();
}

// BÀI 2 — Factory trả về một function dùng cấu hình từ scope ngoài.
// createProductLabeler('Books') trả function nhận name.
// label('JavaScript') -> 'Books: JavaScript'.
// Hai labeler tạo với category khác nhau phải giữ cấu hình riêng.
// Không gọi labelProduct ngay trong factory; cần trả chính function đó.
export function createProductLabeler(category) {
  return function labelProduct(name) {
    throw new Error('TODO: labelProduct');
  };
}

// BÀI 3 — Đọc dữ liệu qua nhiều tầng scope.
// Factory nhận basePrice và taxRate (0.1 nghĩa là 10%).
// Function calculate nhận discountPercent (0–100), mặc định 0.
// Sửa discountedPrice để giảm giá đúng; viết buildResult đọc biến từ scope ngoài.
// Không thêm parameter vào buildResult và không dời nó ra ngoài calculate.
// Trả { currency, basePrice, discountedPrice, total }.
// Ví dụ createPriceCalculator(200000, 0.1)(10):
// { currency: 'VND', basePrice: 200000, discountedPrice: 180000, total: 198000 }.
// Chưa làm bài toán làm tròn tiền; dùng bộ input mẫu có kết quả nguyên.
export function createPriceCalculator(basePrice, taxRate) {
  const currency = 'VND';

  return function calculate(discountPercent = 0) {
    // TODO: hiện chưa áp dụng discountPercent.
    const discountedPrice = basePrice;

    function buildResult() {
      throw new Error('TODO: buildResult');
    }

    return buildResult();
  };
}

// BÀI 4 — Scope của factory và scope của từng lần gọi.
// createAccessChecker('admin') trả function nhận { roles: ['admin', ...] }.
// Trả true nếu roles chứa requiredRole; ngược lại false.
// Helper đọc roles từ canAccess và requiredRole từ createAccessChecker.
// Hai checker khác nhau và các lần gọi với user khác nhau không ảnh hưởng nhau.
// Giữ helper lồng; không truyền thêm arguments cho hasRequiredRole.
// Đây là bài predicate thuần, chưa phải hệ thống authorization production.
export function createAccessChecker(requiredRole) {
  return function canAccess(user) {
    const roles = user.roles;

    function hasRequiredRole() {
      throw new Error('TODO: hasRequiredRole');
    }

    return hasRequiredRole();
  };
}
