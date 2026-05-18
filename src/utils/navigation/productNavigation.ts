import type { Ad } from '@/types/ad';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import { formatPriceLabel } from '@/utils/formatters/priceFormatter';
import { advertiserToRouteProductProvider } from '@/utils/marketplace/routeProductProvider';

const priceForNav = (raw: number | null | undefined) => formatPriceLabel(raw);

interface Navigation {
  navigate: (screen: string, params?: any) => void;
  replace: (screen: string, params?: any) => void;
}

export const navigateToAmazonProduct = (ad: Ad, navigation: Navigation): boolean => {
  const isAmazonProduct = ad.product?.type === PRODUCT_CATALOG_TYPE.AMAZON;
  if (!isAmazonProduct) {
    return false;
  }

  if (!ad.product && !ad.productId) {
    return false;
  }

  const productId = ad.productId || ad.product?.id;
  if (!productId) {
    return false;
  }

  const productParams = ad.product
    ? {
        id: ad.product.id,
        title: ad.product.name,
        price: priceForNav(ad.product.price),
        image: ad.product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        type: ad.product.type,
        description: ad.product.description,
        provider: advertiserToRouteProductProvider(ad.advertiser),
      }
    : undefined;

  navigation.navigate('AffiliateProduct', {
    productId,
    adId: ad.id,
    product: productParams,
  });

  return true;
};

export const navigateToExternalProduct = (ad: Ad, navigation: Navigation): boolean => {
  if (!ad.product?.externalUrl) {
    return false;
  }

  if (!ad.product) {
    return false;
  }

  const productId = ad.productId || ad.product.id;
  navigation.navigate('AffiliateProduct', {
    productId,
    adId: ad.id,
    product: {
      id: ad.product.id,
      title: ad.product.name,
      price: priceForNav(ad.product.price),
      image: ad.product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      type: ad.product.type,
      description: ad.product.description,
      externalUrl: ad.product.externalUrl,
      provider: advertiserToRouteProductProvider(ad.advertiser),
    },
  });

  return true;
};

export const navigateToProductDetails = (ad: Ad, navigation: Navigation): boolean => {
  if (!ad.productId || !ad.product) {
    return false;
  }

  navigation.navigate('ProductDetails', {
    productId: ad.productId,
    product: {
      id: ad.product.id,
      title: ad.product.name,
      price: priceForNav(ad.product.price),
      image: ad.product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
      type: ad.product.type,
      description: ad.product.description,
      provider: advertiserToRouteProductProvider(ad.advertiser),
    },
  });

  return true;
};

export const handleAdNavigation = (ad: Ad, navigation: Navigation): void => {
  if (navigateToAmazonProduct(ad, navigation)) {
    return;
  }

  if (navigateToExternalProduct(ad, navigation)) {
    return;
  }

  navigateToProductDetails(ad, navigation);
};
