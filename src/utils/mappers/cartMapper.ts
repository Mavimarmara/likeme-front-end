import type { Product as ApiProduct } from '@/types/product';

interface CartItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price: number;
  quantity: number;
  rating: number;
  tags: string[];
  category: 'Product';
  subCategory: string;
}

export const mapProductToCartItem = (product: ApiProduct): CartItem => {
  const price = typeof product.price === 'number' 
    ? product.price 
    : parseFloat(String(product.price).replace(/[^0-9.-]/g, '')) || 0;

  return {
    id: product.id,
    image: product.image || 'https://via.placeholder.com/200',
    title: product.name,
    subtitle: product.description || '',
    price,
    quantity: 1,
    rating: 5,
    tags: product.category ? [product.category] : [],
    category: 'Product',
    subCategory: product.category || 'Product',
  };
};
