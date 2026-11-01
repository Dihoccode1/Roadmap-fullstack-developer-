# Tuần 2 — Ngày 2 (Ngày 9): Promise Chain, Tuần tự và Đồng thời

Ngày review: **01/11/2026**. Tổng kết do trợ lý viết từ code và kết quả chạy; chưa xác nhận thời gian học, việc xem hết nguồn học hoặc khả năng tự giải thích không nhìn code.

**Kết quả:** bốn bài đạt **12/12 tình huống kiểm tra**. Đã đọc code để xác nhận cách giải, không chỉ dựa trên giá trị cuối cùng.

## 1. Review từng bài

| Bài | Kết quả | Nhận xét |
| --- | --- | --- |
| getProductWithCategory | 3/3 đạt | Return Promise ngoài và chain category bên trong; lấy categoryId từ product; lỗi bước đầu ngăn bước sau |
| loadProductsSequential | 3/3 đạt | for...of và await trong mỗi vòng; chỉ bắt đầu ID sau khi ID trước thành công; lỗi dừng các ID còn lại |
| loadProductsConcurrent | 3/3 đạt | map khởi động request trước khi Promise.all; giữ thứ tự input và Error ban đầu; request khác không tự bị hủy |
| loadProductResults | 3/3 đạt | Promise.allSettled chờ đủ; map kết quả theo index của input; giữ cả fulfilled/value và rejected/reason |

## 2. Kiến thức đã áp dụng

- Tác vụ có phụ thuộc dữ liệu phải chờ kết quả trước; fetchCategory cần categoryId từ product.
- Return Promise bên trong then giúp chain ngoài chờ đúng kết quả thay vì trở thành một tác vụ bị bỏ theo dõi.
- for...of + await tạo thứ tự xử lý; Promise.all nhận các Promise từ những request đã được khởi động.
- Kết quả của all và allSettled giữ thứ tự input, không sắp theo thứ tự hoàn thành.
- Promise.all reject sớm khi có lỗi; điều này không phải hủy các request còn lại.
- Promise.allSettled biểu diễn thất bại của từng request thành dữ liệu; caller cần đọc status.
- Async function có thể return Promise.all trực tiếp; không bắt buộc return await khi chỉ truyền tiếp kết quả/lỗi như bài 3.

**WHY:** cần chọn đúng cách phối hợp để vừa có dữ liệu đúng, vừa tránh chờ tuần tự không cần thiết hoặc bỏ mất lỗi.

**HOW:** xác định dependency trước, rồi chọn chain/tuần tự cho dữ liệu phụ thuộc, all cho một tập kết quả cần thành công toàn bộ, allSettled để thu đủ kết quả từng phần.

**TRADE-OFF:** khởi động mọi request cùng lúc giảm thời gian chờ của tác vụ độc lập nhưng có thể tăng tải; bài hôm nay chưa giới hạn concurrency. Thu kết quả từng phần cần logic xử lý status ở caller.

**WHEN:** dùng cho tải product/category, danh sách tài nguyên và giao diện chấp nhận thành công một phần. Đây là concurrency của các tác vụ chờ; không phải tạo thêm thread để chạy JavaScript CPU-bound song song.

## 3. Kiểm chứng và dọn code

```powershell
node Week2/Day2/check.mjs
node --check Week2/Day2/exercises.mjs
node --check Week2/Day2/check.mjs
```

- **12/12 tình huống đạt**, gồm thứ tự khởi động/hoàn thành, input rỗng/lặp, lỗi ở từng bước, fail-fast và chờ đủ kết quả.
- Cú pháp JavaScript: **đạt**.
- Đã dọn hai throw TODO sau return ở loadProductsConcurrent/loadProductResults; giữ nguyên logic của người học.
- Bộ kiểm tra dùng Promise có thể điều khiển để quan sát hành vi, không đo tốc độ máy bằng số millisecond.

## 4. Nguồn học

- [MDN — Using promises, Chaining/Composition](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
- [MDN — Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).
- [MDN — Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled).
- [F8 — Promise chain](https://www.youtube.com/watch?v=Ldl571DAlXI).
- [F8 — Promise methods](https://www.youtube.com/watch?v=pxyxbaq8i8c).
- [Web Dev Simplified — Async/Await](https://www.youtube.com/watch?v=V_Kr9OSfDeU).

## 5. Tự ôn và chuyển Ngày 10

Không cần điền Markdown; tự giải thích hoặc kiểm chứng trong code:

1. Nếu quên return categoryPromise trong then đầu tiên, caller còn chờ category không?
2. Khi nào for...of + await là đúng, khi nào làm chờ không cần thiết?
3. Promise.all reject có bảo đảm mọi request còn lại đã dừng không?
4. Vì sao allSettled fulfill vẫn có thể chứa nhiều tác vụ thất bại?

Ngày 10 — Tuần 2, Ngày 3 — học thứ tự synchronous/microtask/timer, continuation sau await và batching bằng queueMicrotask. Bài học được làm trực tiếp trong hàm; Markdown tổng kết khi người học yêu cầu cuối buổi.
