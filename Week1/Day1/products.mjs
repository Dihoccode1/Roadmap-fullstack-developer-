// Bốn hàm bắt buộc của Ngày 1; contract nằm trong README.md.
// Bonus được giữ riêng để tiếp tục luyện copy object lồng nhau.

export function findProductById(products, id) {
  // find tự trả undefined nếu không có sản phẩm tương ứng.
  const product = products.find((p) => p.id === id);
  return product;
}

export function filterInStock(products) {
  // Tạo array mới; chỉ đọc và giữ nguyên object sản phẩm.
  return products.filter((p) => p.stock > 0);
}

export function calculateTotal(products, items) {
  // Lấy giá từ danh mục sản phẩm, kiểm tra quantity trước khi cộng.
  let total = 0;

  for (const item of items) {
    if (!Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
      throw new RangeError("Quantity must be a positive safe integer");
    }

    const product = findProductById(products, item.productId);

    if (!product) {
      throw new RangeError("Product not found");
    }

    total += product.priceMinor * item.quantity;
  }

  return total;
}

export function updateProductStock(products, id, nextStock) {
  // Tạo bản mới cho array và sản phẩm cần sửa; giữ nguyên input.
  if (!Number.isSafeInteger(nextStock) || nextStock < 0) {
    throw new RangeError("Stock must be a non-negative safe integer");
  }

  const existingProduct = findProductById(products, id);

  if (!existingProduct) {
    throw new RangeError("Product not found");
  }

  return products.map((product) => {
    if (product.id === id) {
      return {
        ...product,
        stock: nextStock,
      };
    }

    return product;
  });
}

// BONUS: không bắt buộc hoàn thành hôm nay.
export function updateProductCategory(products, id, nextCategory) {
  // TODO: tạo mới đúng các tầng cần đổi; không sửa metadata input.
  throw new Error("TODO: updateProductCategory");
}
