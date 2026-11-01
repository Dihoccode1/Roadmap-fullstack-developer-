# Tuần 2 — Ngày 7 (Ngày 14): Tổng hợp Async Product Loader

Ngày review: **01/11/2026**. Ghi nhận từ code và kiểm tra thực tế; chưa xác nhận số giờ học, video đã xem hoặc khả năng tự giải thích không nhìn code.

**Bản nộp đạt 12/12 kiểm tra.** Trợ lý dọn hai throw TODO không chạy tới, giữ nguyên logic. Sau dọn vẫn đạt 12/12.

## Review từng bài

| Bài | Kết quả | Nhận xét |
| --- | --- | --- |
| createTimeoutSignal | 3/3 | Validate ms trước timer; controller riêng; TimeoutError đúng; dispose idempotent bằng cách đặt timeoutId về null |
| fetchProductWithSignal | 3/3 | Encode ID; pre-abort không fetch; giữ chính signal; kiểm tra HTTP và chờ JSON; giữ lỗi gốc |
| fetchProductWithTimeout | 3/3 | Tái sử dụng hai helper; await cả việc đọc body trước finally; luôn dispose sau thành công/lỗi |
| createProductPageLoader | 3/3 | Controller và requestId riêng; chỉ request hiện hành cập nhật success/error/cleanup; state và snapshot đúng |

Đã đọc code bên cạnh chạy test. Bài 4 vẫn trả kết quả/lỗi riêng cho caller cũ, đồng thời ngăn nó sửa state mới; request cũ không phải tự động trả undefined.

## Kiến thức đã áp dụng

- Tách trách nhiệm tạo deadline, tải dữ liệu và quản lý state thành các helper ghép được.
- Timeout gửi abort đến dependency đang nghe signal, thay vì chỉ để caller ngừng chờ Promise.race.
- Khi đã có headers, đọc JSON vẫn có thể pending; deadline phải còn hiệu lực đến lúc body đọc xong.
- finally chỉ chạy đúng thời điểm cần cleanup khi Promise bên trong được await.
- Dispose không tự abort request hoàn thành; gọi lặp không clear lại timer.
- Abort signal và request identity giải quyết hai việc khác nhau: yêu cầu dừng tác vụ và bảo vệ quyền ghi state.
- Request đã settle được bỏ controller; load sau không abort nó. Catch/finally của request cũ không được xóa controller mới.
- Snapshot là shallow copy; Product và Error giữ tham chiếu gốc.

**WHY:** dữ liệu tải muộn, timeout và lỗi body đều có thể ảnh hưởng tính đúng của giao diện.

**HOW:** helper nhỏ, await trong try/finally, controller cho mỗi request và requestId để kiểm tra trước khi ghi state.

**TRADE-OFF:** abort cần dependency hỗ trợ; phía client không bảo đảm server đã dừng hoặc rollback. Snapshot không deep clone dữ liệu.

**WHEN:** trang sản phẩm hoặc giao diện đổi dữ liệu nhanh. Chưa kết hợp signal supersede và timeout thành một signal, chưa retry hoặc gọi mạng thật.

## Góp ý rút gọn

- controller, response và product không được gán lại nên có thể dùng const thay let.
- catch rồi throw lại trong fetchProductWithTimeout không bổ sung xử lý; try/finally đã đủ.
- Đây là góp ý phong cách, không phải lỗi hợp đồng; review giữ nguyên code đang đúng.

## Kiểm chứng

```powershell
node Week2/Day7/check.mjs
node --check Week2/Day7/exercises.mjs
```

**12/12 trước và sau dọn code**, cú pháp đạt. Kiểm tra deadline/dispose, HTTP/mạng/parse, abort khi chờ headers/body, request cũ bỏ qua abort, lỗi/cleanup cũ và các instance độc lập. Không đo thời gian thực hoặc gọi mạng.

## Nguồn học và chuyển tuần 3

- [MDN — Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).
- [MDN — AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal).
- [MDN — try/catch/finally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch).
- [Web Dev Simplified — AbortController](https://www.youtube.com/watch?v=BeZfiCPhZbI).
- [Web Dev Simplified — Fetch](https://www.youtube.com/watch?v=cuEtnrL9-H0).

Tự giải thích trong code hoặc nói lại: vì sao deadline phải sống đến lúc json xong; vì sao dispose không cần abort; vì sao đã abort vẫn cần requestId; vì sao finally của request cũ không được xóa controller mới.

Ngày 15 — Tuần 3, Ngày 1 — bắt đầu TypeScript: strict, annotation/inference, function, object/interface, optional property và readonly array. **Ngày 12 vẫn được ghi nhận chưa hoàn thành**; kết quả Ngày 14 không tự thay đổi hồ sơ cũ.
