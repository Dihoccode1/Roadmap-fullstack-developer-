# Tuần 1 — Ngày 6: this, Arrow Function và bind

Ngày review: **01/11/2026**. Người học yêu cầu **bỏ bài 4 về constructor/prototype/class** và chuyển sang Ngày 7. Không ghi phần bỏ qua là đã làm hoặc đã nắm vững.

**Kết quả trong phạm vi đã điều chỉnh:** bài 1–3 đạt **9/9 tình huống kiểm tra**, đúng yêu cầu về method thường, bind và arrow callback. Bài 4 có ba tình huống được bỏ qua trong lệnh chạy mặc định; code khung và TODO được giữ để có thể mở lại khi người học muốn.

Tổng kết do trợ lý viết dựa trên code và kết quả chạy. Chưa có dữ liệu về thời gian học, mức độ xem tài liệu/video hoặc khả năng tự giải thích không nhìn code.

## 1. Review bài làm

| Bài | Kết quả | Nhận xét |
| --- | --- | --- |
| createPriceTag | 3/3 đạt | getLabel là method thường, đọc this.name/this.priceMinor; đổi thuộc tính hoặc mượn bằng call cho kết quả theo receiver mới |
| createTotalCallback | 3/3 đạt | Trả bound function bằng cart.getTotal.bind(cart), không gọi ngay; callback đọc state mới và không sửa method gốc |
| createReceiptFormatter | 3/3 đạt | Method ngoài là function thường, callback map là arrow; this.shopName theo lần gọi method, không capture shopName ban đầu của factory |
| Product / DiscountedProduct | Bỏ qua theo yêu cầu | Chưa triển khai, không tính vào điểm đạt hoặc kết luận về prototype/class |

## 2. Kiến thức đã áp dụng

- Method thường lấy this theo cách gọi; call cho phép chỉ định receiver.
- bind tạo function mới có receiver được ràng buộc, không tính trước kết quả của method.
- Arrow callback không tạo this riêng; nó dùng this từ method bao ngoài.
- Hai object có dữ liệu riêng và có thể dùng cùng một function với receiver khác nhau.

**WHY:** method chuyển sang callback có thể mất receiver; capture biến cấu hình ban đầu cũng có thể không phản ánh object hiện tại.

**HOW:** lần theo call site, phân biệt method thường với arrow, và dùng bind khi cần callback giữ receiver.

**TRADE-OFF:** bind giữ receiver cố định nên không dùng call để chuyển receiver như function thường. Arrow tiện cho callback bên trong method nhưng không thay thế mọi method cần this linh hoạt.

**WHEN:** dùng cho formatter, callback tính tổng và helper cần thao tác trên dữ liệu hiện tại của object. Code hôm nay đồng bộ; chưa làm DOM hoặc setTimeout.

## 3. Dọn code và điều chỉnh công cụ chạy

- Bỏ throw TODO sau return ở hai bài đã hoàn thành, sửa comment TODO của arrow callback.
- Lệnh mặc định chỉ chạy bài 1–3 và in rõ SKIP cho ba tình huống bài 4.
- Chạy rõ nhóm 4 vẫn thực thi các kiểm tra chưa hoàn thành; việc bỏ qua không sửa kỳ vọng hay đánh dấu chúng pass.

```powershell
# 9 tình huống thuộc phạm vi đã chọn
node Week1/Day6/check.mjs

# Chạy từng bài đã làm
node Week1/Day6/check.mjs 1
node Week1/Day6/check.mjs 2
node Week1/Day6/check.mjs 3

# Chỉ dùng khi muốn quay lại bài 4; hiện bài này còn TODO
node Week1/Day6/check.mjs 4
```

## 4. Nguồn học

- [MDN — this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this).
- [MDN — Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions).
- [MDN — bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
- [F8 — This keyword](https://www.youtube.com/watch?v=ii1Ra_zLDIo).
- Nguồn prototype/class trong code khung được giữ như tài liệu tham khảo; không nằm trong yêu cầu hoàn thành Ngày 6 đã điều chỉnh.

## 5. Ôn nhanh và Ngày 7

Tự nói hoặc kiểm chứng trong code, không cần điền Markdown:

1. Vì sao getLabel.call(other) đọc thuộc tính của other?
2. Vì sao callback đã bind vẫn dùng cart ban đầu khi gọi callback.call(other)?
3. Vì sao arrow trong map đọc đúng this của formatItems?

Ngày 7 tích hợp kiến thức tuần đầu qua một bài giỏ hàng/hóa đơn nhỏ. Chỉ dùng function, closure và object method; không yêu cầu prototype/class đã được bỏ qua.
