import type { Ad } from '@/types/ad';
import type { Product } from '@/types/product';

function trimId(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function marketplaceAdvertiserId(product: Product | null, ad: Ad | null): string | undefined {
  const fromProduct = trimId(product?.advertiserId);
  if (fromProduct) {
    return fromProduct;
  }

  const fromAd = trimId(ad?.advertiserId);
  if (fromAd) {
    return fromAd;
  }

  const fromNestedAd = trimId(ad?.advertiser?.id);
  if (fromNestedAd) {
    return fromNestedAd;
  }

  const productAd = product?.ads?.find((item) => trimId(item.advertiserId) || trimId(item.advertiser?.id));
  return trimId(productAd?.advertiserId) ?? trimId(productAd?.advertiser?.id);
}
