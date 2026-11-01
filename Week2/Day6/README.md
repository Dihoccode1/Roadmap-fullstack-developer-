# Tuần 2 — Ngày 6 (Ngày 13): Task factory và giới hạn concurrency

Ngày review: **01/11/2026**. Tổng kết từ bản nộp và kết quả chạy; chưa xác nhận số giờ học, video đã xem hoặc khả năng tự giải thích không nhìn code.

**Bản nộp đạt 12/12 kiểm tra.** Trợ lý dọn ba dòng throw TODO không chạy tới và biến currentIndex chưa dùng; giữ nguyên thuật toán. Sau dọn vẫn đạt 12/12.

## 1. Review từng bài

| Bài | Kết quả | Nhận xét |
| --- | --- | --- |
| runTasksSequential | 3/3 | for...of và await gọi từng factory đúng lượt; lỗi dừng task sau, giữ nguyên Error và falsy |
| runTasksConcurrent | 3/3 | map gọi tất cả factory, Promise.all giữ thứ tự input và reject sớm; không hủy task đã chạy |
| mapWithConcurrency | 3/3 | Validate limit; số worker hữu hạn; lấy index trước await; lấp slot độc lập; cờ stopped ngăn item mới sau khi quan sát lỗi |
| loadProductResultsLimited | 3/3 | Tái sử dụng pool; catch lỗi từng fetch thành dữ liệu để xử lý đủ ID; giữ thứ tự/ID lặp và lỗi cấu hình |

Đã đọc code để xác nhận không dùng batch cố định hay khởi động mọi item trước khi giới hạn. Promise.all được dùng cho các worker, không phải toàn bộ mapper đã khởi chạy.

## 2. Kiến thức đã áp dụng

- Factory là function chưa chạy; Promise được đưa vào thường đã đại diện cho tác vụ khởi động trước đó.
- Cùng một factory xuất hiện hai lần trong input vẫn phải được gọi hai lần.
- `nextIndex++` trước await cấp một index cho từng lượt, tránh nhiều worker lấy cùng item.
- Mỗi worker await một mapper tại một thời điểm; tổng worker không vượt limit.
- Lưu `results[index]` giữ thứ tự input dù thứ tự hoàn thành khác nhau.
- Khi một worker lỗi, stopped ngăn lấy item mới; các tác vụ đang chạy vẫn tiếp tục. Promise.all quan sát cả lỗi của những worker đó.
- Bài 4 chuyển lỗi từng fetch thành record nên worker không reject vì lỗi sản phẩm; limit không hợp lệ vẫn là lỗi cấu hình cần reject.
- Concurrency I/O không tạo thêm CPU thread và không giới hạn số request mỗi giây.

**WHY:** kiểm soát số tác vụ đang chờ giúp tránh khởi động cả danh sách cùng lúc.

**HOW:** một số worker async hữu hạn chia sẻ index; task chỉ bắt đầu khi có worker rảnh. Chọn chính sách lỗi trước khi bọc mapper.

**TRADE-OFF:** limit nhỏ giảm tải đồng thời nhưng có thể tăng thời gian hoàn thành. Reject sớm cho caller không có nghĩa mọi tác vụ đã dừng.

**WHEN:** tải nhiều sản phẩm hoặc batch I/O. Chưa phải limiter dùng chung giữa nhiều lời gọi hay rate limiter theo cửa sổ thời gian.

## 3. Điểm có thể rút gọn

- catch rồi throw lại nguyên Error trong bài 1 chưa thêm xử lý; có thể tự bỏ catch mà giữ hành vi.
- Bài 4 validate limit trước khi gọi bài 3; bài 3 cũng validate. Việc lặp này không gây lỗi nhưng có thể gom trách nhiệm nếu giữ đúng hợp đồng.
- Các điểm trên là góp ý; review không đổi logic người học.

## 4. Kiểm chứng

```powershell
node Week2/Day6/check.mjs
node --check Week2/Day6/exercises.mjs
```

**12/12 trước và sau dọn code**, cú pháp đạt. Kiểm tra gồm thứ tự gọi/trả kết quả, lấp slot khi một item còn chờ, limit không hợp lệ, item lặp, lỗi đồng bộ, lỗi muộn của worker và thu kết quả từng phần. Không đo tốc độ máy hay gọi mạng.

## 5. Nguồn học và tự ôn

- [MDN — async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).
- [MDN — Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).
- [MDN — Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled).
- [p-limit — Usage/API](https://github.com/sindresorhus/p-limit).
- [F8 — Promise methods](https://www.youtube.com/watch?v=pxyxbaq8i8c).
- [Web Dev Simplified — Async/Await](https://www.youtube.com/watch?v=V_Kr9OSfDeU).

Tự giải thích trong code hoặc nói lại, không cần điền Markdown:

1. Vì sao Promise.all không tự giới hạn số request đã khởi động?
2. Nếu tăng nextIndex sau await, hai worker có thể lấy nhầm cùng index thế nào?
3. Nếu một worker lỗi khi worker khác còn pending, caller và tác vụ còn lại ra sao?
4. Vì sao bài 4 vẫn đi tiếp sau lỗi fetch nhưng không bỏ qua limit sai?

Ngày 14 — Tuần 2, Ngày 7 — tổng hợp Fetch, deadline, cleanup và latest-request loader. **Ngày 12 vẫn chưa hoàn thành**, giữ nguyên phần còn dở; kết quả Ngày 13 không thay thế kiểm tra của Ngày 12.
