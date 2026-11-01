# Tuần 2 — Ngày 5 (Ngày 12): Tiến độ timeout và hủy tác vụ

Ngày ghi nhận: **01/11/2026**. Lưu tiến độ theo yêu cầu chuyển sang Ngày 13; **chưa hoàn thành Ngày 12**. Không đánh dấu các bài còn dở là đã bỏ qua.

## Kết quả bản nộp

Chạy riêng từng nhóm để lỗi của bài 1 không chặn việc kiểm tra các bài sau: **4/12 kiểm tra đạt**. Bài 1 còn phát sinh unhandled rejection sau báo cáo 0/3. Kiểm tra cú pháp đạt nhưng code vẫn lỗi khi chạy.

| Bài | Kết quả | Trạng thái |
| --- | --- | --- |
| withTimeout | 0/3 | Gán newPromise chưa khai báo; thiếu return/await cho race, tên TimeoutError và cleanup timer; còn throw TODO đang chạy nếu đi qua được đoạn trước |
| fetchJsonWithSignal | 3/3 | Đúng pre-abort, truyền chính signal, xử lý HTTP, mạng/parse và abort lúc đọc body; còn TODO không chạy tới |
| abortableDelay | 1/3 | Đúng pre-abort; cần dọn listener cả thành công/abort và clear timer theo hợp đồng bài; còn TODO sau return |
| createLatestProductLoader | 0/3 | Mới khai báo state, getState/load vẫn TODO |

## Những gì đã làm được

- Bài 2 kiểm tra signal.aborted trước khi bắt đầu, truyền signal cho dependency và giữ nguyên lý do hủy.
- Kiểm tra response.ok trước json; HTTP lỗi không đọc body.
- Bài 3 đã bọc callback bằng Promise và dừng timer khi abort; nhánh signal đã hủy không tạo tác vụ mới.

## Những điểm cần quay lại

1. Với withTimeout, đưa Promise.race vào Promise trả cho caller; khai báo biến đúng và dọn timer trong finally. Promise.resolve/race không tự hủy việc gốc.
2. Giữ handle timer để cleanup; đặt error.name theo hợp đồng timeout.
3. Với abortableDelay, dùng listener có tên để removeEventListener. `{ once: true }` chỉ tự gỡ khi event abort thực sự xảy ra, không thay cleanup ở nhánh thành công.
4. Hoàn thiện loader bằng controller riêng và identity request; chỉ request mới nhất được ghi state, kể cả khi dependency bỏ qua abort.

Trợ lý không viết thay phần còn dở trong lần lưu này. Chỉ dọn khoảng trắng cuối dòng; logic và các TODO được giữ lại.

## Cách kiểm tra lại

```powershell
node Week2/Day5/check.mjs 1
node Week2/Day5/check.mjs 2
node Week2/Day5/check.mjs 3
node Week2/Day5/check.mjs 4
```

Chạy từng nhóm khi bài 1 còn lỗi; chạy toàn bộ có thể dừng sớm do unhandled rejection.

## Nguồn học và bước tiếp theo

- [MDN — Promise.race và timeout](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race).
- [MDN — AbortSignal, Implementing an abortable API](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).
- [MDN — AbortController.abort](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).
- [Web Dev Simplified — AbortController](https://www.youtube.com/watch?v=BeZfiCPhZbI).

Ngày 13 — Tuần 2, Ngày 6 — học task factory và giới hạn concurrency. Bài mới không phụ thuộc các hàm chưa hoàn thành của Ngày 12. Tổng kết này chỉ xác nhận tiến độ từ code, không xác nhận thời gian học hoặc việc xem video.
