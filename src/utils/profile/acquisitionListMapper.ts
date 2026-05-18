import type { AcquisitionListItem } from '@/types/acquisition/acquisition';
import type { UserSubscriptionListItem } from '@/services/payment/subscriptionService';
import type { Order, OrderItem } from '@/types/order';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

type TranslateFn = (key: string) => string;

function subscriptionStatusBadge(status: string, t: TranslateFn): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return t('profile.acquisitionList.statusActive');
    case 'PENDING':
      return t('profile.acquisitionList.statusPending');
    case 'PAST_DUE':
      return t('profile.acquisitionList.statusPastDue');
    case 'CANCELED':
      return t('profile.acquisitionList.statusCanceled');
    default:
      return status;
  }
}

export function mapSubscriptionToAcquisitionItem(row: UserSubscriptionListItem, t: TranslateFn): AcquisitionListItem {
  const badges = [subscriptionStatusBadge(row.status, t), t('profile.acquisitionList.badgeOnline')].filter(Boolean);

  return {
    id: row.id,
    kind: 'protocol',
    productId: row.productId,
    title: row.product.name,
    image: row.product.image?.trim() || DEFAULT_IMAGE,
    badges,
    acquiredAt: row.createdAt,
    subscriptionId: row.id,
  };
}

export function serviceAcquisitionsFromOrders(orders: Order[]): AcquisitionListItem[] {
  const byProductId = new Map<string, AcquisitionListItem>();

  for (const order of orders) {
    if (order.paymentStatus !== 'paid') {
      continue;
    }

    for (const item of order.items ?? []) {
      const product = item.product;
      if (!product || product.type !== PRODUCT_CATALOG_TYPE.SERVICE) {
        continue;
      }

      const existing = byProductId.get(product.id);
      const acquiredAt = order.createdAt;
      if (existing && new Date(existing.acquiredAt).getTime() >= new Date(acquiredAt).getTime()) {
        continue;
      }

      byProductId.set(product.id, {
        id: `${order.id}-${product.id}`,
        kind: 'service',
        productId: product.id,
        title: product.name,
        image: product.image?.trim() || DEFAULT_IMAGE,
        badges: [],
        acquiredAt,
      });
    }
  }

  return Array.from(byProductId.values()).sort(
    (a, b) => new Date(b.acquiredAt).getTime() - new Date(a.acquiredAt).getTime(),
  );
}

export function filterAcquisitionItems(items: AcquisitionListItem[], query: string): AcquisitionListItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return items;
  }
  return items.filter((item) => item.title.toLowerCase().includes(normalized));
}
