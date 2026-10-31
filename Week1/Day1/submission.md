# Bài nộp — Tuần 1, Ngày 1

- Ngày theo lộ trình: 01/11/2026.
- Ngày tổng hợp/review trong phiên làm việc: 31/10/2026.
- Tổng thời gian học thực tế: chưa được người học cung cấp; không suy ra từ thời lượng kế hoạch.
- Trạng thái kỹ thuật: hoàn thành bốn hàm bắt buộc và các kiểm tra tương ứng.
- Phần cần ôn: dùng chung reference, shallow copy, mutation so với reassignment; tự viết lại hai hàm 3–4 khi không nhìn lời giải.
- Bonus updateProductCategory: chưa thực hiện, không bắt buộc trong Ngày 1.

**Nguồn nội dung:** dự đoán và lý do ban đầu được giữ theo câu trả lời của người học trong chat. Kết quả được đối chiếu bằng code hiện tại. Phần giải thích, self-check mẫu và kiểm tra bổ sung được trợ lý hỗ trợ; chưa phải bằng chứng người học đã tự trả lời hoặc tự viết lại không cần hướng dẫn.

## Dự đoán trước khi chạy và kết quả review

Dấu `;` phân cách các lần console.log. “Chưa ghi” nghĩa là chưa có câu trả lời tương ứng trong nội dung người học đã gửi.

| Câu | Output/lỗi dự đoán ban đầu | Lý do ban đầu | Kết quả thực tế và giải thích sau kiểm chứng |
| --- | --- | --- | --- |
| 1 | `100 250` | Chỉ copiedPrice được thay đổi giá trị | `100 250`. Gán lại primitive ở copiedPrice không đổi price. |
| 2 | `5 2; true` | Selected tham chiếu đến product, sau đó thay đổi key bên trong | `2 2; true`. Hai biến cùng tham chiếu một object; sửa stock qua selected cũng đổi giá trị đọc qua product. Cột thực tế người học gửi ban đầu cũng ghi 5 2, đã được sửa sau khi chạy lại. |
| 3 | `2 p001` | Thêm hai giá trị vào cart, in độ dài và phần tử đầu | `2 p001`. push mutate array; binding const vẫn giữ nguyên. |
| 4 | Lỗi | Chưa ghi | In `3`, sau đó TypeError do gán lại binding const. Console.log cuối không chạy. |
| 5 | `1 2` | Chưa ghi | `1 2; 0; false true`. Array ngoài mới, phần tử object dùng chung; push chỉ tăng copy.length, còn sửa stock ảnh hưởng object gốc. |
| 6 | `0 0; stationery; false true` | Chưa ghi | `5 0; stationery; false true`. Object ngoài được copy nên stock độc lập; metadata vẫn dùng chung reference. |
| 7 | `5 10` | Chưa ghi | `5; 10`. Biến stock trong block che biến ngoài; hai binding khác nhau. |
| 8 | Chưa ghi | Chưa ghi | `99; 6`. Mutation đổi object gốc thành stock 6; gán lại parameter chỉ chuyển selected trong hàm sang object mới. |
| 9 | `5 2; false; false; true; true` | Chưa ghi | Đúng output. Array mới; product đầu mới; product thứ hai giữ nguyên; metadata của product đầu vẫn dùng chung. |
| 10 | `false; false; true; true` | Chưa ghi | File hiện tại có ba console.log: `false; true; true`. first/second là object riêng; alias cùng object với first; hai id string cùng giá trị. Dòng `[] === []` của đề ban đầu đã được người học bỏ khỏi file; nếu có thì dòng đó trả false. |

## Ghi chú sau review

Ba kiến thức đã được giải thích, cần tự nhắc lại để kiểm tra khả năng ghi nhớ:

1. Const ngăn gán lại binding, không tự đóng băng object/array.
2. Spread chỉ sao chép một tầng; object lồng có thể còn dùng chung reference.
3. Filter luôn trả array; cả array rỗng cũng truthy. Muốn kiểm tra có phần tử thỏa điều kiện có thể dùng some, hoặc kiểm tra length của kết quả filter.

Hai điểm người học đã nhờ hỗ trợ:

1. Tính tổng từ productId/quantity và xử lý input sai trong calculateTotal.
2. Cập nhật tồn kho bằng array/object mới mà giữ input cũ trong updateProductStock.

## Mini project và bằng chứng kiểm tra

| Nhóm | Kết quả | Nội dung chính |
| --- | --- | --- |
| find | 3/3 | Tìm thấy, không có ID, danh sách rỗng; không sửa input |
| filter | 3/3 | Chọn đúng sản phẩm còn hàng, array rỗng, array kết quả riêng |
| total | 6/6 | Tổng tiền, giỏ rỗng, lỗi ID/quantity, dòng trùng ID, không mutate input |
| stock | 5/5 | Bản mới đúng tầng, stock bằng 0, lỗi ID/stock, giá trị không đổi vẫn trả bản mới |
| Bổ sung có trợ lý hỗ trợ | 4/4 | Giá lấy từ products; cập nhật phần tử không ở đầu array; toàn bộ hết hàng; tính tổng lặp lại không sửa input |

Tái kiểm tra từ thư mục gốc:

```powershell
node Week1/Day1/check.mjs
node Week1/Day1/my-checks.mjs
```

**Mức hỗ trợ:** hai hàm đầu do người học triển khai trước lượt hỗ trợ; hai hàm 3–4 hoàn thiện theo hướng dẫn và lời giải đã cung cấp trong chat. Bốn tình huống trong my-checks.mjs do trợ lý bổ sung, không ghi là assertion người học tự nghĩ ra. Bonus chưa thực hiện.

**Ví dụ không mutate input:** cập nhật p004 về stock 0 tạo array mới và object p004 mới; stock p004 trong input vẫn là 7, các product không đổi giữ reference. Kiểm tra bằng snapshot và so sánh identity.

## Nhật ký debug

### Lỗi 1 — Điều kiện filter luôn đi vào nhánh throw

- Đoạn lỗi: `if (items.filter((p) => p.stock < 0))`.
- Hiện tượng: từ chối cả giỏ hợp lệ và giỏ rỗng.
- Nguyên nhân: filter trả array luôn truthy; item chứa quantity thay vì stock.
- Cách sửa: duyệt từng item, kiểm tra quantity là số nguyên an toàn lớn hơn 0, tìm product rồi cộng giá × số lượng.
- Bằng chứng: 6/6 tình huống total đạt, gồm quantity âm/0/lẻ/sai kiểu; giỏ rỗng trả 0.

### Lỗi 2 — Chưa xác nhận ID tồn tại và chưa đủ kiểm tra stock

- Đoạn kiểm tra ban đầu: `!id` và `nextStock < 0`.
- Nguyên nhân: ID có giá trị chưa chắc có trong products; số lẻ, NaN và một số kiểu sai chưa bị loại đầy đủ.
- Cách sửa: tìm product, kiểm tra stock là số nguyên an toàn không âm; map và spread để tạo dữ liệu mới.
- Bằng chứng: 5/5 tình huống stock đạt và kiểm tra bổ sung với p004 ở giữa array đạt.

### Dọn code sau hoàn thành

- Bỏ throw TODO sau return trong bốn hàm bắt buộc vì không thể chạy tới.
- Bỏ `|| undefined` dư thừa; find tự trả undefined khi không có kết quả.
- Giữ TODO ở bonus để thể hiện đúng phần chưa làm.

## Self-check — đáp án tham khảo sau review

Các câu dưới đây do trợ lý tổng hợp để ôn, chưa thay cho việc người học tự trả lời không nhìn tài liệu.

1. **Vì sao const object vẫn sửa thuộc tính được?** Const bảo vệ binding khỏi reassignment, không cấm mutation lên object.
2. **Vì sao spread array chưa đủ khi sửa object phần tử?** Array mới vẫn chứa reference đến object cũ; cần tạo object mới cho phần tử được thay đổi.
3. **Gán lại parameter khác mutation thế nào?** Gán lại chỉ chuyển parameter cục bộ sang giá trị khác; mutation tác động object dùng chung mà người gọi vẫn có thể tham chiếu.
4. **Làm sao kiểm chứng cùng object?** Dùng === để so sánh identity; hai object cùng nội dung nhưng được tạo riêng vẫn khác nhau.
5. **Cập nhật category cần copy tầng nào?** Array, product mục tiêu và metadata cần bản mới; product khác và tags không đổi có thể giữ reference. Bonus thực hành phần này chưa làm.

## Thuật ngữ hôm nay

| Thuật ngữ | Giải thích ngắn | Ví dụ tham khảo |
| --- | --- | --- |
| Binding | Liên kết tên biến với giá trị | `const product = { stock: 5 }` |
| Reassignment | Gán giá trị mới cho binding đã có | `let count = 1; count = 2` |
| Mutation | Sửa object/array hiện có | `product.stock = 2` |
| Shallow copy | Copy tầng ngoài, object lồng có thể dùng chung | `const copy = { ...product }` |
| Object identity | Hai giá trị cùng tham chiếu một object | `const alias = product; alias === product` |

## Kết luận review và việc tự ôn

- [x] Lưu dự đoán ban đầu và sửa kết quả dựa trên code đã chạy.
- [x] Hoàn thành bốn hàm bắt buộc, đạt 17/17 tình huống kiểm tra.
- [x] Có bốn tình huống bổ sung do trợ lý hỗ trợ, đạt 4/4.
- [x] Ghi nguyên nhân lỗi, cách sửa và bằng chứng input không bị mutate.
- [ ] Tự viết lại calculateTotal và updateProductStock không nhìn lời giải.
- [ ] Tự trả lời ít nhất 4/5 self-check và tự nghĩ thêm hai assertion.
- [ ] Bổ sung tổng thời gian học thực tế nếu muốn theo dõi tốc độ học.

Ngày 1 đã hoàn tất phần code và tổng hợp bài nộp có hỗ trợ; các mục tự ôn được giữ để đánh giá đúng khả năng học độc lập.
