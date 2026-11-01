# Tuần 1 — Ngày 2: Scope, Hoisting và TDZ

Ngày kiểm tra: **01/11/2026**. Đây là thứ tự bài học, không phải xác nhận ngày học đúng theo lịch dự kiến của roadmap. Thời gian học thực tế chưa được cung cấp.

**Kết quả:** bốn bài bắt buộc đạt **12/12 tình huống kiểm tra**. Code được đọc để đối chiếu thêm điều kiện về scope và cách khai báo; không chỉ dựa vào kết quả chạy. Bonus `summarizeCart` còn TODO và không nằm trong điểm bắt buộc. Bản tổng kết do trợ lý viết dựa trên bài làm hiện tại, không thay thế việc tự giải thích kiến thức.

## 1. Kiến thức đã áp dụng

| Chủ đề | Áp dụng trong bài |
| --- | --- |
| Function scope và block scope | Biến total đặt trong function, ở ngoài vòng lặp; dùng được sau vòng lặp và không bị khởi tạo lại cho từng phần tử |
| Shadowing | Bỏ khai báo price mới trong block if, tránh che parameter price |
| Temporal Dead Zone | Không đọc let/const trước khi binding được khởi tạo; tax được tính trước total |
| Function declaration | buildLabel được gọi trước phần khai báo helper trong cùng function |
| State giữa các lần gọi | total là biến local nên lần gọi mới bắt đầu lại từ 0 |

**WHY:** lỗi scope và thời điểm khởi tạo có thể làm code trả sai kết quả hoặc ném ReferenceError.

**HOW:** xác định binding mà mỗi tên biến trỏ đến, scope chứa binding và thời điểm code khởi tạo binding đó.

**TRADE-OFF:** function declaration cho phép gọi trước dòng khai báo; function expression gán vào const cần được khởi tạo trước khi gọi. Chọn cách viết dễ theo dõi thay vì phụ thuộc hoisting ngoài ý muốn.

**WHEN:** áp dụng khi viết hàm tính tiền, helper và các nhánh điều kiện có biến local. Hoisting là cách mô tả hành vi, không phải thao tác di chuyển vật lý các dòng code.

## 2. Review từng hàm

### Bài 1 — calculateOrderTotal

- Đã đặt `let total = 0` trước vòng lặp, trong scope của function.
- Mỗi vòng lặp chỉ cộng price; không reset total về 0.
- Return sau vòng lặp; array rỗng trả 0 tự nhiên.
- Dùng let/const, không dùng biến global.
- Kiểm tra: tổng nhiều phần tử, input rỗng và các lần gọi độc lập — **3/3 đạt**.

### Bài 2 — getPriceSummary

- Giữ price làm giá gốc, cập nhật finalPrice khi có giảm giá.
- Bỏ khai báo const price trong block if vốn gây shadowing và TDZ khi đọc chính price ở initializer.
- Trả đủ originalPrice và finalPrice; không thêm global state.
- Kiểm tra: giảm 10%, không giảm và giảm 100% — **3/3 đạt**.

### Bài 3 — formatProductLabel

- Giữ lời gọi buildLabel ở trước phần định nghĩa helper như đề yêu cầu.
- Chuyển helper thành function declaration trong cùng function.
- Trim, viết hoa và thêm prefix từ input; không hardcode nhãn kết quả.
- Kiểm tra: khoảng trắng, tên nhiều từ và tên đã viết hoa — **3/3 đạt**.

### Bài 4 — calculateInvoice

- Khởi tạo tax trước khi tính total, giữ cả hai là const.
- taxRate là tỷ lệ thập phân; ví dụ 0.1 tương ứng 10%.
- Không dùng var hoặc try/catch để né lỗi TDZ.
- Kiểm tra: có thuế, thuế 0 và subtotal 0 — **3/3 đạt**.

## 3. Lỗi của đề đã được sửa

| Lỗi ban đầu | Cách sửa trong bài làm |
| --- | --- |
| total khai báo trong block vòng lặp nhưng return bên ngoài | Đưa biến cộng dồn ra scope function, trước vòng lặp |
| const price che parameter price và đọc trước khởi tạo | Dùng parameter price để tính rồi gán finalPrice |
| Gọi helper const trước initializer | Dùng function declaration, giữ thứ tự gọi theo yêu cầu |
| Đọc tax trước const tax | Tính tax trước, sau đó tính total |

Không cần thêm validation cho các input nằm ngoài contract của ngày này: đề giả định input hợp lệ để tập trung scope/hoisting. Khi làm API thực tế, runtime validation vẫn là việc riêng cần thiết.

## 4. Bằng chứng và cách chạy lại

```powershell
node Week1/Day2/check.mjs
node --check Week1/Day2/exercises.mjs
node --check Week1/Day2/check.mjs
```

- Bài bắt buộc: **12/12 tình huống đạt**.
- Cú pháp hai file JavaScript: **đạt**.
- Review điều kiện trong code: **đạt trong phạm vi bốn bài**.
- Bonus: **chưa thực hiện**, chạy `node Week1/Day2/check.mjs bonus` hiện chưa đạt.
- Chưa có bằng chứng về việc đã xem hết video, số giờ học hoặc khả năng tự giải thích không nhìn code; không ghi các mục này là đã hoàn thành.

## 5. Nguồn học của Ngày 2

- [MDN — Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope).
- [MDN — Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting).
- [MDN — let / TDZ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz).
- [MDN — Function declaration / Hoisting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function#hoisting).
- [F8 — Scope trong JavaScript](https://www.youtube.com/watch?v=5N8vz_VmszE).
- [F8 — Hoisting trong JavaScript](https://www.youtube.com/watch?v=3MLhU1DrUxM).

## 6. Ôn nhanh và bước tiếp theo

Không cần nộp trả lời vào Markdown. Có thể tự giải thích bằng lời khi ôn:

1. Vì sao total phải khai báo trước vòng lặp?
2. Vì sao `const price = price - ...` trong block if không đọc parameter price bên ngoài?
3. Vì sao helper function declaration được gọi trước khai báo, còn helper const thì không?
4. Vì sao chuyển tax lên trước total sửa được lỗi?

Ngày 3 chuyển sang **execution context, call stack, return và recursion**. Học qua docs/video trong chat rồi sửa trực tiếp các hàm; Markdown của Ngày 3 được tổng hợp khi người học yêu cầu review cuối ngày.
