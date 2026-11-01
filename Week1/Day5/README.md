# Tuần 1 — Ngày 5: Closure, Private State và Snapshot

Ngày review: **01/11/2026**. Tổng kết do trợ lý viết dựa trên code người học đã cung cấp trong repository và kết quả chạy. Thời gian học, việc xem hết nguồn học và khả năng tự giải thích không nhìn code chưa được xác nhận.

**Kết quả:** bốn bài đạt **12/12 tình huống kiểm tra**. Review code xác nhận state nằm trong từng factory, không dùng class/this/global state hoặc property public thay cho closure. Các method hoạt động cả khi tách khỏi object trả về.

## 1. Kiến thức đã áp dụng

| Chủ đề | Bằng chứng |
| --- | --- |
| State được giữ qua closure | value, called/result, history và carts nằm ngoài method, trong scope factory |
| Các closure cùng chia sẻ binding | increment/decrement/reset/getValue đọc và ghi cùng value |
| Mỗi lần gọi factory có state riêng | Hai counter, wrapper, history và cart không ảnh hưởng nhau |
| Kết quả falsy khác trạng thái chưa chạy | createOnce dùng called riêng với result |
| Snapshot của array string | getAll trả spread array, đủ để tách history vì phần tử là primitive |
| Snapshot của array object | getItems dùng map và object spread cho từng item |

**WHY:** các method cần nhớ dữ liệu giữa các lần gọi và kiểm soát đường cập nhật dữ liệu đó.

**HOW:** function được trả về tiếp tục truy cập binding trong lexical environment mà nó được tạo ra. Nó quan sát giá trị hiện tại của binding, không tự chụp một bản sao cố định của giá trị ban đầu.

**TRADE-OFF:** closure thuận tiện để giữ state không được đưa vào API công khai, nhưng dữ liệu vẫn được giữ khi các closure còn tham chiếu đến nó. Trả thẳng array/object mutable có thể làm người gọi thay đổi state ngoài ý muốn; snapshot tốn thêm chi phí copy.

**WHEN:** dùng cho counter, tiện ích chỉ chạy một lần, lịch sử và module giỏ hàng đơn giản. State hiện tại chỉ nằm trong bộ nhớ process, chưa được lưu bền hoặc đồng bộ giữa nhiều instance backend.

## 2. Review từng bài

### Bài 1 — createCounter

- value được khởi tạo một lần cho mỗi counter từ initialValue.
- increment/decrement cập nhật và trả giá trị mới; getValue đọc state hiện tại.
- reset về initialValue của chính counter đó, không luôn reset về 0.
- Không dùng this, nên method tách ra vẫn hoạt động.
- **3/3 tình huống đạt**: state chung giữa method, reset/custom initialValue và hai counter độc lập.

### Bài 2 — createOnce

- called và result nằm ngoài runOnce, nên không bị khởi tạo lại mỗi lần gọi wrapper.
- Chỉ gọi callback lần đầu với args đầu tiên; các lần sau trả result đã lưu.
- Dùng cờ riêng nên xử lý đúng 0, false, chuỗi rỗng và undefined.
- Kết quả object giữ cùng identity như contract; mỗi wrapper có state riêng.
- **3/3 tình huống đạt**. Bài giả định callback đồng bộ và không throw; chưa xác định chính sách retry lỗi hoặc Promise.

### Bài 3 — createHistory

- history là array riêng trong factory; add trả độ dài sau thêm.
- getAll trả bản sao array, không lộ array nội bộ.
- clear đặt length về 0; các method cũ vẫn quan sát cùng array đã được xóa.
- Snapshot cũ không tự cập nhật khi history thay đổi, và thay đổi snapshot không ảnh hưởng history.
- **3/3 tình huống đạt**, gồm method tách ra và hai history độc lập.

### Bài 4 — createCart

- carts giữ state trong factory; catalog được đọc để lấy giá và không bị sửa.
- add xác nhận productId và quantity trước khi đổi state; cộng quantity vào dòng cũ, thêm dòng mới ở cuối.
- remove xóa dòng theo ID, trả boolean đúng khi có/không có.
- getItems copy cả array và item, nên sửa quantity/price trên snapshot không sửa cart.
- getTotal tính lại từ state hiện tại, giỏ rỗng trả 0.
- Hai cart cùng catalog có dữ liệu giỏ độc lập; method tách ra vẫn hoạt động.
- **3/3 tình huống đạt**. Contract giả định catalog read-only và số lượng test nhỏ; chưa xử lý tồn kho, persistence hoặc giới hạn cộng dồn rất lớn.

## 3. Dọn code sau review

- Bỏ các throw TODO không thể chạy tới sau return.
- Thay comment TODO của state đã hoàn thành bằng mô tả binding và snapshot.
- Giữ nguyên thuật toán, API và cách lưu state của người học.

## 4. Bằng chứng kiểm tra

```powershell
node Week1/Day5/check.mjs
node --check Week1/Day5/exercises.mjs
node --check Week1/Day5/check.mjs
```

| Tiêu chí | Kết quả |
| --- | --- |
| Assertion theo contract | 12/12 đạt |
| State trong scope factory, không this/class/global state | Đạt qua đọc code |
| State giữa các instance độc lập | Đạt trong các tình huống đã kiểm tra |
| Method tách ra và snapshot theo contract | Đạt |
| Cú pháp hai file JavaScript | Đạt |
| Tự giải thích lại không nhìn lời giải | Chưa có bằng chứng được cung cấp |

## 5. Nguồn học

- [MDN — Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures): Closure, makeAdder, Emulating private methods with closures.
- [MDN — Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax): shallow copy của array/object.
- [F8 — Closure trong JavaScript](https://www.youtube.com/watch?v=xtQtGKL0NCI).
- [Web Dev Simplified — Learn Closures In 7 Minutes](https://www.youtube.com/watch?v=3a0I8ICR1Vg).
- [Lydia Hallie — JavaScript Visualized: Closures](https://www.youtube.com/watch?v=6Ixyltr8_R0).

## 6. Tự ôn và chuyển Ngày 6

Không cần điền đáp án vào Markdown; tự nói hoặc kiểm chứng trong code:

1. Vì sao value không trở về initialValue sau mỗi lần increment?
2. Vì sao createOnce không nên dùng if (!result) để xác định lần chạy đầu?
3. Vì sao spread array đủ cho history string nhưng chưa đủ cho array item của cart?
4. Giữ state bằng closure khác với dùng this của một object như thế nào?

Ngày 6 học this, arrow callback, bind, constructor/prototype và class kế thừa ở mức cơ bản. Bài mới làm trực tiếp trong hàm/class; Markdown Ngày 6 được tổng hợp cuối buổi khi người học yêu cầu.
