import type { Ad } from '@/types/ad';
import { formatPrice } from '@/utils/formatters';

interface Navigation {
  navigate: (screen: string, params?: any) => void;
  replace: (screen: string, params?: any) => void;
}

export const navigateToAmazonProduct = (
  ad: Ad,
  navigation: Navigation
): boolean => {
  const isAmazonProduct = ad.product?.category === 'amazon product';
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

  const productParams = ad.product ? {
    id: ad.product.id,
    title: ad.product.name,
    price: formatPrice(ad.product.price),
    image: ad.product.image || 'https://via.placeholder.com/400',
    category: ad.product.category,
    description: ad.product.description,
  } : undefined;

  navigation.navigate('AffiliateProduct', {
    productId,
    adId: ad.id,
    product: productParams,
  });

  return true;
};

export const navigateToExternalProduct = (
  ad: Ad,
  navigation: Navigation
): boolean => {
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
      price: formatPrice(ad.product.price),
      image: ad.product.image || 'https://via.placeholder.com/400',
      category: ad.product.category,
      description: ad.product.description,
      externalUrl: ad.product.externalUrl,
    },
  });

  return true;
};

export const navigateToProductDetails = (
  ad: Ad,
  navigation: Navigation
): boolean => {
  if (!ad.productId || !ad.product) {
    return false;
  }

  navigation.navigate('ProductDetails', {
    productId: ad.productId,
    product: {
      id: ad.product.id,
      title: ad.product.name,
      price: formatPrice(ad.product.price),
      image: ad.product.image || 'https://via.placeholder.com/400',
      category: ad.product.category,
      description: ad.product.description,
    },
  });

  return true;
};

export const handleAdNavigation = (
  ad: Ad,
  navigation: Navigation
): void => {
  if (navigateToAmazonProduct(ad, navigation)) {
    return;
  }

  if (navigateToExternalProduct(ad, navigation)) {
    return;
  }

  navigateToProductDetails(ad, navigation);
};
