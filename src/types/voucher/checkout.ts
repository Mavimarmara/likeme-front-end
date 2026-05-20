export type VoucherType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';

export type VoucherCheckoutPreview = {
  voucherId: string;
  code: string;
  type: VoucherType;
  subtotal: number;
  shippingCost: number;
  voucherDiscount: number;
  total: number;
  freeShippingApplied: boolean;
};

export type ValidateVoucherCheckoutInput = {
  code: string;
  subtotal: number;
  shippingCost: number;
};
