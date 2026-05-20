import { checkoutDisplayAmounts } from '@/utils/marketplace/checkoutDisplayAmounts';

describe('checkoutDisplayAmounts', () => {
  it('calcula total sem cupom', () => {
    const result = checkoutDisplayAmounts({
      subtotal: 100,
      shipping: 15,
      showShipping: true,
      appliedVoucher: null,
    });

    expect(result).toEqual({
      shipping: 15,
      voucherDiscount: 0,
      total: 115,
    });
  });

  it('usa valores do preview quando cupom aplicado', () => {
    const result = checkoutDisplayAmounts({
      subtotal: 200,
      shipping: 20,
      showShipping: true,
      appliedVoucher: {
        voucherId: 'v1',
        code: 'SAVE10',
        type: 'PERCENTAGE',
        subtotal: 200,
        shippingCost: 20,
        voucherDiscount: 20,
        total: 200,
        freeShippingApplied: false,
      },
    });

    expect(result).toEqual({
      shipping: 20,
      voucherDiscount: 20,
      total: 200,
    });
  });

  it('oculta frete no resumo quando showShipping é false', () => {
    const result = checkoutDisplayAmounts({
      subtotal: 80,
      shipping: 25,
      showShipping: false,
      appliedVoucher: {
        voucherId: 'v2',
        code: 'FRETE',
        type: 'FREE_SHIPPING',
        subtotal: 80,
        shippingCost: 0,
        voucherDiscount: 0,
        total: 80,
        freeShippingApplied: true,
      },
    });

    expect(result.shipping).toBe(0);
    expect(result.total).toBe(80);
  });
});
