import { orderCardStatusKey, orderCardStatusPresentation } from './orderStatusDisplay';
import type { Order } from '@/types/order';

const baseOrder: Pick<Order, 'paymentStatus' | 'deliveryStatus' | 'status'> = {
  paymentStatus: 'paid',
  deliveryStatus: 'pending',
  status: 'pending',
};

describe('orderCardStatusKey', () => {
  it('prioriza falha de pagamento', () => {
    expect(orderCardStatusKey({ ...baseOrder, paymentStatus: 'failed' })).toBe('payment_failed');
  });

  it('mapeia entrega entregue', () => {
    expect(orderCardStatusKey({ ...baseOrder, deliveryStatus: 'delivered', status: 'delivered' })).toBe('delivered');
  });

  it('usa ícone de check para entregue', () => {
    const presentation = orderCardStatusPresentation({ ...baseOrder, deliveryStatus: 'delivered' });
    expect(presentation.icon).toBe('check');
    expect(presentation.variant).toBe('dark');
  });
});
