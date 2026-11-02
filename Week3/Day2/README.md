# Tuần 3 — Ngày 2 (Ngày 16): Union, unknown và narrowing

Ngày review: **02/11/2026**. Tổng kết từ code và kết quả kiểm tra; chưa xác nhận thời gian học, việc xem video hoặc khả năng giải thích không nhìn code.

**Bản nộp đạt strict typecheck và 12/12 runtime.** Trợ lý xóa ba throw TODO không chạy tới và đổi message fallback cuối normalizeProductId từ TODO sang Invalid product id. Các input trong hợp đồng giữ nguyên hành vi; không viết lại thuật toán. Sau dọn vẫn đạt các kiểm tra.

## Review từng bài

| Bài | Kết quả | Nhận xét |
| --- | --- | --- |
| normalizeProductId | 3/3 | typeof phân biệt string/number; giữ số 0 và chuỗi 001; trim chuỗi và từ chối chuỗi trắng |
| isProduct | 3/3 | Kiểm tra object khác null/array; in và typeof bảo vệ từng field; giá nguyên không âm, chấp nhận 0 và trường phụ |
| parseProduct | 3/3 | Tái sử dụng guard, trả chính object hợp lệ; lỗi rõ ràng khi sai, không clone/ép kiểu |
| getProductStateMessage | 3/3 | switch theo status, đọc data/error đúng nhánh; default assertNever giúp kiểm tra exhaustive |

Đã đọc code ngoài chạy test. Không có any, as, non-null assertion hoặc directive né kiểm tra trong bài làm.

## Kiến thức đã áp dụng

- Union giới hạn các loại input nhưng phải narrowing trước khi dùng thao tác riêng của từng loại.
- unknown chấp nhận dữ liệu đầu vào bất kỳ, đồng thời chặn truy cập field trước kiểm tra.
- typeof null là object và array cũng là object, nên guard kiểm tra null và Array.isArray riêng.
- Kiểm tra sự có mặt của field chưa đủ: còn cần kiểm tra kiểu và điều kiện giá trị.
- Number.isInteger loại NaN/Infinity/số thập phân; kiểm tra >= 0 vẫn cho phép giá 0.
- Type predicate `value is Product` hỗ trợ compiler narrowing; logic đúng vẫn phải được kiểm tra bằng runtime test.
- Parse là ranh giới validation, không phải ép kiểu. Guard hôm nay không tự trim dữ liệu hợp lệ.
- Discriminated union dùng literal status để gắn data/error với đúng nhánh; never phát hiện nhánh còn thiếu.

**WHY:** interface không xác minh dữ liệu runtime đến từ JSON hoặc dịch vụ bên ngoài.

**HOW:** unknown ở ranh giới, guard theo từng field, parse để từ chối dữ liệu sai và union để mô tả trạng thái.

**TRADE-OFF:** compiler tin predicate; một guard trả true sai có thể làm code đã typecheck vẫn lỗi. Bài này chỉ hỗ trợ dữ liệu thường, không cam kết xử lý Proxy/getter gây lỗi.

**WHEN:** nhận Product chưa tin cậy và xử lý các trạng thái tải. Business rule như giá nguyên không âm được kiểm tra lúc chạy, không được bảo đảm chỉ bởi kiểu number.

## Kiểm chứng

```powershell
npm --prefix Week3 run typecheck:day2
node Week3/Day2/check.mjs
```

- Compiler strict + ca hợp đồng kiểu: **đạt trước và sau dọn code**.
- Runtime: **12/12 trước và sau dọn code**.
- Bao gồm primitive/null/function/array giả dạng Product, thiếu/sai field, giá không hợp lệ, object freeze, giữ identity, mọi status và Error message rỗng.
- Không gọi mạng; không dùng ép kiểu để bỏ qua unknown.

## Nguồn học và tự ôn

- [TypeScript — Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types).
- [TypeScript — unknown](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown).
- [TypeScript — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
- [Lucas Paganini — TypeScript Narrowing](https://www.youtube.com/watch?v=fJXszcq4MgU).
- [Web Dev Simplified — Discriminating Union](https://www.youtube.com/watch?v=xsfdypZCLQ8).

Tự giải thích trong code hoặc nói lại: unknown khác any ở đâu; vì sao in chưa đủ để kết luận Product; guard khác normalize thế nào; thêm status mà quên case thì assertNever báo lỗi ra sao.

Ngày 17 — Tuần 3, Ngày 3 — kiểm tra dữ liệu giỏ hàng lồng nhau, readonly, cập nhật bất biến và closure typed. Ngày 12 vẫn giữ trạng thái chưa hoàn thành theo hồ sơ trước đó.
