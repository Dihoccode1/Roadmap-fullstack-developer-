// Đọc case rồi ghi dự đoán vào submission.md trước khi chạy.
// Chạy từng câu: node Week1/Day1/predict.mjs 1

const cases = [
  {
    title: 'Primitive assignment',
    run() {
      let price = 100;
      let copiedPrice = price;
      copiedPrice = 250;
      console.log(price, copiedPrice);
    },
  },
  {
    title: 'Object alias',
    run() {
      const product = { stock: 5 };
      const selected = product;
      selected.stock = 2;
      console.log(product.stock, selected.stock);
      console.log(product === selected);
    },
  },
  {
    title: 'Const and mutation',
    run() {
      const cart = [];
      cart.push('p001');
      cart.push('p002');
      console.log(cart.length, cart[0]);
    },
  },
  {
    title: 'Const and reassignment',
    run() {
      const product = { stock: 3 };
      console.log(product.stock);
      product = { stock: 8 };
      console.log(product.stock);
    },
  },
  {
    title: 'Array spread',
    run() {
      const products = [{ id: 'p001', stock: 4 }];
      const copy = [...products];
      copy[0].stock = 0;
      copy.push({ id: 'p002', stock: 9 });
      console.log(products.length, copy.length);
      console.log(products[0].stock);
      console.log(products === copy, products[0] === copy[0]);
    },
  },
  {
    title: 'Object spread and a nested object',
    run() {
      const product = { stock: 5, metadata: { category: 'books' } };
      const copy = { ...product };
      copy.stock = 0;
      copy.metadata.category = 'stationery';
      console.log(product.stock, copy.stock);
      console.log(product.metadata.category);
      console.log(product === copy, product.metadata === copy.metadata);
    },
  },
  {
    title: 'Block scope',
    run() {
      let stock = 10;
      {
        let stock = 3;
        stock += 2;
        console.log(stock);
      }
      console.log(stock);
    },
  },
  {
    title: 'A function parameter',
    run() {
      const product = { stock: 10 };
      function change(selected) {
        selected.stock = 6;
        selected = { stock: 99 };
        console.log(selected.stock);
      }
      change(product);
      console.log(product.stock);
    },
  },
  {
    title: 'Copy the changed item',
    run() {
      const products = [
        { id: 'p001', stock: 5, metadata: { category: 'books' } },
        { id: 'p002', stock: 8, metadata: { category: 'games' } },
      ];
      const updated = products.map((product) =>
        product.id === 'p001' ? { ...product, stock: 2 } : product,
      );
      console.log(products[0].stock, updated[0].stock);
      console.log(products === updated);
      console.log(products[0] === updated[0]);
      console.log(products[1] === updated[1]);
      console.log(products[0].metadata === updated[0].metadata);
    },
  },
  {
    title: 'Equality and identity',
    run() {
      const first = { id: 'p001' };
      const second = { id: 'p001' };
      const alias = first;
      console.log(first === second);
      console.log(first === alias);
      console.log(first.id === second.id);
      console.log([] === []);
    },
  },
];

const argument = process.argv[2];
const number = Number(argument);

if (argument === undefined) {
  console.log('Ghi dự đoán trước, sau đó chọn một câu từ 1 đến 10:');
  console.log('node Week1/Day1/predict.mjs 1');
} else if (!Number.isInteger(number) || number < 1 || number > cases.length) {
  console.error('Số câu phải là số nguyên từ 1 đến 10.');
  process.exitCode = 1;
} else {
  const selected = cases[number - 1];
  console.log(`Câu ${number}: ${selected.title}`);
  try {
    selected.run();
  } catch (error) {
    console.log(`Exception: ${error.name}`);
    console.log('Đối chiếu dòng gây lỗi với dự đoán của bạn.');
  }
}
