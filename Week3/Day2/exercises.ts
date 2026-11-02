// TUẦN 3 — NGÀY 2 (NGÀY 16): UNION, UNKNOWN VÀ NARROWING.
// Chủ đề -> docs/video -> code trong hàm .ts. Chữ ký và model được cung cấp sẵn hôm nay.
// Không any, as, non-null assertion (!), @ts-ignore/@ts-expect-error trong bài làm.
// Không đổi kiểu đầu vào/return để né kiểm tra; không sửa contracts.ts/tsconfig.
// Không package mới, generic hoặc framework; không gọi mạng thật.
//
// WHY: dữ liệu runtime có thể sai dù interface đúng; unknown buộc kiểm tra trước khi dùng.
// HOW: typeof, !== null, Array.isArray, in, type predicate và switch theo literal status.
// TRADE-OFF: compiler tin type predicate do bạn viết; guard sai vẫn có thể làm runtime lỗi.
// WHEN: đọc JSON/response chưa tin cậy và xử lý các trạng thái tải có dữ liệu khác nhau.
//
// Docs chính thức — đọc theo thứ tự:
// https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types
// https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown
// https://www.typescriptlang.org/docs/handbook/2/narrowing.html
// Mục typeof, truthiness, in operator, type predicates, discriminated unions, never.
// Video YouTube:
// Lucas Paganini — Learn TypeScript Narrowing (chọn typeof/in và type guard trước):
// https://www.youtube.com/watch?v=fJXszcq4MgU
// Web Dev Simplified — Discriminating Union:
// https://www.youtube.com/watch?v=xsfdypZCLQ8
//
// Typecheck: npm --prefix Week3 run typecheck:day2
// Runtime bài 1: node Week3/Day2/check.mjs 1 (đổi 1–4); bỏ số để chạy cả ngày.
// Stub đã có chữ ký nên typecheck ban đầu có thể đạt, nhưng runtime vẫn FAIL vì TODO.
// Chạy cả hai lớp; type predicate đúng chữ ký không chứng minh logic guard đúng.
// Gợi ý 5 giờ: 70 phút docs/video; 35 phút bài 1; 65 phút bài 2;
// 35 phút bài 3; 65 phút bài 4; 30 phút typecheck, runtime và tự giải thích.
// Review: bản nộp đạt strict và 12/12 runtime; dọn TODO còn sót, giữ cách giải.

import type { Product } from "../Day1/exercises.ts";
export type { Product } from "../Day1/exercises.ts";

export type ProductState =
  | { readonly status: "idle" }
  | { readonly status: "loading" }
  | { readonly status: "success"; readonly data: Product }
  | { readonly status: "error"; readonly error: Error };

// Helper hoàn chỉnh dùng cho kiểm tra exhaustive ở bài 4, không cần sửa.
function assertNever(value: never): never {
  throw new Error("Unexpected state");
}

// BÀI 1 — Union tham số và narrowing bằng typeof.
// Input là string hoặc số nguyên không âm hợp lệ, gồm 0.
// Số -> String(id). String -> trim; nếu kết quả rỗng thì throw Error('Invalid product id').
// Giữ chuỗi '001' là '001', không ép chuỗi sang số. Không sửa input.
// Ví dụ 0 -> '0'; ' p1 ' -> 'p1'; '   ' -> lỗi.
export function normalizeProductId(id: string | number): string {
  if (typeof id === "number") {
    return String(id);
  }
  if (typeof id === "string") {
    const trimmedId = id.trim();
    if (trimmedId.length === 0) {
      throw new Error("Invalid product id");
    }
    return trimmedId;
  }
  throw new Error("Invalid product id");
}

// BÀI 2 — Runtime type guard cho unknown.
// true khi value là object khác null, không phải array, có:
// id/name: string với trim().length > 0; priceInCents: number nguyên >= 0.
// Giá 0 hợp lệ; NaN/Infinity/số thập phân/giá âm không hợp lệ.
// Cho phép thêm trường khác; guard chỉ đọc, KHÔNG trim/sửa giá trị đầu vào.
// Các input là dữ liệu thông thường (không Proxy/getter gây lỗi); không yêu cầu own property.
// Với primitive, null, function, array hoặc thiếu/sai trường: trả false, không throw.
// Thu hẹp object rồi dùng in/typeof để đọc an toàn; không dùng ép kiểu as Product.
export function isProduct(value: unknown): value is Product {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const hasId =
      "id" in value &&
      typeof value.id === "string" &&
      value.id.trim().length > 0;
    const hasName =
      "name" in value &&
      typeof value.name === "string" &&
      value.name.trim().length > 0;
    const hasPriceInCents =
      "priceInCents" in value &&
      typeof value.priceInCents === "number" &&
      Number.isInteger(value.priceInCents) &&
      value.priceInCents >= 0;
    return hasId && hasName && hasPriceInCents;
  }
  return false;
}

// BÀI 3 — Đưa validation vào ranh giới nhận dữ liệu.
// Tái sử dụng isProduct. Hợp lệ -> trả chính object đó, không clone/normalize.
// Không hợp lệ -> throw new Error('Invalid product'). Không return null/undefined.
// Input unknown vẫn có thể truyền bất kỳ thứ gì; compiler không thay runtime validation.
export function parseProduct(value: unknown): Product {
  if (isProduct(value)) {
    return value;
  }
  throw new Error("Invalid product");
}

// BÀI 4 — Discriminated union và exhaustive checking.
// Dùng switch(state.status), trả chính xác:
// idle -> 'Chưa tải'; loading -> 'Đang tải';
// success -> `Sản phẩm: ${state.data.name}`; error -> `Lỗi: ${state.error.message}`.
// Chỉ nhánh success có data, chỉ nhánh error có error; không ép kiểu/optional chaining để né.
// Nhánh default dùng return assertNever(state), để compiler báo lỗi nếu thêm variant mà quên case.
// Không đổi ProductState thành một object có mọi field optional. Không sửa state/Product/Error.
export function getProductStateMessage(state: ProductState): string {
  switch (state.status) {
    case "idle":
      return "Chưa tải";

    case "loading":
      return "Đang tải";

    case "success":
      return `Sản phẩm: ${state.data.name}`;

    case "error":
      return `Lỗi: ${state.error.message}`;

    default:
      return assertNever(state);
  }

}
