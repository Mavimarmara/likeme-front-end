import type { Product as ApiProduct } from '@/types/product';

export type RouteFallbackProduct = {
  id: string;
  title: string;
  price: string;
  image: string;
  type?: string;
  description?: string;
};

export function buildApiProductFromRouteFallback(fallback: RouteFallbackProduct, timestampsIso: string): ApiProduct {
  const parsedPrice = Number.parseFloat(fallback.price.replace('$', '').replace(',', ''));
  return {
    id: fallback.id,
    name: fallback.title,
    description: fallback.description,
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    image: fallback.image,
    type: fallback.type,
    quantity: 0,
    status: 'active',
    createdAt: timestampsIso,
    updatedAt: timestampsIso,
  };
}
