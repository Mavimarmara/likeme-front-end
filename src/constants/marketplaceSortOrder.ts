export const MARKETPLACE_SORT_ORDER_IDS = {
  MOST_RELEVANT: 'most-relevant',
  MOST_RECENT: 'most-recent',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  MOST_POPULAR: 'most-popular',
} as const;

export type MarketplaceSortOrderId = (typeof MARKETPLACE_SORT_ORDER_IDS)[keyof typeof MARKETPLACE_SORT_ORDER_IDS];

export const DEFAULT_MARKETPLACE_SORT_ORDER: MarketplaceSortOrderId = MARKETPLACE_SORT_ORDER_IDS.MOST_RELEVANT;
