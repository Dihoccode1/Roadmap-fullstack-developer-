# Tuần 2 — Ngày 4 (Ngày 11): Xử lý lỗi async, Fetch và Loading State

Ngày review: **01/11/2026**. Tổng kết dựa trên code và kiểm tra thực tế; chưa xác nhận số giờ học, video đã xem hoặc khả năng giải thích không nhìn code.

**Bản nộp đạt 12/12 kiểm tra ngay trước khi dọn code.** Trợ lý chỉ xóa năm dòng `throw TODO` không chạy tới và comment TODO cũ, giữ nguyên logic người học. Chạy lại sau dọn vẫn đạt 12/12.

## 1. Review từng bài

| Bài | Kết quả | Nhận xét |
| --- | --- | --- |
| runWithLoading | 3/3 | Bật loading trước task, `return await task()` để finally chờ settle; tắt loading cả lỗi đồng bộ và rejection, giữ falsy/Error |
| fetchJson | 3/3 | Kiểm tra response.ok, tạo lỗi HTTP theo status, không đọc body khi HTTP lỗi; chờ json và giữ lỗi mạng/parse |
| getProductOrFallback | 3/3 | Chỉ fallback theo code PRODUCT_NOT_FOUND, không theo message; lỗi khác và lỗi fallback được truyền ra |
| createProductLoader | 3/3 | Closure giữ state riêng, snapshot mới, chuyển idle/loading/success/error đúng; reset dữ liệu/lỗi khi load tiếp |

Đã đọc code để xác nhận cách giải ngoài kết quả tự động. `catch (error) { throw error; }` trong bài 1 còn dư vì không bổ sung xử lý, nhưng không làm sai hành vi; có thể tự rút gọn thành try/finally.

## 2. Kiến thức đã áp dụng

- `await` bên trong try giúp rejection được catch tại đó và finally chạy sau tác vụ đang chờ.
- Trong bài 1, thay `return await task()` bằng `return task()` làm finally chạy sớm khi task còn pending. Không áp dụng máy móc quy tắc bỏ mọi return await.
- Không return trong finally vì có thể ghi đè kết quả hoặc làm mất lỗi từ try/catch.
- Fetch fulfill với Response chưa bảo đảm HTTP thành công: phải kiểm tra ok/status. `json()` là bước bất đồng bộ riêng và có thể lỗi.
- Fallback theo lỗi dự kiến; không biến mọi sự cố thành dữ liệu giả hoặc undefined.
- Rethrow cùng Error giữ identity và thông tin lỗi cho caller.
- Snapshot `{ ...state }` bảo vệ các trường cấp ngoài. Product và Error vẫn chung tham chiếu; bài này không yêu cầu deep clone.
- State dùng const vẫn thay đổi thuộc tính được; hai loader có closure riêng nên không lẫn dữ liệu.

**WHY:** loading phải phản ánh đúng vòng đời tác vụ và caller cần biết lỗi thật để xử lý phù hợp.

**HOW:** await trong đúng try, cleanup ở finally, kiểm tra HTTP trước đọc JSON, phân nhánh lỗi bằng code và lưu state rõ ràng.

**TRADE-OFF:** fallback tăng khả năng tiếp tục với lỗi đã biết nhưng catch quá rộng che lỗi hệ thống. Shallow snapshot nhẹ nhưng không cách ly dữ liệu lồng nhau.

**WHEN:** tải dữ liệu cho giao diện, xử lý trường hợp không có sản phẩm, phục hồi sau lỗi. Loader hôm nay chỉ hỗ trợ các load nối tiếp; chưa bảo vệ trước request chồng nhau.

## 3. Kiểm chứng

```powershell
node Week2/Day4/check.mjs
node --check Week2/Day4/exercises.mjs
```

- **12/12 trước và sau dọn code**; cú pháp đạt.
- Bao gồm task pending, throw đồng bộ, rejection, falsy, HTTP 404/503, lỗi parse, fallback chọn lọc, snapshot, phục hồi state và instance độc lập.
- Dependency giả lập, không gọi API thật hay đo tốc độ mạng.
- Các check không chứng minh loader đã xử lý hai request cùng lúc; đó là nội dung Ngày 12.

## 4. Nguồn học

- [MDN — try/catch/finally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch).
- [MDN — await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).
- [MDN — Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
- [MDN — Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok).
- [Web Dev Simplified — Fetch API](https://www.youtube.com/watch?v=cuEtnrL9-H0).
- [Web Dev Simplified — Async/Await](https://www.youtube.com/watch?v=V_Kr9OSfDeU).

## 5. Tự ôn và bước tiếp theo

Không cần điền Markdown; tự giải thích hoặc sửa thử trong code:

1. Vì sao bài 1 cần await trước finally, trong khi có những hàm chỉ return Promise là đủ?
2. HTTP 404 khác lỗi mạng và lỗi JSON ở đâu?
3. Vì sao catch rồi return undefined có thể khiến caller tưởng tác vụ thành công?
4. Nếu request cũ hoàn thành sau request mới, state loader hiện tại sẽ ra sao?

Ngày 12 — Tuần 2, Ngày 5 — học timeout bằng Promise.race, truyền AbortSignal, dọn timer/listener và bảo vệ state khỏi kết quả request cũ.
