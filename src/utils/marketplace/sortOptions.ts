import type { ButtonCarouselOption } from '@/components/ui/carousel';
import { MARKETPLACE_SORT_ORDER_IDS } from '@/constants/marketplaceSortOrder';

type Translate = (key: string) => string;

export function getMarketplaceSortOptions(t: Translate): ButtonCarouselOption<string>[] {
  return [
    { id: MARKETPLACE_SORT_ORDER_IDS.MOST_RELEVANT, label: t('marketplace.sortMostRelevant') },
    { id: MARKETPLACE_SORT_ORDER_IDS.MOST_RECENT, label: t('marketplace.sortMostRecent') },
    { id: MARKETPLACE_SORT_ORDER_IDS.PRICE_ASC, label: t('marketplace.sortPriceAsc') },
    { id: MARKETPLACE_SORT_ORDER_IDS.PRICE_DESC, label: t('marketplace.sortPriceDesc') },
    { id: MARKETPLACE_SORT_ORDER_IDS.MOST_POPULAR, label: t('marketplace.sortMostPopular') },
  ];
}
