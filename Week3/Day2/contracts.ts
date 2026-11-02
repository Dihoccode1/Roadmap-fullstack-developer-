// Ca kiểm tra kiểu do bài học cung cấp, chỉ chạy bằng compiler; không chạy file này.
import { normalizeProductId, isProduct, parseProduct, getProductStateMessage } from './exercises.ts';
import type { Product, ProductState } from './exercises.ts';

function verifyContracts(value: unknown, state: ProductState) {
  const fromString: string = normalizeProductId('p1');
  const fromNumber: string = normalizeProductId(0);
  const parsed: Product = parseProduct(value);
  const message: string = getProductStateMessage(state);
  const guard: (input: unknown) => input is Product = isProduct;
  void [fromString, fromNumber, parsed, message, guard];

  if (isProduct(value)) {
    const checked: Product = value;
    const cents: number = value.priceInCents;
    void [checked, cents];
  }

  // @ts-expect-error Không đọc field của unknown trước narrowing.
  value.priceInCents;
  // @ts-expect-error boolean không nằm trong union ID.
  normalizeProductId(true);
  // @ts-expect-error null không nằm trong union ID.
  normalizeProductId(null);
  // @ts-expect-error success bắt buộc có data.
  getProductStateMessage({ status: 'success' });
  // @ts-expect-error error phải có Error, không phải string.
  getProductStateMessage({ status: 'error', error: 'Offline' });
  // @ts-expect-error status không được tự thêm ngoài union.
  getProductStateMessage({ status: 'cancelled' });
  // @ts-expect-error Chưa narrow status thì không phải nhánh nào cũng có data.
  state.data;

  if (state.status === 'success') {
    const product: Product = state.data;
    void product;
    // @ts-expect-error Nhánh success không có error.
    state.error;
  }
}

void verifyContracts;
