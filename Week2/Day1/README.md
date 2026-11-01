# Tuần 2 — Ngày 1 (Ngày 8): Promise và Async JavaScript cơ bản

Ngày review: **01/11/2026**. Đây là thứ tự bài học, không phải xác nhận số ngày hoặc số giờ đã học. Tổng kết do trợ lý viết dựa trên code hiện tại và kết quả chạy; chưa xác nhận thời gian học, việc xem hết nguồn học hoặc tự giải thích không nhìn code.

**Kết quả:** bốn bài đạt **12/12 tình huống kiểm tra**. Review code xác nhận dùng setTimeout để resolve, return Promise chain, await trước khi đọc product và finally để ghi kết thúc.

## 1. Review từng bài

| Bài | Kết quả | Bằng chứng |
| --- | --- | --- |
| delay | 3/3 đạt | Return Promise; resolve trong callback setTimeout; giữ giá trị falsy và identity object; ms=0 vẫn dùng timer |
| getProductName | 3/3 đạt | Return chain then và return product.name trong callback; rejection tiếp tục truyền ra với cùng Error |
| getOrderPreview | 3/3 đạt | Await dependency trước khi đọc thuộc tính/tính tiền; gọi một lần, không mutate product, không bọc Promise dư thừa |
| getProductNameSafe | 3/3 đạt | Await trong try; trả kết quả success/error; finally ghi end sau cả hai nhánh return; bắt được reject và lỗi đồng bộ |

## 2. Kiến thức đã áp dụng

- Promise đại diện kết quả sẽ có ở tương lai; cần resolve/reject hoặc tiêu thụ nó bằng then/await.
- Return bên trong callback then quyết định giá trị của Promise tiếp theo; function ngoài cũng cần return chain để caller theo dõi được.
- Async function trả Promise; await lấy giá trị fulfilled hoặc ném rejection vào luồng try/catch của function hiện tại.
- Finally chạy sau try/catch ngay cả khi các nhánh đang return. Không return trong finally để tránh ghi đè kết quả/lỗi trước đó.
- Timer và await không phải cơ chế tự chuyển tính toán CPU sang thread khác.

**WHY:** caller cần nhận đúng dữ liệu sau khi dependency hoàn tất và biết khi nào tác vụ thất bại.

**HOW:** return/await Promise tại mỗi ranh giới; phân biệt giá trị fulfilled với bản thân Promise; đặt cách xử lý lỗi ở nơi phù hợp với contract.

**TRADE-OFF:** getProductName/getOrderPreview giữ rejection cho caller quyết định, còn getProductNameSafe chuyển lỗi thành giá trị { ok: false, error }. Caller của bản safe phải kiểm tra ok thay vì mặc định mọi Promise fulfilled đều là thành công nghiệp vụ.

**WHEN:** dùng khi đọc dữ liệu từ API, file hoặc các dependency bất đồng bộ. Bài hôm nay dùng dependency giả lập, không chứng minh đã tích hợp HTTP thật.

## 3. Dọn code và kiểm chứng

- Bỏ bốn throw TODO nằm sau return hoặc sau try/catch/finally có return ở cả hai nhánh; chúng không thể chạy tới trong code hiện tại.
- Giữ nguyên logic và cách đặt biến của người học.

```powershell
node Week2/Day1/check.mjs
node --check Week2/Day1/exercises.mjs
node --check Week2/Day1/check.mjs
```

- Assertion: **12/12 đạt**.
- Cú pháp: **đạt**.
- Cách viết theo yêu cầu timer/then/await/finally: **đạt qua review**.
- Chưa đo khả năng tự giải thích hoặc năng lực xử lý tác vụ bất đồng bộ phức tạp.

## 4. Nguồn học

- [MDN — Introducing asynchronous JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Introducing).
- [MDN — Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
- [MDN — How to use promises](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Promises).
- [F8 — Promise sync/async](https://www.youtube.com/watch?v=QJmNEqy0zV0).
- [F8 — Promise chain](https://www.youtube.com/watch?v=Ldl571DAlXI).
- [Web Dev Simplified — Async/Await](https://www.youtube.com/watch?v=V_Kr9OSfDeU).

## 5. Ôn nhanh và bài tiếp theo

Tự nói hoặc kiểm chứng trong code, không cần điền Markdown:

1. Vì sao return value trong callback setTimeout không thay thế resolve(value)?
2. Nếu quên return chain then từ getProductName, caller sẽ nhận gì?
3. Vì sao await trong try giúp bắt rejection, trong khi chỉ tạo Promise mà không await có thể không đi vào catch đó?
4. getProductNameSafe fulfill có luôn có nghĩa tác vụ thành công không?

Ngày 9 — Tuần 2, Ngày 2 — học Promise chain nhiều bước, tuần tự, đồng thời, Promise.all và Promise.allSettled. Ngày 7 đã được ghi bỏ qua theo yêu cầu; không đánh dấu mini project tích hợp của ngày đó đã hoàn thành.
