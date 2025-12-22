import type { ApiResponse } from '@/types/infrastructure';
import type { Product } from '@/types/product';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  items?: OrderItem[];
}

export interface CreateOrderItem {
  productId: string;
  quantity: number;
  discount?: number;
}

export interface CreateOrderData {
  items: CreateOrderItem[];
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingCost?: number;
  tax?: number;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  paymentMethod?: string;
  // paymentStatus sempre será 'pending' ao criar - definido no backend
  trackingNumber?: string;
}

export interface UpdateOrderData {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  restoreStock?: boolean;
}

export interface ListOrdersParams {
  page?: number;
  limit?: number;
  userId?: string;
  status?: string;
  paymentStatus?: string;
}

export interface ListOrdersApiResponse extends ApiResponse<{
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {}

export interface GetOrderApiResponse extends ApiResponse<Order> {}
