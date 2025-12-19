import apiClient from '../infrastructure/apiClient';
import type { ApiResponse } from '@/types/infrastructure';

export interface ProcessPaymentRequest {
  orderId: string;
  cardData: {
    cardNumber: string;
    cardHolderName: string;
    cardExpirationDate: string; // MMYY format
    cardCvv: string;
  };
  billingAddress: {
    country?: string;
    state: string;
    city: string;
    neighborhood?: string;
    street: string;
    streetNumber: string;
    zipcode: string;
    complement?: string;
  };
}

export interface ProcessPaymentResponse {
  order: any;
  transaction: {
    id: string;
    status: string;
    authorizationCode?: string;
  };
}

export interface TransactionStatusResponse {
  id: string;
  status: string;
  amount: number;
  authorizationCode?: string;
}

export interface CapturePaymentRequest {
  amount?: number; // in reais
}

export interface RefundPaymentRequest {
  amount?: number; // in reais
}

class PaymentService {
  /**
   * Process payment for an order
   */
  async processPayment(data: ProcessPaymentRequest): Promise<ApiResponse<ProcessPaymentResponse>> {
    return apiClient.post<ApiResponse<ProcessPaymentResponse>>(
      '/api/payment/process',
      data
    );
  }

  /**
   * Get payment transaction status
   */
  async getTransactionStatus(transactionId: string): Promise<ApiResponse<TransactionStatusResponse>> {
    return apiClient.get<ApiResponse<TransactionStatusResponse>>(
      `/api/payment/status/${transactionId}`
    );
  }

  /**
   * Capture an authorized transaction
   */
  async captureTransaction(
    transactionId: string,
    data?: CapturePaymentRequest
  ): Promise<ApiResponse<{ id: string; status: string }>> {
    return apiClient.post<ApiResponse<{ id: string; status: string }>>(
      `/api/payment/capture/${transactionId}`,
      data
    );
  }

  /**
   * Refund a payment
   */
  async refundTransaction(
    transactionId: string,
    data?: RefundPaymentRequest
  ): Promise<ApiResponse<{ id: string; status: string }>> {
    return apiClient.post<ApiResponse<{ id: string; status: string }>>(
      `/api/payment/refund/${transactionId}`,
      data
    );
  }
}

export default new PaymentService();
