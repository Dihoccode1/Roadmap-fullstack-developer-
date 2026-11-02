// TUẦN 3 — NGÀY 1 (NGÀY 15): TYPESCRIPT CƠ BẢN VÀ STRICT TYPE CHECKING.
// Chủ đề -> docs/video -> khai báo kiểu và làm trực tiếp trong hàm .ts.
// Bốn hàm đang thiếu annotation CÓ CHỦ ĐÍCH: strict báo implicit any cho đến khi bạn bổ sung.
// Giữ các interface được cung cấp; không dùng any, as, @ts-ignore hoặc @ts-expect-error
// trong file bài làm để né lỗi. Không sửa contracts.ts/tsconfig để làm check xanh.
// Không cần dùng generic, enum, class hoặc framework hôm nay.
//
// WHY: phát hiện sai kiểu lúc viết code; phân biệt kiểm tra kiểu với chạy JavaScript.
// HOW: annotation ở ranh giới hàm, inference cho biến bên trong, interface cho object.
// TRADE-OFF: type không tự kiểm tra JSON/runtime input; readonly là ràng buộc compile-time.
// WHEN: mô hình Product/Cart và hợp đồng hàm. Runtime validation/narrowing học sau.
// Input bài hôm nay hợp lệ theo mô tả; không tự thêm validate số âm/NaN/schema.
//
// Docs chính thức:
// https://www.typescriptlang.org/docs/handbook/2/basic-types.html
// Đọc Static type-checking, Explicit Types, Erased Types và Strictness.
// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
// Đọc primitive types, function annotation, object types, optional properties, interfaces.
// https://www.typescriptlang.org/docs/handbook/2/objects.html#readonlyarray
// https://www.typescriptlang.org/tsconfig/strict.html
// Cách Node chạy .ts khác typecheck: https://nodejs.org/api/typescript.html#type-stripping
// Video: Programming with Mosh — TypeScript Tutorial for Beginners
// https://www.youtube.com/watch?v=d56mG7DezGs
// Ưu tiên kiểu cơ bản, functions, objects; enum/tuple và các phần nâng cao để sau.
//
// Đã chuẩn bị compiler cục bộ trong Week3. Nếu clone sang máy mới: npm --prefix Week3 ci
// Kiểm tra kiểu: npm --prefix Week3 run typecheck:day1
// Đầu tiên thêm annotation cho CẢ BỐN chữ ký, sau đó viết logic từng bài.
// contracts.ts báo Unused @ts-expect-error khi input sai còn được chấp nhận:
// sửa chữ ký hàm trong bài làm, không xóa các ca kiểm tra âm đó.
// Chạy bài 1: node Week3/Day1/check.mjs 1 (đổi 1–4); bỏ số để chạy cả ngày.
// Node hiện tại chạy .ts bằng type stripping, KHÔNG tự typecheck; cần chạy cả hai lệnh.
// Node type stripping không áp dụng tsconfig như compiler, không phải bước build production.
// Gợi ý 5 giờ: 80 phút docs/video và thử lệnh; 35 phút bài 1; 50 phút bài 2;
// 45 phút bài 3; 60 phút bài 4; 30 phút typecheck, runtime check và tự giải thích.
// Review: bản nộp đạt strict typecheck và 12/12 runtime; dọn bốn throw TODO sau return.

// Các hợp đồng dữ liệu cung cấp sẵn để bạn tập trung khai báo kiểu và logic hàm.
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly priceInCents: number;
}

export interface UserProfile {
  readonly username: string;
  readonly displayName?: string;
}

export interface CartItem {
  readonly product: Product;
  readonly quantity: number;
}

export interface CartSummary {
  lineCount: number;
  totalQuantity: number;
  totalInCents: number;
}

// BÀI 1 — Annotation tham số/return, inference biến nội bộ.
// Thêm kiểu cho unitPriceInCents:number, quantity:number và return:number.
// Trả đơn giá * số lượng. Input là số nguyên không âm; giữ kết quả 0.
// Dùng number, không Number hoặc ép chuỗi. Ví dụ 1250, 3 -> 3750.
export function calculateLineTotal(
  unitPriceInCents: number,
  quantity: number,
): number {
  return unitPriceInCents * quantity;
}

// BÀI 2 — Interface Product và cập nhật bất biến.
// Thêm product:Product, percent:number, return:Product.
// percent hợp lệ 0..100. Trả object MỚI có id/name cũ và priceInCents giảm phần trăm,
// làm tròn Math.round(product.priceInCents * (1 - percent / 100)).
// Không sửa product. Ví dụ 105 cents giảm 10% -> 95 cents.
// Giảm 0% vẫn trả object mới; giá 0 hoặc giảm 100% vẫn giữ số 0.
export function applyDiscount(product: Product, percent: number): Product {
  return {
    id: product.id,
    name: product.name,
    priceInCents: Math.round(product.priceInCents * (1 - percent / 100)),
  };
}

// BÀI 3 — Optional property và strictNullChecks.
// Thêm profile:UserProfile và return:string.
// Nếu displayName có giá trị sau trim thì trả chuỗi đã trim; thiếu/rỗng/toàn khoảng trắng
// thì trả username nguyên bản. Không sửa profile, không dùng non-null assertion (!).
// Ví dụ { username:'linh', displayName:'  Linh  ' } -> 'Linh'; thiếu displayName -> 'linh'.
export function getDisplayName(profile: UserProfile): string {
  if (profile.displayName && profile.displayName.trim() !== "") {
    return profile.displayName.trim();
  }
  return profile.username;
}

// BÀI 4 — readonly array và ghép hàm đã typed.
// Thêm items:readonly CartItem[] và return:CartSummary.
// Trả { lineCount: số dòng, totalQuantity: tổng quantity, totalInCents: tổng tiền }.
// Tái sử dụng calculateLineTotal. Input quantity nguyên không âm; ID lặp là dòng riêng.
// [] -> cả ba trường bằng 0. Không sửa array/items/product; không clone nếu không cần.
// readonly không tự đóng băng object lúc chạy; checker dùng input đã freeze để kiểm tra bất biến.
export function summarizeCart(items: readonly CartItem[]): CartSummary {
  return {
    lineCount: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalInCents: items.reduce(
      (sum, item) =>
        sum + calculateLineTotal(item.product.priceInCents, item.quantity),
      0,
    ),
  };
}
