// TUẦN 3 — NGÀY 3 (NGÀY 17): GIỎ HÀNG TYPED, VALIDATION VÀ BẤT BIẾN.
// Học chủ đề -> docs/video -> làm trực tiếp trong hàm .ts; tổng kết cuối ngày khi review.
// Chữ ký/model được cung cấp. Không any, as, non-null assertion, directive né lỗi trong bài làm.
// Không đổi contracts.ts/tsconfig. Không package mới/generic/framework hoặc mạng thật.
// Tái sử dụng Product/CartItem/CartSummary, isProduct và summarizeCart đã hoàn thành.
// Input unknown là dữ liệu thông thường, không Proxy/getter gây lỗi.
//
// WHY: dữ liệu lồng nhau cần validation; readonly giúp không sửa nhầm, closure giữ state riêng.
// HOW: guard CartItem, parse array có kiểm tra ID trùng, hàm cập nhật thuần và factory typed.
// TRADE-OFF: shallow snapshot bảo vệ array, không deep clone product/item.
// WHEN: giỏ hàng trước khi lưu hoặc tính tiền; chưa database, tiền tệ đa đơn vị hoặc tồn kho.
// Rule hôm nay: dòng đang nằm trong giỏ có quantity nguyên >= 1; set về 0 có nghĩa xóa dòng.
// CartItem.quantity vẫn là number: kiểu dữ liệu không tự biểu diễn được rule này.
//
// Docs chính thức:
// https://www.typescriptlang.org/docs/handbook/2/objects.html
// Ưu tiên readonly properties, Array và ReadonlyArray.
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
// https://www.typescriptlang.org/docs/handbook/2/functions.html
// Ôn function signatures và unknown; chưa cần generics/overloads.
// Video ôn theo phần liên quan:
// Lucas Paganini — Narrowing/type guard: https://www.youtube.com/watch?v=fJXszcq4MgU
// Mosh — TypeScript, functions/objects: https://www.youtube.com/watch?v=d56mG7DezGs
//
// Typecheck: npm --prefix Week3 run typecheck:day3
// Runtime bài 1: node Week3/Day3/check.mjs 1 (đổi 1–4); bỏ số để chạy cả ngày.
// Stub có chữ ký nên typecheck có thể đạt dù chưa làm; phải đạt cả runtime.
// Gợi ý 5 giờ: 50 phút docs/video; 45 phút bài 1; 55 phút bài 2;
// 55 phút bài 3; 65 phút bài 4; 30 phút kiểm tra và tự giải thích.

import type { CartItem, CartSummary } from '../Day1/exercises.ts';
import { summarizeCart } from '../Day1/exercises.ts';
import { isProduct } from '../Day2/exercises.ts';
export type { CartItem, CartSummary } from '../Day1/exercises.ts';

export interface Cart {
  getItems(): readonly CartItem[];
  getSummary(): CartSummary;
  setQuantity(productId: string, quantity: number): CartSummary;
}

// BÀI 1 — Guard cho object lồng nhau.
// true khi value là object khác null/array, có product thỏa isProduct và quantity nguyên >= 1.
// Thiếu/sai field, NaN/Infinity, quantity 0/âm/thập phân -> false, không throw.
// Cho phép trường phụ, chỉ đọc dữ liệu. Dùng isProduct, không chép lại guard Product.
export function isCartItem(value: unknown): value is CartItem {
  throw new Error('TODO: isCartItem');
}

// BÀI 2 — Parse toàn bộ array và kiểm tra rule ID duy nhất.
// Không phải array -> Error('Cart must be an array'). Array rỗng hợp lệ.
// Duyệt từ trái sang phải; mỗi phần tử phải qua isCartItem, sai ->
// Error(`Invalid cart item at index ${index}`). Sau guard, nếu product.id đã gặp trước đó
// -> Error(`Duplicate product id: ${id}`). So ID chính xác, không trim hoặc gộp dòng trùng.
// Thành công trả array MỚI, giữ item/product reference. Không sửa array hay object đầu vào.
// Không bỏ qua dòng lỗi rồi trả giỏ một phần. Dừng ở lỗi đầu tiên theo thứ tự duyệt.
export function parseCartItems(value: unknown): readonly CartItem[] {
  throw new Error('TODO: parseCartItems');
}

// BÀI 3 — Cập nhật thuần, tạo state mới.
// items đã hợp lệ và có ID duy nhất. Validate quantity TRƯỚC khi tìm product:
// sai số nguyên >= 0 -> RangeError('quantity must be a non-negative integer').
// productId không có trong items -> Error('Product not found'), kể cả quantity=0.
// quantity=0 -> xóa dòng; >0 -> thay dòng đó bằng CartItem MỚI, giữ product reference.
// Các dòng không đổi giữ reference; luôn trả array mới, kể cả quantity bằng giá trị cũ.
// Không sửa input/đổi giá; không tự thêm sản phẩm lạ.
export function setCartQuantity(
  items: readonly CartItem[],
  productId: string,
  quantity: number,
): CartItem[] {
  throw new Error('TODO: setCartQuantity');
}

// BÀI 4 — Factory giỏ hàng dùng các helper đã viết.
// Ban đầu gọi parseCartItems(initial): dữ liệu sai phải throw đúng lỗi đó, không fallback [].
// Closure giữ array riêng; getItems() trả shallow snapshot array mới mỗi lần.
// getSummary() dùng summarizeCart, trả summary mới đúng state hiện tại.
// setQuantity() dùng setCartQuantity; thành công cập nhật state rồi trả summary mới.
// Nếu cập nhật lỗi thì GIỮ state cũ và throw nguyên lỗi; không sửa state trước validation.
// getItems không deep clone item/product; readonly là compile-time, không phải đóng băng runtime.
// Hai instance độc lập; method tách ra vẫn hoạt động, không dùng this/global state.
// Không thêm phương thức add/remove/replace hoặc gọi UI hôm nay.
export function createCart(initial: unknown): Cart {
  throw new Error('TODO: createCart');
}
