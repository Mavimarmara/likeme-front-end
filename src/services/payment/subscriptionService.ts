import apiClient from '@/services/infrastructure/apiClient';
import type { ApiResponse } from '@/types/infrastructure';

export type SubscriptionBillingPeriod =
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'BIMONTHLY'
  | 'QUARTERLY'
  | 'SEMIANNUAL'
  | 'YEARLY';

export interface CreateProtocolSubscriptionRequest {
  productId: string;
  billingPeriod: SubscriptionBillingPeriod;
  cardData: {
    cardNumber: string;
    cardHolderName: string;
    cardExpirationDate: string;
    cardCvv: string;
    cpf?: string;
    phone?: string;
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
  programTitle?: string;
}

export interface CreateProtocolSubscriptionResponse {
  orderId: string;
  subscriptionId: string;
  billingId: string;
  externalSubscriptionId: string;
  subscriptionStatus: string;
  internalSubscriptionStatus: string;
  nextBillingAt?: string | null;
}

export interface ProtocolAccessResponse {
  hasAccess: boolean;
  subscription: unknown | null;
}

class SubscriptionService {
  async createProtocolSubscription(
    data: CreateProtocolSubscriptionRequest,
  ): Promise<ApiResponse<CreateProtocolSubscriptionResponse>> {
    return apiClient.post<ApiResponse<CreateProtocolSubscriptionResponse>>('/api/payment/subscriptions', data, true);
  }

  async getProtocolAccess(productId: string): Promise<ApiResponse<ProtocolAccessResponse>> {
    return apiClient.get<ApiResponse<ProtocolAccessResponse>>(
      `/api/payment/subscriptions/access?productId=${encodeURIComponent(productId)}`,
    );
  }

  async getSubscription(subscriptionId: string): Promise<ApiResponse<unknown>> {
    return apiClient.get<ApiResponse<unknown>>(`/api/payment/subscriptions/${encodeURIComponent(subscriptionId)}`);
  }
}

export const subscriptionService = new SubscriptionService();
