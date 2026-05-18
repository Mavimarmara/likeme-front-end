import orderService from '@/services/order/orderService';
import { subscriptionService } from '@/services/payment/subscriptionService';
import { mapSubscriptionToAcquisitionItem, serviceAcquisitionsFromOrders } from '@/utils/profile/acquisitionListMapper';
import type { AcquisitionListItem } from '@/types/acquisition/acquisition';
import { logger } from '@/utils/logger';

type TranslateFn = (key: string) => string;

class AcquisitionListService {
  async loadAcquisitionList(t: TranslateFn): Promise<{
    protocols: AcquisitionListItem[];
    services: AcquisitionListItem[];
  }> {
    const [subscriptionsResponse, ordersResponse] = await Promise.all([
      subscriptionService.listUserSubscriptions(),
      orderService.listOrders({ limit: 100 }),
    ]);

    if (!subscriptionsResponse.success) {
      logger.error('[AcquisitionListService] Falha ao listar assinaturas', subscriptionsResponse);
      throw new Error('Falha ao carregar protocolos');
    }

    const protocols = (subscriptionsResponse.data?.subscriptions ?? []).map((row) =>
      mapSubscriptionToAcquisitionItem(row, t),
    );

    let services: AcquisitionListItem[] = [];
    if (ordersResponse.success && ordersResponse.data?.orders) {
      services = serviceAcquisitionsFromOrders(ordersResponse.data.orders);
    } else {
      logger.error('[AcquisitionListService] Falha ao listar pedidos para serviços', ordersResponse);
    }

    return { protocols, services };
  }
}

export const acquisitionListService = new AcquisitionListService();
