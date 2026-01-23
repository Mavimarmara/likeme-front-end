import apiClient from '../infrastructure/apiClient';
import { logger } from '@/utils/logger';
import type {
  Order,
  ListOrdersParams,
  ListOrdersApiResponse,
  GetOrderApiResponse,
  CreateOrderData,
  UpdateOrderData,
} from '@/types/order';
import type { ApiResponse } from '@/types/infrastructure';

class OrderService {
  private readonly ordersEndpoint = '/api/orders';

  async createOrder(data: CreateOrderData): Promise<ApiResponse<Order>> {
    try {
      const response = await apiClient.post<ApiResponse<Order>>(this.ordersEndpoint, data, true);

      logger.debug('Order created:', {
        orderId: response.data?.id,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error creating order:', error);
      throw error;
    }
  }

  async listOrders(params: ListOrdersParams = {}): Promise<ListOrdersApiResponse> {
    try {
      const queryParams: Record<string, string> = {};

      if (params.page !== undefined) {
        queryParams.page = String(params.page);
      }

      if (params.limit !== undefined) {
        queryParams.limit = String(params.limit);
      }

      if (params.userId) {
        queryParams.userId = params.userId;
      }

      if (params.status) {
        queryParams.status = params.status;
      }

      if (params.paymentStatus) {
        queryParams.paymentStatus = params.paymentStatus;
      }

      const response = await apiClient.get<ListOrdersApiResponse>(
        this.ordersEndpoint,
        queryParams,
        true,
        false
      );

      logger.debug('Orders list response:', {
        page: params.page,
        limit: params.limit,
        success: response.success,
        ordersCount: response.data?.orders?.length || 0,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching orders list:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<GetOrderApiResponse> {
    try {
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }

      const endpoint = `${this.ordersEndpoint}/${orderId.trim()}`;

      const response = await apiClient.get<GetOrderApiResponse>(endpoint, undefined, true, false);

      logger.debug('Order detail response:', {
        orderId,
        success: response.success,
        hasData: !!response.data,
      });

      return response;
    } catch (error) {
      logger.error('Error fetching order detail:', error);
      throw error;
    }
  }

  async updateOrder(orderId: string, data: UpdateOrderData): Promise<ApiResponse<Order>> {
    try {
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }

      const endpoint = `${this.ordersEndpoint}/${orderId.trim()}`;

      const response = await apiClient.put<ApiResponse<Order>>(endpoint, data, true);

      logger.debug('Order updated:', {
        orderId,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(orderId: string, restoreStock = false): Promise<ApiResponse<null>> {
    try {
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }

      const endpoint = `${this.ordersEndpoint}/${orderId.trim()}`;

      const response = await apiClient.delete<ApiResponse<null>>(endpoint, { restoreStock }, true);

      logger.debug('Order deleted:', {
        orderId,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error deleting order:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    try {
      if (!orderId || orderId.trim() === '') {
        throw new Error('Order ID is required');
      }

      const endpoint = `${this.ordersEndpoint}/${orderId.trim()}/cancel`;

      const response = await apiClient.post<ApiResponse<Order>>(endpoint, {}, true);

      logger.debug('Order cancelled:', {
        orderId,
        success: response.success,
      });

      return response;
    } catch (error) {
      logger.error('Error cancelling order:', error);
      throw error;
    }
  }
}

export default new OrderService();
