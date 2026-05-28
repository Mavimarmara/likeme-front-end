export const ORDER_DELIVERY_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderDeliveryStatus = (typeof ORDER_DELIVERY_STATUS)[keyof typeof ORDER_DELIVERY_STATUS];
