# Tuần 1 — Ngày 1 · 01/11/2026

**Chủ đề:** Value/reference, mutation/reassignment, shallow copy và block scope.

**Thời lượng:** 6 giờ học chính + 1 giờ dự phòng/nghỉ, theo lịch Chủ nhật của bạn.

**Kết quả review:** bốn hàm bắt buộc đạt 17/17 tình huống; bốn tình huống bổ sung có trợ lý hỗ trợ đạt 4/4. Bài dự đoán, phân tích lỗi và đáp án ôn tập đã được tổng hợp trong [submission.md](./submission.md). Bonus chưa thực hiện. Thời gian học thực tế và khả năng tự viết lại không nhìn lời giải chưa được xác nhận.

Bạn đã quen function/object/array, nên hôm nay dùng bài dự đoán và một mini module E-commerce để kiểm tra khả năng giải thích, thay vì học lại toàn bộ cú pháp. Đầu ra là code bạn tự viết cùng bằng chứng input không bị thay đổi ngoài ý muốn.

## 1. Đích đến hôm nay

- Phân biệt sao chép primitive với sao chép giá trị reference đến object.
- Giải thích `const` hạn chế việc gán lại binding, không tự đóng băng object.
- Phân biệt mutation với reassignment bằng ví dụ và debugger.
- Biết spread chỉ sao chép nông; copy những tầng cần thay đổi.
- Viết bốn hàm xử lý sản phẩm theo yêu cầu và chạy assertion.
- Nhận biết scope của `let`/`const` trong block; hoisting/TDZ học sâu ở Ngày 2.

## 2. Bắt đầu: làm bài đầu vào trước khi đọc phần giải thích

Mở [predict.mjs](./predict.mjs), đọc 10 case. Ghi output dự đoán và lý do vào [submission.md](./submission.md). Nếu dự đoán có lỗi, ghi loại lỗi và dòng nào không chạy tiếp. Chưa chạy code trong lượt dự đoán đầu tiên.

Chạy từng case sau khi đã ghi câu trả lời, từ thư mục gốc `C:\RoadMapFullStackDev`:

```powershell
node Week1/Day1/predict.mjs 1
```

Thay `1` bằng số từ `1` đến `10`. Chạy không có số chỉ hiển thị cách dùng, không tự mở đáp án. Mỗi case được chạy độc lập để lỗi của một câu không làm mất kết quả câu khác. Case có exception là chủ ý của đề, không phải lỗi công cụ.

Nếu chưa biết câu nào, ghi giả thuyết thay vì bỏ trống. Sau khi chạy, ghi lại lý do sửa suy nghĩ; điểm khảo sát là dữ liệu để điều chỉnh bài học, không phải điểm thi.

## 3. Lịch 7 giờ

| Phiên | Thời lượng | Việc làm | Bằng chứng |
|---|---:|---|---|
| 1 | 45 phút | Đọc 10 case, dự đoán trước khi chạy | Bảng dự đoán trong submission |
| 2 | 60 phút | Đọc tài liệu và phần kiến thức dưới đây | Ba điều hiểu thêm, hai câu còn vướng |
| 3 | 90 phút | Chạy case, đặt breakpoint, kiểm chứng reference/scope | Giải thích lại ít nhất ba case từng sai hoặc chưa chắc |
| 4 | 90 phút | Tự viết bốn hàm trong products.mjs và chạy check | Kết quả assertion; hai kiểm tra tự bổ sung |
| 5 | 30 phút | Nhật ký lỗi và thuật ngữ | Một lỗi → nguyên nhân → kiểm chứng sau sửa |
| 6 | 45 phút | Tự trả lời câu hỏi cuối bài, dọn bài và lưu tiến độ | Checklist và submission hoàn chỉnh |
| Dự phòng | 60 phút | Nghỉ, đọc lại hoặc sửa phần chưa đạt | Không cần dùng hết |

Có thể chia thành nhiều buổi trong ngày. Nếu hết giờ mà chưa xong, ghi rõ phần còn lại; không chuyển sang Ngày 2 chỉ vì lịch đã qua một ngày.

## 4. Tài liệu cần đọc, miễn phí

1. [MDN — Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types): đọc phần declarations, scope và data types, khoảng 20 phút.
2. [MDN — Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects): tập trung tạo object, thuộc tính và so sánh object, khoảng 20 phút.
3. [MDN — Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax): đọc shallow copy của array/object, khoảng 15 phút.
4. [Node — Assert](https://nodejs.org/api/assert.html): tra `equal`, `deepEqual`, `throws` trong strict mode khi thực hành, khoảng 5 phút.

Không cần đọc hết các trang. Có thể dịch đoạn khó sang tiếng Việt, giữ nguyên tên API và tự viết lại bằng lời của mình. Video là tùy chọn trong phiên đọc; hôm nay không cần thêm một khóa học.

## 5. Kiến thức cốt lõi — đọc sau khi đã dự đoán

### 5.1. Primitive và object

Primitive gồm `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Array và function cũng thuộc nhóm object. Với phép gán thông thường, JavaScript sao chép giá trị; khi giá trị đó là reference đến object, hai biến có thể cùng trỏ tới một object.

```js
let firstLabel = 'Book';
let secondLabel = firstLabel;
secondLabel = 'Pen';
```

Việc gán lại `secondLabel` không thay binding `firstLabel`. Với object, cần phân biệt thao tác đổi object đang được dùng chung với thao tác gán một biến sang object khác.

```js
const firstAddress = { city: 'Ha Noi' };
const secondAddress = firstAddress;
secondAddress.city = 'Da Nang';
```

Hai binding ở ví dụ sau cùng tham chiếu một object, nên mutation qua một binding có thể được quan sát qua binding còn lại. [MDN — Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects).

**Điểm cần nói chính xác:** JavaScript truyền tham số bằng giá trị. Khi đối số là object, giá trị được sao chép là reference. Gán lại parameter không tự gán lại biến của người gọi, nhưng mutation lên object dùng chung vẫn có thể ảnh hưởng bên ngoài. Đừng học thuộc câu “object truyền tham chiếu” rồi bỏ qua hai thao tác khác nhau này.

### 5.2. `const`, mutation và reassignment

- **Binding:** liên kết giữa tên biến và giá trị.
- **Reassignment:** gán một giá trị khác vào binding, ví dụ `count = 2`.
- **Mutation:** thay đổi object hiện có, ví dụ `profile.name = 'An'` hoặc `items.push(item)`.

`const` ngăn reassignment của binding. Nó không tự ngăn việc thay đổi thuộc tính của object hoặc phần tử array. [MDN — Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types).

**WHY:** một biến được khai báo `const` vẫn có thể dẫn đến dữ liệu dùng chung bị thay đổi.

**HOW:** xác định chính xác dòng nào thay binding, dòng nào thay object.

**TRADE-OFF:** mutation có thể phù hợp với state nội bộ được kiểm soát, nhưng làm dữ liệu chia sẻ khó theo dõi hơn.

**WHEN:** với hàm cập nhật dữ liệu trong bài hôm nay, quy ước trả dữ liệu mới để người gọi kiểm tra được input cũ còn nguyên.

### 5.3. Shallow copy và structural sharing

```js
const original = {
  label: 'Notebook',
  details: { color: 'blue' },
};
const copy = { ...original };
```

`copy` là object cấp ngoài mới, nhưng `copy.details` vẫn dùng chung object lồng với `original.details`. Spread array cũng chỉ tạo array cấp ngoài mới; các object phần tử có thể vẫn được chia sẻ. [MDN — Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

Nếu cần đổi dữ liệu lồng nhau mà giữ input nguyên vẹn, tạo bản mới cho các tầng nằm trên đường thay đổi. Những nhánh không thay đổi có thể tiếp tục dùng chung reference; đó là structural sharing. Đừng deep clone mọi thứ theo phản xạ: vừa tốn công/bộ nhớ, vừa che đi việc chưa xác định đúng phần cần thay đổi.

Trong hàm chỉ đọc như `filterInStock`, trả array mới nhưng giữ reference của product gốc là hợp lệ. Nếu sau đó muốn sửa một product, cần sao chép product đó ở hàm cập nhật.

### 5.4. Block scope

`let` và `const` có scope theo block. Biến được khai báo trong một block có thể che tên biến bên ngoài; thay giá trị của biến bên trong không đồng nghĩa thay biến bên ngoài. Hôm nay chỉ cần quan sát bằng breakpoint và giải thích case scope. Hoisting, TDZ và scope chain sẽ đi sâu sau. [MDN — Grammar and types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types).

## 6. Cách dùng debugger

Nếu dùng VS Code hoặc editor có JavaScript debugger: đặt breakpoint trước dòng thay dữ liệu, chạy file với argument của case. Quan sát biến trước/sau dòng đó, dùng Step Over để đi từng bước.

Một cách khác là dừng Node trước khi chạy case rồi kết nối debugger:

```powershell
node --inspect-brk Week1/Day1/predict.mjs 5
```

Nếu chưa kết nối được debugger, ghi các giá trị primitive như `stock` và biểu thức `a === b` trước/sau thay đổi để kiểm chứng. Không cần dành cả buổi cấu hình editor.

## 7. Mini project: Product Utilities

File làm bài: [products.mjs](./products.mjs). Dữ liệu mẫu: [fixtures.mjs](./fixtures.mjs), có năm sản phẩm. Mỗi lần gọi `makeProducts()` trả bộ dữ liệu mới, tránh bài kiểm tra trước ảnh hưởng bài sau.

Một sản phẩm có dạng:

```js
{
  id: 'p001',
  name: 'Mechanical Keyboard',
  priceMinor: 890000,
  stock: 10,
  metadata: { category: 'peripherals', tags: ['usb', 'office'] },
}
```

Trong bài này quy ước `priceMinor` là số nguyên theo đơn vị 1 VND. Input sản phẩm mẫu có ID duy nhất, giá hợp lệ và tổng tiền nằm trong miền số nguyên an toàn. Hôm nay chưa làm thuế, giảm giá, API, lưu database hay đặt hàng thật.

### Hàm 1 — `findProductById(products, id)`

- Trả đúng object product khi tìm thấy; không cần copy object chỉ để đọc.
- Không có ID hoặc array rỗng: trả `undefined`.
- Không sửa array/product đầu vào.

### Hàm 2 — `filterInStock(products)`

- Trả array mới chứa product có `stock > 0`, giữ thứ tự đầu vào.
- Array rỗng trả array rỗng.
- Không sửa input; được phép giữ reference của các product được chọn.

### Hàm 3 — `calculateTotal(products, items)`

```js
const items = [
  { productId: 'p001', quantity: 2 },
  { productId: 'p003', quantity: 1 },
];
```

- Tính tổng từ giá trong `products`: tổng `priceMinor × quantity`.
- Giỏ rỗng trả `0`. Nếu cùng ID xuất hiện ở nhiều dòng thì cộng tất cả dòng.
- ID không có: throw `RangeError`.
- Quantity phải là số nguyên an toàn lớn hơn `0`; âm, `0`, số lẻ, `NaN`, chuỗi hoặc quá miền số nguyên an toàn: throw `RangeError`.
- Không sửa `products` hoặc `items`.
- Đây là hàm tính tổng; chưa kiểm tra/trừ tồn kho và chưa thay thế checkout nghiệp vụ.

### Hàm 4 — `updateProductStock(products, id, nextStock)`

- `nextStock` là tồn kho mới tuyệt đối, không phải lượng tăng/giảm.
- Tồn kho mới phải là số nguyên an toàn `>= 0`, không hợp lệ thì throw `RangeError`.
- ID không có: throw `RangeError`.
- Trả array mới; product mục tiêu cũng là object mới, kể cả khi giá trị stock không đổi.
- Product không được cập nhật giữ nguyên reference. Metadata không đổi có thể dùng chung reference.
- Input cũ không bị thay đổi.

### Bài mở rộng — `updateProductCategory(products, id, nextCategory)`

Chỉ làm sau bốn hàm bắt buộc. `nextCategory` là string không rỗng sau trim; lưu giá trị đã trim. ID không có hoặc category không hợp lệ thì throw `RangeError`.

Trả array mới, product mục tiêu mới và metadata mới. Giữ nguyên input, giữ reference của product khác và `tags` vì chúng không đổi. Mục tiêu là luyện copy đúng tầng, không phải clone toàn bộ cây dữ liệu.

### Chạy kiểm tra

```powershell
node Week1/Day1/check.mjs find
node Week1/Day1/check.mjs filter
node Week1/Day1/check.mjs total
node Week1/Day1/check.mjs stock
node Week1/Day1/check.mjs
```

Bốn hàm bắt buộc đã hoàn thành và đạt bộ check. Mỗi lệnh chỉ kiểm tra yêu cầu của nhóm đã chọn; lệnh cuối chạy bốn nhóm bắt buộc. Bonus còn TODO và sẽ báo chưa đạt nếu chạy riêng:

```powershell
node Week1/Day1/check.mjs category
```

Bạn có thể đọc file check để hiểu yêu cầu. Không sửa kỳ vọng chỉ để có kết quả xanh; nếu thấy yêu cầu mâu thuẫn, ghi lại để review. [my-checks.mjs](./my-checks.mjs) đã có bốn tình huống do trợ lý bổ sung; bạn vẫn có thể tự thêm ít nhất hai kiểm tra để luyện cách nghĩ tình huống biên. Chạy file bằng:

```powershell
node Week1/Day1/my-checks.mjs
```

Không cần cài package. `.mjs` giúp các file dùng ES Module mà không cần tạo package.json.

## 8. Self-check và tiêu chí hoàn thành

Trả lời không nhìn tài liệu, có ví dụ của riêng bạn:

1. Vì sao object khai báo bằng `const` vẫn sửa thuộc tính được?
2. Vì sao `[...products]` chưa đủ để an toàn khi sửa `copy[0].stock`?
3. Gán lại parameter object khác mutation thuộc tính của nó thế nào?
4. Làm sao kiểm chứng hai biến đang cùng tham chiếu một object?
5. Khi cập nhật category, cần tạo mới những tầng nào và có thể giữ nguyên tầng nào?

**Hoàn thành khi:**

- [ ] Đã ghi dự đoán trước khi chạy đủ 10 câu; giữ lại câu trả lời sai để thấy cách sửa suy nghĩ.
- [x] Bốn hàm bắt buộc đạt toàn bộ nhóm check tương ứng.
- [ ] Có ít nhất hai assertion tự bổ sung, kiểm tra được một tình huống có ý nghĩa.
- [ ] Giải thích được một lỗi mutation/shallow copy và chứng minh input cũ còn nguyên sau sửa.
- [ ] Tự trả lời được ít nhất 4/5 câu self-check bằng ví dụ.
- [x] Tổng hợp submission từ bài trả lời và kết quả chạy; ghi rõ phần trợ lý hỗ trợ và phần còn vướng.
- [ ] Bổ sung thời gian học thực tế; chưa có dữ liệu để điền số giờ.

Bonus không phải điều kiện sang Ngày 2. Nếu phần bắt buộc mất quá thời lượng, dừng thêm chức năng và ghi phần mắc để được hỗ trợ.

## 9. Gửi bài để review

Điền [submission.md](./submission.md), giữ code ở các file làm bài và gửi trong chat:

> Review Tuần 1 — Ngày 1. Mình đã hoàn thành bài trong Week1/Day1; hãy kiểm tra code, cách giải thích và chỉ ra phần cần sửa trước Ngày 2.

Người học đã yêu cầu lưu kết quả Ngày 1 bằng commit `hoàn thành ngày 1` và push lên nhánh hiện tại. Kết quả thao tác Git được xác nhận trong phản hồi sau khi thực hiện.
