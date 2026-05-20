import type { VoucherCheckoutPreview } from '@/types/voucher/checkout';

export type CheckoutDisplayAmountsInput = {
  subtotal: number;
  shipping: number;
  showShipping: boolean;
  appliedVoucher: VoucherCheckoutPreview | null;
};

export type CheckoutDisplayAmounts = {
  shipping: number;
  voucherDiscount: number;
  total: number;
};

export function checkoutDisplayAmounts(input: CheckoutDisplayAmountsInput): CheckoutDisplayAmounts {
  const { subtotal, shipping, showShipping, appliedVoucher } = input;

  if (!appliedVoucher) {
    const shippingAmount = showShipping ? shipping : 0;
    return {
      shipping: shippingAmount,
      voucherDiscount: 0,
      total: subtotal + shippingAmount,
    };
  }

  return {
    shipping: showShipping ? appliedVoucher.shippingCost : 0,
    voucherDiscount: appliedVoucher.voucherDiscount,
    total: appliedVoucher.total,
  };
}
