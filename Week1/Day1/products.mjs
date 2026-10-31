// Đây là file BẠN làm bài. Đọc contract trong README.md trước khi viết.
// Các TODO chủ động throw để không bị hiểu nhầm là đã có lời giải.

export function findProductById(products, id) {
  // TODO: tìm product hoặc trả undefined; không sửa input.
  throw new Error('TODO: findProductById');
}

export function filterInStock(products) {
  // TODO: array mới gồm product có stock > 0; giữ thứ tự.
  throw new Error('TODO: filterInStock');
}

export function calculateTotal(products, items) {
  // TODO: tổng tiền; validate quantity và productId theo README.
  throw new Error('TODO: calculateTotal');
}

export function updateProductStock(products, id, nextStock) {
  // TODO: cập nhật bất biến, kiểm tra nextStock và productId.
  throw new Error('TODO: updateProductStock');
}

// BONUS: không bắt buộc hoàn thành hôm nay.
export function updateProductCategory(products, id, nextCategory) {
  // TODO: tạo mới đúng các tầng cần đổi; không sửa metadata input.
  throw new Error('TODO: updateProductCategory');
}
