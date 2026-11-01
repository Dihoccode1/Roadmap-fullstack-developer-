# Tuần 1 — Ngày 3: Execution Context, Call Stack và Recursion

Ngày review: **01/11/2026**. Thời gian học thực tế và việc dùng debugger chưa được người học cung cấp. Tài liệu này do trợ lý tổng hợp từ code và kết quả kiểm tra.

**Kết luận:** **12/12 tình huống kiểm tra kết quả đạt**; **3/4 bài đáp ứng đầy đủ yêu cầu về cách giải**. Bài 4 dùng công thức tổng thay vì vòng lặp, nên còn một yêu cầu cần sửa. Không coi việc tất cả assertion pass là đã hoàn thành yêu cầu vòng lặp.

## 1. Kiến thức đã áp dụng trong code

| Chủ đề | Bằng chứng |
| --- | --- |
| Return và caller/callee | calculateSubtotal trả subtotal để calculateCheckout tiếp tục tính phí giao hàng |
| Thứ tự lời gọi đồng bộ | Giữ calculateCheckout → calculateSubtotal → multiply, rồi mới addShipping; events đúng thứ tự |
| Base case và recursive step | sumTo dừng ở n = 0, gọi tiếp với n - 1 |
| Biến local riêng cho mỗi lần gọi | countCategoryProducts có total riêng ở từng node và cộng kết quả của các child |
| Không sửa dữ liệu cây đầu vào | Kiểm tra snapshot trước/sau duyệt cây đạt |

**WHY:** cần biết hàm nào đang chạy, caller đang đợi kết quả nào và đệ quy có tiến tới điều kiện dừng hay không.

**HOW:** lần theo lời gọi/return; quan sát tham số, biến local và thứ tự events. Khi hàm con kết thúc bình thường, caller tiếp tục ở vị trí sau lời gọi.

**TRADE-OFF:** đệ quy diễn đạt việc duyệt cây tự nhiên nhưng dùng thêm stack theo độ sâu. Vòng lặp tính tổng dãy có thể dùng bộ nhớ phụ hằng số; công thức tổng cũng đúng với bài toán số học, nhưng không luyện mục tiêu vòng lặp của bài 4.

**WHEN:** dùng cho xử lý cây danh mục, helper nhiều tầng và debug lỗi thiếu return hoặc tràn stack. Các bài hôm nay là code đồng bộ, chưa phân tích Promise/event loop.

## 2. Review từng bài

### Bài 1 — calculateCheckout và các helper

- Đã thêm return subtotal trong calculateSubtotal.
- Giữ nguyên chuỗi hàm con; không bỏ qua helper để tính trực tiếp ở function ngoài.
- Events ghi đúng thứ tự vào/ra và caller tiếp tục sau hàm con.
- Kết quả: **3/3 tình huống đạt**, yêu cầu cách giải đạt.

### Bài 2 — sumTo

- Base case n = 0 trả 0.
- Recursive step dùng n - 1 thay vì gọi lại với chính n.
- Cộng n với kết quả hàm con khi lời gọi quay về.
- Kết quả: **3/3 tình huống đạt**, vẫn dùng đệ quy theo đề.
- Với input hợp lệ 0–100 của bài: thời gian O(n), stack phụ O(n). Không suy ra rằng recursion phù hợp mọi input lớn.

### Bài 3 — countCategoryProducts

- Khởi tạo total từ productCount của node hiện tại.
- Duyệt children và cộng kết quả gọi đệ quy.
- Node lá không có child nên trả productCount của chính node đó.
- Không dùng biến global và không sửa cây đầu vào.
- Kết quả: **3/3 tình huống đạt**, yêu cầu cách giải đạt.
- Với cây V node và độ sâu h: thời gian O(V), stack phụ O(h).

### Bài 4 — sumToIterative: cần sửa cách giải

Lời giải người học hiện tại tính bằng công thức:

```js
return (total = (n * (n + 1)) / 2);
```

- Kết quả đúng cho miền input được giao, **3/3 tình huống kiểm tra kết quả đạt**.
- Công thức có thời gian và bộ nhớ phụ O(1) trong mô hình số học của bài; đây là lựa chọn hợp lý nếu chỉ cần tính tổng.
- Đề hôm nay yêu cầu **for/while**, không dùng công thức, để so sánh vòng lặp với recursive frames. Vì vậy bài chưa đạt yêu cầu cách giải.
- Cần làm: giữ biến total local bắt đầu từ 0; lặp qua các giá trị cần cộng; return sau vòng lặp. Input 0 cần tự nhiên cho tổng 0.
- Trợ lý giữ lời giải hiện tại, thêm ghi chú review để người học tự sửa. Không viết thay vòng lặp và không đánh dấu bài này đã hoàn thành.

## 3. Bằng chứng kiểm tra

```powershell
node Week1/Day3/check.mjs
node --check Week1/Day3/exercises.mjs
node --check Week1/Day3/check.mjs
```

| Tiêu chí | Kết quả |
| --- | --- |
| Hành vi qua assertion | 12/12 đạt |
| Bài 1–3: yêu cầu thuật toán/cấu trúc | Đạt qua đọc code |
| Bài 4: thực sự dùng vòng lặp | Chưa đạt |
| Cú pháp JavaScript | Đạt |
| Tự giải thích frame bằng debugger | Chưa có bằng chứng được cung cấp |

Đã dọn throw TODO không thể chạy tới sau return ở bài 3–4 và comment TODO đã hoàn thành ở helper. Giữ nguyên kết quả và thuật toán của người học.

## 4. Nguồn học

- [MDN — Stack and execution contexts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#stack_and_execution_contexts).
- [MDN — Call stack](https://developer.mozilla.org/en-US/docs/Glossary/Call_stack).
- [MDN — Functions / Recursion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#recursion).
- [MDN — Too much recursion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Too_much_recursion).
- [Lydia Hallie — Execution Contexts](https://www.youtube.com/watch?v=zdGfo6I1yrA).
- [Colt Steele — Call Stack](https://www.youtube.com/watch?v=W8AeMrVtFLY).
- [Kteam — Đệ quy trong JavaScript](https://www.youtube.com/watch?v=6yxtJRzx7Qs).

## 5. Ôn và chuyển Ngày 4

- [x] Hoàn thành và kiểm chứng bài 1–3.
- [x] Ghi rõ khác biệt giữa test pass và đáp ứng đầy đủ yêu cầu.
- [ ] Đổi sumToIterative sang vòng lặp; chạy lại nhóm 4.
- [ ] Tự quan sát breakpoint trong multiply và sumTo(3), giải thích giá trị local của từng frame.

Ngày 4 học **lexical scope, lexical environment, scope chain và factory function**. Có thể bắt đầu bài mới, đồng thời sửa nốt vòng lặp của Ngày 3 trước khi chốt toàn bộ ngày. Bài Ngày 4 làm trực tiếp trong file JavaScript; Markdown được tổng hợp cuối buổi theo yêu cầu của người học.
