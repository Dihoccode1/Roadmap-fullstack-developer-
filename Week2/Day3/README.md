# Tuần 2 — Ngày 3 (Ngày 10): Event loop, Microtask và Timer

Ngày review: **01/11/2026**. Tổng kết từ code đã nộp và kết quả chạy; chưa xác nhận thời gian học hoặc việc xem hết các nguồn học.

**Kết quả trước sửa:** bài 1–3 chạy qua 9 kiểm tra. Đến bài 4, chương trình dừng với `ReferenceError: scheduled is not defined` trong callback microtask, nên lần chạy này không hoàn tất đủ 12 kiểm tra.

**Kết quả sau hỗ trợ sửa:** **12/12 kiểm tra đạt**. Có sửa của trợ lý; không ghi nhận đây là 12/12 ngay từ bản nộp ban đầu.

## 1. Review từng bài

| Bài | Nhận xét bản nộp | Xử lý khi review |
| --- | --- | --- |
| traceQueues | Đăng ký Promise callback, queueMicrotask và timer đúng thứ tự; trả snapshot | Dọn throw TODO không chạy tới sau return |
| deferWork | Trì hoãn work đúng; gọi một lần; giữ kết quả và Error | Giữ logic người học; new Promise và then trả lại value còn dư nhưng không làm sai hợp đồng |
| traceAwait | Có await nên qua cả 3 kiểm tra, nhưng truyền callback vào Promise.resolve và giữ biến result không dùng | Đổi thành await Promise.resolve(); bỏ callback không chạy và TODO cũ |
| createMicrotaskBatcher | Đúng hướng dùng closure, hàng chờ, snapshot và cờ lên lịch | Sửa scheduled thành isScheduled; xóa throw TODO đang chạy trong add |

## 2. Những điểm cần nhớ từ lỗi thực tế

### Promise.resolve không gọi function được truyền vào

`Promise.resolve(fn)` tạo Promise fulfill với chính function `fn`. Nó không tương đương `Promise.resolve().then(fn)`.

Trong bản nộp, callback chứa `events.push('caller')` không chạy. Bài vẫn qua kiểm tra vì `await` thật sự nhường quyền và caller trong bộ kiểm tra tự thêm marker đó. Vì thế cần đọc code bên cạnh việc chạy test. Phần sửa dùng đúng `await Promise.resolve()` theo đề.

### Cờ batch phải được reset đúng biến

Biến được khai báo là `isScheduled`, nhưng callback gán `scheduled = false`. ES module dùng strict mode; gán vào tên chưa khai báo gây ReferenceError. Hàng chờ đã được xóa nhưng callback chưa gọi được `onBatch`.

`throw TODO` trong `add` cũng chưa được xóa, khiến mỗi lần add ném lỗi thay vì trả undefined. Sau sửa, batch đầu flush xong sẽ reset cờ để batch tiếp theo được lên lịch.

### Lỗi trong queueMicrotask khác Promise rejection

Callback `queueMicrotask` ném lỗi không tự biến thành rejection của một Promise mà runner đang await. Đây là lý do lỗi của bài 4 có thể làm Node dừng hẳn. Với callback Promise.then, lỗi được chuyển thành rejection của Promise trả về.

### deferWork có thể viết gọn hơn

`then` tự trả một Promise và chuyển lỗi throw trong callback thành rejection. Vì vậy việc tạo thêm `new Promise` và cuối cùng `.then(value => value)` chưa cần thiết ở đây. Review giữ bản làm đang đúng để người học tự luyện rút gọn sau.

## 3. Kiến thức đã áp dụng

- Phần đồng bộ chạy xong trước callback microtask đã đăng ký trong lời gọi.
- Trong phạm vi ví dụ hôm nay, Promise callback và queueMicrotask chạy theo thứ tự xếp trước timer.
- `setTimeout(..., 0)` không có nghĩa callback chạy ngay, cũng không bảo đảm thời gian chính xác.
- `await` một Promise đã fulfilled vẫn tạm dừng async function; phần tiếp tục được lên lịch sau.
- Closure giữ hàng chờ riêng cho từng batcher; snapshot tách khỏi array nội bộ.
- Reset cờ và hàng chờ cho phép lượt add sau tạo batch mới; giá trị trùng vẫn được giữ.

**WHY:** caller có thể nhìn thấy trạng thái khác nhau tùy thời điểm callback chạy.

**HOW:** phân biệt code đồng bộ, microtask và timer; theo dõi state trước/sau điểm await và lúc flush batch.

**TRADE-OFF:** microtask phù hợp cập nhật ngắn và batching; công việc CPU nặng hay xếp microtask vô hạn có thể làm việc khác bị chờ lâu.

**WHEN:** gom nhiều thay đổi nhỏ sau lượt gọi hiện tại. Chưa dùng bài này để suy thứ tự timer/I/O của mọi phase Node hoặc để chạy CPU song song.

## 4. Kiểm chứng

```powershell
node Week2/Day3/check.mjs
node --check Week2/Day3/exercises.mjs
```

- Sau các sửa nêu trên: **12/12 kiểm tra đạt**, cú pháp đạt.
- Kiểm tra thứ tự callback, kết quả/lỗi, giá trị falsy, snapshot, batch tiếp theo và hai instance độc lập.
- Không đo số millisecond cụ thể và không gọi mạng.

## 5. Nguồn học và tự ôn

- [MDN — Microtask guide](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide).
- [MDN — Promise.resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve).
- [MDN — await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).
- [Node.js — queueMicrotask](https://nodejs.org/api/globals.html#queuemicrotaskcallback).
- [Lydia Hallie — Event Loop](https://www.youtube.com/watch?v=eiC58R16hb8).
- [Philip Roberts — What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ).

Tự giải thích trong code hoặc nói lại, không cần điền Markdown:

1. `Promise.resolve(fn)` khác `Promise.resolve().then(fn)` ở đâu?
2. Vì sao bài 3 qua test dù callback truyền vào resolve không chạy?
3. Nếu không reset isScheduled, batch thứ hai sẽ ra sao?
4. Lỗi throw trong queueMicrotask đi đâu, khác lỗi trong then thế nào?

Ngày 11 — Tuần 2, Ngày 4 — học xử lý lỗi async, try/catch/finally, Fetch API và trạng thái loading/success/error. Timeout và hủy request dành cho buổi tiếp theo.
