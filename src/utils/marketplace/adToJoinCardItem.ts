import type { JoinCardItem } from '@/components/ui/cards/JoinCard';
import type { Ad } from '@/types/ad';
import type { CommunityCategory } from '@/types/community';
import { buildMarketplaceCategoryBadgeLabels } from './buildMarketplaceCategoryBadgeLabels';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

type AdToJoinCardItemOptions = {
  categories: readonly CommunityCategory[];
  includePrice?: boolean;
  fallbackTitle?: string;
};

export function adToJoinCardItem(ad: Ad, options: AdToJoinCardItemOptions): JoinCardItem {
  const product = ad.product;
  const title = product?.name?.trim() || options.fallbackTitle?.trim() || '';
  const item: JoinCardItem = {
    id: ad.id,
    title,
    badges: buildMarketplaceCategoryBadgeLabels(product, options.categories),
    image: product?.image?.trim() || DEFAULT_IMAGE,
  };

  if (options.includePrice) {
    item.price = product?.price;
  }

  return item;
}
