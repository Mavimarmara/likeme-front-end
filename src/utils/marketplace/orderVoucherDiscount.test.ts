import { orderVoucherDiscountAmount } from './orderVoucherDiscount';

describe('orderVoucherDiscountAmount', () => {
  it('retorna zero quando ausente ou inválido', () => {
    expect(orderVoucherDiscountAmount({})).toBe(0);
    expect(orderVoucherDiscountAmount({ voucherDiscount: 'abc' })).toBe(0);
    expect(orderVoucherDiscountAmount({ voucherDiscount: 0 })).toBe(0);
  });

  it('parseia número e string decimal', () => {
    expect(orderVoucherDiscountAmount({ voucherDiscount: 20 })).toBe(20);
    expect(orderVoucherDiscountAmount({ voucherDiscount: '15.5' })).toBe(15.5);
  });
});
