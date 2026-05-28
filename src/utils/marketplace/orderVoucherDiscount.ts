export function orderVoucherDiscountAmount(order: { voucherDiscount?: unknown }): number {
  const raw = order.voucherDiscount;
  const parsed = typeof raw === 'string' ? parseFloat(raw) : Number(raw ?? 0);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }
  return parsed;
}
