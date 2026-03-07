import type { Product as ApiProduct } from '@/types/product';
import type { CartItem } from '@/types/cart';

export const mapProductToCartItem = (product: ApiProduct): CartItem => {
  const price =
    typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.-]/g, '')) || 0;

  return {
    id: product.id,
    image: product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    title: product.name,
    subtitle: product.description || '',
    price,
    quantity: 1,
    rating: 5,
    type: product.type,
    categoryId: product.categoryId,
    category: product.type === 'program' ? 'Programs' : 'Product',
    tags: product.type ? [product.type] : [],
  };
};
