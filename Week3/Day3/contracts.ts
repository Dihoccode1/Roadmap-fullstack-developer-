// Chỉ dùng với compiler. Các @ts-expect-error là input sai cố ý, không phải cách giải bài.
import { isCartItem, parseCartItems, setCartQuantity, createCart } from './exercises.ts';
import type { CartItem, CartSummary, Cart } from './exercises.ts';

function verifyContracts(value: unknown) {
  const item: CartItem = { product: { id: 'p1', name: 'Book', priceInCents: 100 }, quantity: 1 };
  const guard: (input: unknown) => input is CartItem = isCartItem;
  const parsed: readonly CartItem[] = parseCartItems(value);
  const updated: CartItem[] = setCartQuantity(parsed, 'p1', 2);
  const cart: Cart = createCart(value);
  const snapshot: readonly CartItem[] = cart.getItems();
  const summary: CartSummary = cart.setQuantity('p1', 0);
  const current: CartSummary = cart.getSummary();
  void [guard, updated, snapshot, summary, current];
  if (isCartItem(value)) {
    const cents: number = value.product.priceInCents;
    const quantity: number = value.quantity;
    void [cents, quantity];
  }
  // @ts-expect-error unknown chưa narrow thì không đọc được product.
  value.product;
  // @ts-expect-error parse trả readonly array, không được push.
  parsed.push(item);
  // @ts-expect-error snapshot là readonly array.
  snapshot.pop();
  // @ts-expect-error Quantity là readonly property.
  item.quantity = 2;
  // @ts-expect-error ID phải là string.
  setCartQuantity(parsed, 123, 2);
  // @ts-expect-error Quantity phải là number.
  setCartQuantity(parsed, 'p1', '2');
  // @ts-expect-error API Cart.setQuantity cũng giữ hợp đồng kiểu.
  cart.setQuantity('p1', '2');
}

void verifyContracts;
