import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services';
import type { Product } from '@/components/sections/product';

interface UseSuggestedProductsOptions {
  limit?: number;
  status?: 'active' | 'inactive';
  enabled?: boolean;
}

interface UseSuggestedProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useSuggestedProducts = (
  options: UseSuggestedProductsOptions = {},
): UseSuggestedProductsReturn => {
  const { limit = 4, status = 'active', enabled = true } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadProducts = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productService.listProducts({
        limit,
        status,
      });

      if (response.success && response.data) {
        const mappedProducts: Product[] = response.data.products.map((p) => ({
          id: p.id,
          title: p.name,
          price: p.price || 0,
          tag: p.category || 'Product',
          image: p.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
          likes: 0,
        }));
        setProducts(mappedProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error loading suggested products:', err);
      setError(err instanceof Error ? err : new Error('Failed to load suggested products'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, limit, status]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    refresh: loadProducts,
  };
};
