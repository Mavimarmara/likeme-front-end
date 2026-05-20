import apiClient from '@/services/infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type { ApiResponse } from '@/types/infrastructure';
import type { ValidateVoucherCheckoutInput, VoucherCheckoutPreview } from '@/types/voucher/checkout';

type ValidateVoucherApiData = {
  preview: VoucherCheckoutPreview;
};

class VoucherCheckoutService {
  private readonly validateEndpoint = '/api/vouchers/validate';

  async validateForCheckout(input: ValidateVoucherCheckoutInput): Promise<VoucherCheckoutPreview> {
    try {
      const response = await apiClient.post<ApiResponse<ValidateVoucherApiData>>(
        this.validateEndpoint,
        {
          code: input.code.trim(),
          subtotal: input.subtotal,
          shippingCost: input.shippingCost,
        },
        true,
      );

      const preview = response.data?.preview;
      if (!response.success || !preview) {
        throw new Error(response.message?.trim() || 'Não foi possível validar o cupom');
      }

      return preview;
    } catch (error) {
      logger.error('[VoucherCheckoutService] validateForCheckout failed', {
        code: input.code,
        subtotal: input.subtotal,
        shippingCost: input.shippingCost,
        cause: error,
      });
      throw error;
    }
  }
}

export const voucherCheckoutService = new VoucherCheckoutService();
