import { COLORS } from '@/constants';
import { ORDER_DELIVERY_STATUS } from '@/constants/order/orderDeliveryStatus';
import type { Order } from '@/types/order';

export type OrderCardStatusKey =
  | 'payment_pending'
  | 'payment_failed'
  | 'payment_refunded'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

type IconButtonVariant = 'light' | 'dark';

export type OrderCardStatusPresentation = {
  icon: string;
  variant: IconButtonVariant;
  backgroundTintColor?: string | readonly string[] | null;
  iconColor?: string;
  deliveryLabelKey: string;
  deliveryLabelDefault: string;
  accessibilityLabelKey: string;
  accessibilityLabelDefault: string;
};

export function orderCardStatusKey(
  order: Pick<Order, 'paymentStatus' | 'deliveryStatus' | 'status'>,
): OrderCardStatusKey {
  if (order.paymentStatus === 'failed') {
    return 'payment_failed';
  }
  if (order.paymentStatus === 'refunded') {
    return 'payment_refunded';
  }
  if (order.paymentStatus === 'pending') {
    return 'payment_pending';
  }

  const delivery = order.deliveryStatus ?? order.status;

  switch (delivery) {
    case ORDER_DELIVERY_STATUS.DELIVERED:
      return 'delivered';
    case ORDER_DELIVERY_STATUS.SHIPPED:
      return 'shipped';
    case ORDER_DELIVERY_STATUS.PROCESSING:
      return 'processing';
    case ORDER_DELIVERY_STATUS.CANCELLED:
      return 'cancelled';
    default:
      return 'paid';
  }
}

export const ORDER_CARD_STATUS_PRESENTATION: Record<OrderCardStatusKey, OrderCardStatusPresentation> = {
  delivered: {
    icon: 'check',
    variant: 'dark',
    deliveryLabelKey: 'activities.orderDeliveryDone',
    deliveryLabelDefault: 'Entrega: Feita',
    accessibilityLabelKey: 'activities.orderStatusDelivered',
    accessibilityLabelDefault: 'Entrega concluída',
  },
  paid: {
    icon: 'check',
    variant: 'dark',
    deliveryLabelKey: 'activities.orderPaidConfirmed',
    deliveryLabelDefault: 'Pagamento confirmado',
    accessibilityLabelKey: 'activities.orderStatusPaid',
    accessibilityLabelDefault: 'Pagamento confirmado',
  },
  shipped: {
    icon: 'local-shipping',
    variant: 'light',
    backgroundTintColor: COLORS.PRIMARY.LIGHT,
    deliveryLabelKey: 'activities.orderDeliveryShipped',
    deliveryLabelDefault: 'Entrega: Enviado',
    accessibilityLabelKey: 'activities.orderStatusShipped',
    accessibilityLabelDefault: 'Pedido enviado',
  },
  processing: {
    icon: 'inventory-2',
    variant: 'light',
    backgroundTintColor: COLORS.SECONDARY.PURE,
    deliveryLabelKey: 'activities.orderDeliveryProcessing',
    deliveryLabelDefault: 'Entrega: Em preparação',
    accessibilityLabelKey: 'activities.orderStatusProcessing',
    accessibilityLabelDefault: 'Pedido em preparação',
  },
  payment_pending: {
    icon: 'schedule',
    variant: 'light',
    backgroundTintColor: COLORS.SECONDARY.PURE,
    deliveryLabelKey: 'activities.orderPaymentPending',
    deliveryLabelDefault: 'Pagamento pendente',
    accessibilityLabelKey: 'activities.orderStatusPaymentPending',
    accessibilityLabelDefault: 'Pagamento pendente',
  },
  payment_failed: {
    icon: 'close',
    variant: 'light',
    backgroundTintColor: COLORS.FEEDBACK.WARNING,
    iconColor: COLORS.WHITE,
    deliveryLabelKey: 'activities.orderPaymentFailed',
    deliveryLabelDefault: 'Pagamento recusado',
    accessibilityLabelKey: 'activities.orderStatusPaymentFailed',
    accessibilityLabelDefault: 'Pagamento recusado',
  },
  payment_refunded: {
    icon: 'undo',
    variant: 'light',
    backgroundTintColor: COLORS.NEUTRAL.LOW.MEDIUM,
    iconColor: COLORS.WHITE,
    deliveryLabelKey: 'activities.orderPaymentRefunded',
    deliveryLabelDefault: 'Pagamento estornado',
    accessibilityLabelKey: 'activities.orderStatusPaymentRefunded',
    accessibilityLabelDefault: 'Pagamento estornado',
  },
  cancelled: {
    icon: 'block',
    variant: 'light',
    backgroundTintColor: COLORS.NEUTRAL.LOW.MEDIUM,
    iconColor: COLORS.WHITE,
    deliveryLabelKey: 'activities.orderDeliveryCancelled',
    deliveryLabelDefault: 'Pedido cancelado',
    accessibilityLabelKey: 'activities.orderStatusCancelled',
    accessibilityLabelDefault: 'Pedido cancelado',
  },
};

export function orderCardStatusPresentation(
  order: Pick<Order, 'paymentStatus' | 'deliveryStatus' | 'status'>,
): OrderCardStatusPresentation {
  return ORDER_CARD_STATUS_PRESENTATION[orderCardStatusKey(order)];
}

export function orderCardTitle(order: Order): string {
  const labels = (order.items ?? [])
    .map((item) => item.product?.categoryNames?.[0] ?? item.product?.categoryName ?? item.product?.name)
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);

  if (labels.length === 0) {
    return '';
  }

  const unique = [...new Set(labels)];
  return unique.slice(0, 2).join(', ');
}
