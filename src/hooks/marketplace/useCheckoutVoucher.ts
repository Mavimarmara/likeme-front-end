import { useState, useCallback, useRef, useEffect } from 'react';
import { voucherCheckoutService } from '@/services/voucher/voucherCheckoutService';
import type { VoucherCheckoutPreview } from '@/types/voucher/checkout';

export type ApplyCheckoutVoucherInput = {
  subtotal: number;
  shippingCost: number;
};

export function useCheckoutVoucher() {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedPreview, setAppliedPreview] = useState<VoucherCheckoutPreview | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const appliedPreviewRef = useRef(appliedPreview);

  useEffect(() => {
    appliedPreviewRef.current = appliedPreview;
  }, [appliedPreview]);

  const onCouponCodeChange = useCallback((text: string) => {
    setCouponCode(text);
    setCouponError(null);
    const current = appliedPreviewRef.current;
    if (current && text.trim().toUpperCase() !== current.code.toUpperCase()) {
      setAppliedPreview(null);
    }
  }, []);

  const applyCoupon = useCallback(
    async ({ subtotal, shippingCost }: ApplyCheckoutVoucherInput, fallbackErrorMessage: string) => {
      const code = couponCode.trim();
      if (!code) {
        return;
      }

      setIsValidating(true);
      setCouponError(null);

      try {
        const preview = await voucherCheckoutService.validateForCheckout({
          code,
          subtotal,
          shippingCost,
        });
        setAppliedPreview(preview);
        setCouponCode(preview.code);
      } catch (error) {
        setAppliedPreview(null);
        const message = error instanceof Error && error.message.trim() ? error.message.trim() : fallbackErrorMessage;
        setCouponError(message);
      } finally {
        setIsValidating(false);
      }
    },
    [couponCode],
  );

  const removeCoupon = useCallback(() => {
    setAppliedPreview(null);
    setCouponError(null);
    setCouponCode('');
  }, []);

  const syncAppliedWithAmounts = useCallback(
    async ({ subtotal, shippingCost }: ApplyCheckoutVoucherInput, fallbackErrorMessage: string) => {
      const current = appliedPreviewRef.current;
      if (!current) {
        return;
      }

      setIsValidating(true);
      setCouponError(null);

      try {
        const preview = await voucherCheckoutService.validateForCheckout({
          code: current.code,
          subtotal,
          shippingCost,
        });
        setAppliedPreview(preview);
        setCouponCode(preview.code);
      } catch (error) {
        setAppliedPreview(null);
        const message = error instanceof Error && error.message.trim() ? error.message.trim() : fallbackErrorMessage;
        setCouponError(message);
      } finally {
        setIsValidating(false);
      }
    },
    [],
  );

  return {
    couponCode,
    couponError,
    appliedPreview,
    isValidating,
    onCouponCodeChange,
    applyCoupon,
    removeCoupon,
    syncAppliedWithAmounts,
  };
}
