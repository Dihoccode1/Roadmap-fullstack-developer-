# Tuần 1 — Ngày 4: Lexical Scope, Scope Chain và Factory Function

Ngày review: **01/11/2026**. Thời gian học, việc xem video và sử dụng debugger thực tế chưa được cung cấp. Tổng kết này do trợ lý viết từ code hiện tại và kết quả kiểm tra.

**Kết quả:** bốn bài đạt **12/12 tình huống kiểm tra**; đọc code xác nhận các helper giữ đúng vị trí khai báo và không thêm parameter để né việc đọc biến qua scope chain. Không có biến global, eval hoặc this dùng để thay thế cơ chế lexical scope.

## 1. Kiến thức được áp dụng

| Kiến thức | Bằng chứng trong bài làm |
| --- | --- |
| Lexical scope | readShopName đọc shopName của getShopLabel dù caller có biến cùng tên |
| Factory trả function | createProductLabeler trả chính labelProduct; function đó đọc category từ lần gọi factory tương ứng |
| Scope chain nhiều tầng | buildResult đọc discountedPrice ở calculate và currency/basePrice/taxRate ở factory |
| Biến theo từng lần gọi | discountPercent thuộc từng lần gọi calculate; roles thuộc từng lần gọi canAccess |
| Cấu hình độc lập | Các labeler, calculator và checker tạo riêng không thay cấu hình của nhau |

**WHY:** một helper cần đọc đúng cấu hình nơi nó được tạo, kể cả khi được truyền sang nơi gọi khác.

**HOW:** tìm khai báo trong scope hiện tại rồi lần ra các scope bao ngoài theo cấu trúc khai báo. Local variable của caller không tự trở thành outer scope của function được gọi.

**TRADE-OFF:** factory giúp nhóm cấu hình và logic liên quan, nhưng function trả về có thể giữ môi trường bên ngoài lâu hơn lời gọi ban đầu. Giữ dữ liệu capture vừa đủ và làm rõ dependency thay vì ngầm dùng global state.

**WHEN:** dùng cho formatter, calculator có cấu hình và predicate tái sử dụng. Ngày 4 chủ yếu đọc cấu hình; Ngày 5 chuyển sang nhiều closure cùng đọc/ghi state.

## 2. Review từng bài

### Bài 1 — getShopLabel

- readShopName trả nhãn từ parameter shopName của getShopLabel.
- Giữ helper ngoài callFromAdmin, không thêm argument vào lời gọi.
- Biến shopName = Admin Shop trong caller không ghi đè binding mà helper truy cập.
- **3/3 tình huống đạt**: tên ban đầu, tên khác và gọi nhiều lần.

### Bài 2 — createProductLabeler

- Trả một function thay vì gọi function ngay trong factory.
- Function trả về dùng category bên ngoài và name của lần gọi hiện tại.
- Hai labeler gọi xen kẽ giữ category riêng; local variable của caller không thay category.
- **3/3 tình huống đạt**.

### Bài 3 — createPriceCalculator

- discountedPrice đã áp dụng discountPercent trong scope calculate.
- buildResult giữ nguyên vị trí lồng nhau và không nhận parameter.
- Kết quả dùng currency/basePrice/taxRate từ factory, discountedPrice từ calculate.
- Các lần gọi dùng discount riêng, không sửa giá gốc của factory.
- **3/3 tình huống đạt**.
- Công thức total dùng discountedPrice × (1 + taxRate) có thể sinh sai số floating-point rất nhỏ. Bộ kiểm tra đã có tolerance cho total vì mục tiêu hôm nay là scope, không phải làm tròn tiền. Không xem đây là chính sách tiền tệ đầy đủ cho production.

### Bài 4 — createAccessChecker

- Helper hasRequiredRole đọc roles của lần gọi canAccess hiện tại và requiredRole của factory.
- Giữ helper lồng nhau và không truyền thêm argument.
- Không mutate user; các checker và user khác nhau không ảnh hưởng kết quả của nhau.
- **3/3 tình huống đạt**.
- Đây là predicate phục vụ bài học; chưa phải hệ thống xác thực/phân quyền có kiểm soát nguồn dữ liệu user.

## 3. Dọn code sau review

- Bỏ bốn throw TODO nằm sau return, không thể chạy tới.
- Đổi comment TODO của discountedPrice thành mô tả cách đọc biến giữa các scope.
- Giữ nguyên thuật toán và kết quả của người học.

## 4. Bằng chứng kiểm tra

```powershell
node Week1/Day4/check.mjs
node --check Week1/Day4/exercises.mjs
node --check Week1/Day4/check.mjs
```

| Tiêu chí | Kết quả |
| --- | --- |
| Các tình huống assertion | 12/12 đạt |
| Đọc biến theo lexical scope, giữ cấu trúc helper | Đạt qua review code |
| Không dùng global/eval/this để lấy dữ liệu | Đạt trong phạm vi bài |
| Cú pháp JavaScript | Đạt |
| Tự giải thích không nhìn bài và thời gian học thực tế | Chưa có bằng chứng được cung cấp |

## 5. Nguồn học

- [MDN — Closures: lexical scoping, makeFunc, makeAdder](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures).
- [MDN — Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope).
- [Lydia Hallie — Scope Chain](https://dev.to/lydiahallie/javascript-visualized-scope-chain-13pd).
- [F8 — Scope trong JavaScript](https://www.youtube.com/watch?v=5N8vz_VmszE).
- [Lydia Hallie — Execution Contexts, từ 10:14](https://www.youtube.com/watch?v=zdGfo6I1yrA&t=614s).
- [F8 — Closure](https://www.youtube.com/watch?v=xtQtGKL0NCI).

## 6. Tự ôn và chuyển Ngày 5

Không cần viết câu trả lời vào Markdown. Tự giải thích bằng lời hoặc kiểm chứng trong code:

1. Vì sao shopName ở callFromAdmin không thay kết quả của readShopName?
2. Hai labeler có cùng code thì vì sao vẫn giữ category khác nhau?
3. buildResult đọc mỗi biến từ scope nào?
4. Sau khi factory return, điều gì cho phép function trả về tiếp tục dùng cấu hình đó?

Ngày 5 luyện closure đọc/ghi state, state chung giữa các method của cùng instance, state độc lập giữa các instance và cách trả snapshot không làm lộ dữ liệu mutable.

**Việc còn lại từ Ngày 3:** sumToIterative vẫn dùng công thức tổng, chưa đổi sang vòng lặp như đề yêu cầu. Kết quả đúng không thay cho tiêu chí cách giải; trạng thái này chưa được đánh dấu hoàn thành.
