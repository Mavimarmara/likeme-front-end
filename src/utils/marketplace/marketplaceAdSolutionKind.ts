import type { Ad } from '@/types/ad';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';

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
