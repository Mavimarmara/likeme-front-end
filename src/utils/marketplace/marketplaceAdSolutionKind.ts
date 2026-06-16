import type { Ad } from '@/types/ad';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import type { MarketplaceSolutionTab } from '@/types/solution';

export type MarketplaceAdSolutionKind = 'product' | 'service' | 'program';

export function marketplaceAdSolutionKind(ad: Ad): MarketplaceAdSolutionKind | null {
  const product = ad.product;
  if (!product) {
    return null;
  }

  const type = (product.type ?? '').trim().toLowerCase();
  if (type === PRODUCT_CATALOG_TYPE.PROGRAM) {
    return 'program';
  }
  if (type === PRODUCT_CATALOG_TYPE.SERVICE) {
    return 'service';
  }
  return 'product';
}

const TAB_TO_KIND: Partial<Record<MarketplaceSolutionTab, MarketplaceAdSolutionKind>> = {
  products: 'product',
  services: 'service',
  programs: 'program',
};

export function filterAdsForMarketplaceTab(ads: readonly Ad[], tab: MarketplaceSolutionTab): Ad[] {
  const kind = TAB_TO_KIND[tab];
  if (kind == null) {
    return tab === 'all' ? [...ads] : [];
  }
  return ads.filter((ad) => marketplaceAdSolutionKind(ad) === kind);
}
