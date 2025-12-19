import { formatPrice } from '@/utils/formatters';
import type { Product as ApiProduct } from '@/types/product';
import type { Product } from '@/components/sections/product';

export const mapApiProductToCarouselProduct = (
  apiProduct: ApiProduct
): Product => {
  return {
    id: apiProduct.id,
    title: apiProduct.name,
    price: apiProduct.price || 0,
    tag: apiProduct.category || 'Product',
    image: apiProduct.image || 'https://via.placeholder.com/400',
    likes: 0,
  };
};

export const mapApiProductToNavigationParams = (
  apiProduct: ApiProduct
) => {
  return {
    id: apiProduct.id,
    title: apiProduct.name,
    price: formatPrice(apiProduct.price),
    image: apiProduct.image || 'https://via.placeholder.com/400',
    category: apiProduct.category,
    description: apiProduct.description,
  };
};
