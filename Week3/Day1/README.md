# Tuần 3 — Ngày 1 (Ngày 15): TypeScript cơ bản và strict

Ngày review: **02/11/2026**. Ghi nhận từ code và kiểm tra thực tế; chưa xác nhận số giờ học, video đã xem hoặc khả năng tự giải thích không nhìn code.

**Bản nộp đạt strict typecheck và 12/12 runtime.** Đã kiểm tra cả các ca hợp đồng kiểu trong contracts.ts, không chỉ chạy Node. Trợ lý dọn bốn throw TODO không chạy tới; giữ nguyên chữ ký và logic người học. Sau dọn các kiểm tra vẫn đạt.

## Review từng bài

| Bài | Kết quả | Nhận xét |
| --- | --- | --- |
| calculateLineTotal | 3/3 | Tham số/return number đúng, phép nhân giữ giá trị 0 |
| applyDiscount | 3/3 | Nhận/trả Product, tạo object mới, giữ id/name và làm tròn giá sau giảm |
| getDisplayName | 3/3 | Guard thuộc tính optional trước trim; thiếu/rỗng thì fallback username nguyên bản |
| summarizeCart | 3/3 | readonly CartItem[], CartSummary; tái sử dụng hàm tính tiền, giữ ID lặp và không sửa input |

## Kiến thức đã áp dụng

- Annotation ở tham số/return xác định hợp đồng; TypeScript suy luận các biến bên trong từ biểu thức.
- Dùng number thay Number; interface mô tả shape object và readonly đánh dấu ý định bất biến ở compile-time.
- displayName có thể undefined dưới strictNullChecks, nên cần thu hẹp trước khi dùng như string.
- readonly array không cho push trong code đã typecheck, nhưng không tự Object.freeze lúc chạy.
- Interface và annotation không tự kiểm tra JSON hoặc ép dữ liệu runtime thành đúng kiểu.
- Node chạy .ts bằng type stripping không thay thế việc chạy compiler; phải đạt cả hai lớp kiểm tra.

**WHY:** bắt input sai kiểu khi phát triển, đồng thời giữ logic tính tiền và dữ liệu bất biến đúng khi chạy.

**HOW:** chữ ký hàm rõ, interface nhỏ, xử lý optional có nhánh kiểm tra, ghép lại hàm đã typed.

**TRADE-OFF:** typecheck không bảo đảm dữ liệu bên ngoài hợp lệ hoặc các số đều không âm; runtime validation là trách nhiệm riêng.

**WHEN:** mô hình Product/Cart nội bộ và hợp đồng hàm. Dữ liệu không tin cậy sẽ được nhận dạng unknown và kiểm tra ở Ngày 16.

## Góp ý rút gọn

- getDisplayName trim cùng chuỗi hai lần; có thể lưu kết quả trim một lần để dùng tiếp.
- summarizeCart dùng hai lần reduce; vẫn đúng và không sửa input. Một vòng duyệt có thể gom cả hai tổng, nhưng chưa cần tối ưu cho bài nhỏ.
- Đây là góp ý, review không thay đổi cách giải đang đúng.

## Kiểm chứng

```powershell
npm --prefix Week3 run typecheck:day1
node Week3/Day1/check.mjs
```

- Compiler strict + ca hợp đồng kiểu: **đạt trước và sau dọn code**.
- Runtime: **12/12 trước và sau dọn code**, bao gồm falsy, làm tròn cent, optional property, input freeze và ID lặp.
- Các @ts-expect-error trong contracts.ts được dùng cho input cố ý sai; chúng không nằm trong bài làm để né lỗi.
- Không có any, ép kiểu as, non-null assertion hoặc directive bỏ qua lỗi trong code giải bài.

## Nguồn học và tự ôn

- [TypeScript — The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html).
- [TypeScript — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).
- [TypeScript — ReadonlyArray](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonlyarray).
- [Node.js — Type stripping](https://nodejs.org/api/typescript.html#type-stripping).
- [Mosh — TypeScript Tutorial for Beginners](https://www.youtube.com/watch?v=d56mG7DezGs).

Tự giải thích trong code hoặc nói lại: vì sao Node chạy được nhưng compiler có thể báo lỗi; readonly khác Object.freeze thế nào; optional property cần kiểm tra gì; interface có tự xác minh JSON không.

Ngày 16 — Tuần 3, Ngày 2 — union/literal types, unknown, narrowing, type predicate và discriminated union. Ngày 12 vẫn giữ trạng thái chưa hoàn thành theo hồ sơ trước đó.
