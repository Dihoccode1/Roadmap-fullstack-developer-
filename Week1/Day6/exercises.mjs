// TUẦN 1 — NGÀY 6: THIS, ARROW FUNCTION, BIND VÀ PROTOTYPE/CLASS.
// Chủ đề -> docs/video -> làm trực tiếp trong code; không cần điền Markdown.
// Input hợp lệ theo từng bài; chưa làm async, DOM hoặc runtime validation mới.
// Khác Ngày 5, bài hôm nay chủ động yêu cầu this và method theo call site.
// Giữ tên export/API; đọc điều kiện về cách viết, không chỉ làm cho check pass.
// Các file .mjs chạy ở strict mode: plain function call không tự có this = global.
// Không sửa Object.prototype/Array.prototype, không dùng eval hoặc __proto__.
//
// Docs:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
// Video:
// F8 — This keyword: https://www.youtube.com/watch?v=ii1Ra_zLDIo
// Sam Meech-Ward — Prototypes: https://www.youtube.com/watch?v=n6lSxTgOm40
// Nguồn chính chủ kèm video/chapter: https://www.sammeechward.com/prototypes-in-javascript
//
// Chạy từng bài: node Week1/Day6/check.mjs 1  (đổi số 1–4).
// Chạy tất cả: node Week1/Day6/check.mjs

// BÀI 1 — Method thường lấy this theo cách gọi.
// Trả object có name, priceMinor và getLabel().
// getLabel trả '<name>: <priceMinor> VND', đọc dữ liệu từ this.
// Không dùng parameter name/priceMinor trực tiếp trong thân getLabel.
// Thay thuộc tính object hoặc mượn method bằng call phải đổi nhãn tương ứng.
// Ví dụ createPriceTag('Book', 45000).getLabel() -> 'Book: 45000 VND'.
// Dùng method thường, không arrow/bind ở bài 1.
export function createPriceTag(name, priceMinor) {
  return {
    name,
    priceMinor,
    getLabel() {
      throw new Error('TODO: getLabel');
    },
  };
}

// BÀI 2 — Callback không mất receiver bằng bind.
// cart là object có items và method getTotal(), method đó sử dụng this.items.
// Trả function mới từ cart.getTotal.bind(...), không gọi getTotal ngay lúc tạo.
// Callback gọi độc lập hoặc .call với receiver khác vẫn dùng cart ban đầu.
// Sau khi cart.items thay đổi, callback phải đọc state mới, không cache con số cũ.
// Không sửa method gốc; dùng bind, không thay bằng wrapper arrow ở bài 2.
export function createTotalCallback(cart) {
  throw new Error('TODO: createTotalCallback');
}

// BÀI 3 — Arrow callback dùng this của method bao ngoài.
// Trả object có shopName và formatItems(items).
// items: [{ name: 'Book', quantity: 2 }, ...].
// Trả array nhãn '<shopName> | <name> x<quantity>', giữ thứ tự; [] -> [].
// Giữ formatItems là method thường và dùng arrow làm callback của map.
// Đọc this.shopName trong callback; không capture parameter shopName của factory.
// Không dùng bind, map thisArg hoặc biến self để né bài arrow.
// Borrow formatItems bằng call phải dùng shopName của receiver mới.
export function createReceiptFormatter(shopName) {
  return {
    shopName,
    formatItems(items) {
      // TODO: thay callback thường bằng arrow và hoàn thiện nội dung.
      return items.map(function (item) {
        throw new Error('TODO: formatItems callback');
      });
    },
  };
}

// BÀI 4 — Constructor, method dùng chung trên prototype và class kế thừa.
// new Product(name, priceMinor) có own properties name và priceMinor.
// getLabel nằm trên Product.prototype, không tạo lại trên từng instance.
// getLabel đọc this và trả nhãn cùng format bài 1.
// Không bind method trong constructor; hai instance dùng chung getLabel.
export function Product(name, priceMinor) {
  throw new Error('TODO: Product constructor');
}

Product.prototype.getLabel = function () {
  throw new Error('TODO: Product.prototype.getLabel');
};

// DiscountedProduct kế thừa Product, thêm own property discountPercent (0–100).
// getFinalPrice trả giá sau giảm; không sửa priceMinor gốc.
// Giữ super, không viết lại getLabel ở class con, không dùng arrow class field.
// Ví dụ new DiscountedProduct('Book', 200000, 10):
// getLabel() -> 'Book: 200000 VND'; getFinalPrice() -> 180000.
export class DiscountedProduct extends Product {
  constructor(name, priceMinor, discountPercent) {
    super(name, priceMinor);
    // TODO: lưu discountPercent trên instance.
  }

  getFinalPrice() {
    throw new Error('TODO: getFinalPrice');
  }
}
