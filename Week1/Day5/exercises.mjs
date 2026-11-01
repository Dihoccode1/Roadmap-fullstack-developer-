// TUẦN 1 — NGÀY 5: CLOSURE, PRIVATE STATE VÀ SNAPSHOT.
// Chủ đề -> docs/video -> code trong hàm. Markdown được tổng kết cuối buổi.
// Giữ tên export và API bên dưới. Tự thêm state trong scope của từng factory.
// Không dùng class, this, biến global hoặc property public để giữ state nội bộ.
// Các method cần hoạt động cả khi tách ra: const { increment } = counter.
// Không cần package mới hoặc code bất đồng bộ.
//
// Docs: phần Closure, makeAdder và Emulating private methods with closures:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures
// Ôn shallow copy để trả snapshot:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
// Video, chọn một nguồn chính, nguồn khác dùng khi cần giải thích thêm:
// F8 (Việt): https://www.youtube.com/watch?v=xtQtGKL0NCI
// Web Dev Simplified (Anh): https://www.youtube.com/watch?v=3a0I8ICR1Vg
// Lydia Hallie (Anh, minh họa sâu hơn): https://www.youtube.com/watch?v=6Ixyltr8_R0
//
// Chạy từng bài: node Week1/Day5/check.mjs 1  (đổi 1–4).
// Chạy tất cả: node Week1/Day5/check.mjs
// Gợi ý chung: state nằm ngoài các method nhưng nằm trong factory.

// BÀI 1 — Counter có state chung giữa các method.
// initialValue là số nguyên hợp lệ, mặc định 0.
// getValue(): trả số hiện tại; increment()/decrement(): đổi 1 đơn vị, trả số mới.
// reset(): về initialValue của counter đó và trả số sau reset.
// Hai counter độc lập; không tạo lại state trong mỗi method.
// Ví dụ createCounter(5): getValue()=5, increment()=6, reset()=5.
export function createCounter(initialValue = 0) {
  // TODO: state riêng cho một counter.
  return {
    getValue() {
      throw new Error('TODO: getValue');
    },
    increment() {
      throw new Error('TODO: increment');
    },
    decrement() {
      throw new Error('TODO: decrement');
    },
    reset() {
      throw new Error('TODO: reset');
    },
  };
}

// BÀI 2 — Function chỉ thực thi một lần, nhớ cả kết quả falsy.
// createOnce(fn) trả function runOnce(...args).
// Lần đầu: gọi fn với args, lưu và trả kết quả.
// Các lần sau: không gọi fn nữa, trả đúng kết quả đầu tiên, bỏ qua args mới.
// Phải đúng cả khi kết quả là 0, false, '' hoặc undefined.
// Nếu kết quả là object, trả cùng object đã lưu (không cần snapshot ở bài này).
// Mỗi lần createOnce có state riêng. fn đồng bộ và không throw trong bài hôm nay.
// Gợi ý: trạng thái "đã gọi chưa" khác với bản thân kết quả được lưu.
export function createOnce(fn) {
  // TODO: state của wrapper nằm ở đâu để không reset sau mỗi lần gọi?
  return function runOnce(...args) {
    throw new Error('TODO: runOnce');
  };
}

// BÀI 3 — History có private array và snapshot.
// add(value): thêm string hợp lệ vào cuối, trả độ dài mới.
// getAll(): trả array mới chứa các string theo đúng thứ tự đã thêm.
// clear(): xóa history, trả undefined; các method cũ vẫn phải thấy state mới.
// Sửa array do getAll trả về không được sửa history nội bộ.
// Snapshot đã lấy trước đó không đổi khi history được add/clear sau này.
// Vì phần tử là string nên shallow copy đủ trong bài 3.
export function createHistory() {
  // TODO: state riêng của history.
  return {
    add(value) {
      throw new Error('TODO: history.add');
    },
    getAll() {
      throw new Error('TODO: history.getAll');
    },
    clear() {
      throw new Error('TODO: history.clear');
    },
  };
}

// BÀI 4 — Mini project: Cart giữ state bằng closure.
// catalog: [{ id: 'p001', priceMinor: 100000 }, ...], ID duy nhất, giá nguyên hợp lệ.
// Coi catalog là read-only trong thời gian dùng cart; không có tên/stock trong bài.
// add(productId, quantity=1): thêm/cộng quantity; trả quantity mới của sản phẩm đó.
// quantity phải là số nguyên an toàn > 0; ID không có hoặc quantity sai -> RangeError.
// Input quantity được test ở mức nhỏ; chưa xử lý giới hạn tổng tích lũy rất lớn.
// Mỗi productId chỉ có một dòng; dòng mới thêm cuối, dòng cũ giữ vị trí khi cộng.
// remove(productId): xóa cả dòng, trả true nếu có, false nếu không có.
// getItems(): snapshot [{ productId, priceMinor, quantity }, ...].
// Phải copy array VÀ từng item; sửa snapshot không được sửa cart.
// getTotal(): tính tổng priceMinor * quantity hiện tại, giỏ rỗng trả 0.
// Không sửa catalog; hai cart cùng catalog vẫn có giỏ riêng.
// Ví dụ catalog p001 giá 100000: add('p001', 2) -> 2, getTotal() -> 200000.
export function createCart(catalog) {
  // TODO: state riêng cho một cart; không đặt lại trong add/getItems/getTotal.
  return {
    add(productId, quantity = 1) {
      throw new Error('TODO: cart.add');
    },
    remove(productId) {
      throw new Error('TODO: cart.remove');
    },
    getItems() {
      throw new Error('TODO: cart.getItems');
    },
    getTotal() {
      throw new Error('TODO: cart.getTotal');
    },
  };
}
