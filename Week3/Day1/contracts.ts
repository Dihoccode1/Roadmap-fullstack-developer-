// Chỉ dùng với tsc, không chạy file này. Các dòng @ts-expect-error là ca kiểm tra âm
// được cung cấp sẵn: compiler phải từ chối input sai. Không chép chúng sang bài làm.
import { calculateLineTotal, applyDiscount, getDisplayName, summarizeCart } from './exercises.ts';
import type { Product, UserProfile, CartItem, CartSummary } from './exercises.ts';

function verifyContracts() {
  const product: Product = { id: 'p1', name: 'Book', priceInCents: 105 };
  const profile: UserProfile = { username: 'linh' };
  const items: readonly CartItem[] = [{ product, quantity: 2 }];
  const total: number = calculateLineTotal(105, 2);
  const discounted: Product = applyDiscount(product, 10);
  const displayName: string = getDisplayName(profile);
  const summary: CartSummary = summarizeCart(items);
  void [total, discounted, displayName, summary];

  // @ts-expect-error Giá phải là number, không phải string.
  calculateLineTotal('105', 2);
  // @ts-expect-error Số lượng phải là number.
  calculateLineTotal(105, '2');
  // @ts-expect-error Product thiếu name.
  applyDiscount({ id: 'p1', priceInCents: 100 }, 10);
  // @ts-expect-error Phần trăm phải là number.
  applyDiscount(product, '10');
  // @ts-expect-error Profile bắt buộc có username.
  getDisplayName({ displayName: 'Linh' });
  // @ts-expect-error displayName nếu có phải là string.
  getDisplayName({ username: 'linh', displayName: 123 });
  // @ts-expect-error Quantity của một dòng phải là number.
  summarizeCart([{ product, quantity: '2' }]);
  // @ts-expect-error readonly array không được push.
  items.push({ product, quantity: 1 });
  // @ts-expect-error Product fields là readonly.
  product.priceInCents = 200;
}

void verifyContracts;
