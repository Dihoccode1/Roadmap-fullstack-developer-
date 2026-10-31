// Factory: mỗi lần gọi tạo dữ liệu mới, kể cả metadata và tags.
export function makeProducts() {
  return [
    {
      id: 'p001',
      name: 'Mechanical Keyboard',
      priceMinor: 890000,
      stock: 10,
      metadata: { category: 'peripherals', tags: ['usb', 'office'] },
    },
    {
      id: 'p002',
      name: 'Wireless Mouse',
      priceMinor: 350000,
      stock: 0,
      metadata: { category: 'peripherals', tags: ['wireless'] },
    },
    {
      id: 'p003',
      name: 'Notebook',
      priceMinor: 45000,
      stock: 25,
      metadata: { category: 'stationery', tags: ['paper'] },
    },
    {
      id: 'p004',
      name: 'USB-C Cable',
      priceMinor: 120000,
      stock: 7,
      metadata: { category: 'accessories', tags: ['usb-c'] },
    },
    {
      id: 'p005',
      name: 'Laptop Stand',
      priceMinor: 450000,
      stock: 0,
      metadata: { category: 'accessories', tags: ['desk'] },
    },
  ];
}
