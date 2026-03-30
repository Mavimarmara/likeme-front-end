import type { Ad } from '@/types/ad';
import {
  DEFAULT_MARKETPLACE_SORT_ORDER,
  MARKETPLACE_SORT_ORDER_IDS,
  type MarketplaceSortOrderId,
} from '@/constants/marketplaceSortOrder';
import type { Product as CarouselProduct } from '@/components/sections/product/ProductCard';

export type SortableCarouselProduct = CarouselProduct & {
  createdAt?: string;
  updatedAt?: string;
};

export function normalizeMarketplaceSortOrder(id: string | undefined): MarketplaceSortOrderId {
  const allowed = new Set<string>(Object.values(MARKETPLACE_SORT_ORDER_IDS));
  if (id != null && allowed.has(id)) {
    return id as MarketplaceSortOrderId;
  }
  return DEFAULT_MARKETPLACE_SORT_ORDER;
}

export function sortAdsByMarketplaceOrder(ads: Ad[], orderId: MarketplaceSortOrderId): Ad[] {
  const list = [...ads];
  const priceOf = (a: Ad) => a.product?.price ?? 0;
  const createdOf = (a: Ad) => a.product?.createdAt ?? a.createdAt ?? '';
  const updatedOf = (a: Ad) => a.product?.updatedAt ?? a.updatedAt ?? '';

  switch (orderId) {
    case MARKETPLACE_SORT_ORDER_IDS.MOST_RELEVANT:
      return list;
    case MARKETPLACE_SORT_ORDER_IDS.MOST_RECENT:
      return list.sort((a, b) => createdOf(b).localeCompare(createdOf(a)));
    case MARKETPLACE_SORT_ORDER_IDS.PRICE_ASC:
      return list.sort((a, b) => priceOf(a) - priceOf(b));
    case MARKETPLACE_SORT_ORDER_IDS.PRICE_DESC:
      return list.sort((a, b) => priceOf(b) - priceOf(a));
    case MARKETPLACE_SORT_ORDER_IDS.MOST_POPULAR:
      return list.sort((a, b) => updatedOf(b).localeCompare(updatedOf(a)));
    default:
      return list;
  }
}

export function sortShopProductsByMarketplaceOrder<T extends SortableCarouselProduct>(
  products: T[],
  orderId: MarketplaceSortOrderId,
): T[] {
  const list = [...products];
  switch (orderId) {
    case MARKETPLACE_SORT_ORDER_IDS.MOST_RELEVANT:
      return list.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', undefined, { sensitivity: 'base' }));
    case MARKETPLACE_SORT_ORDER_IDS.MOST_RECENT:
      return list.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    case MARKETPLACE_SORT_ORDER_IDS.PRICE_ASC:
      return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case MARKETPLACE_SORT_ORDER_IDS.PRICE_DESC:
      return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case MARKETPLACE_SORT_ORDER_IDS.MOST_POPULAR:
      return list.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    default:
      return list;
  }
}
