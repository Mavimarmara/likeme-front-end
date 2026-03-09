import { useState, useEffect, useCallback } from 'react';
import { productService, categoryService } from '@/services';
import type { Product } from '@/components/sections/product';

interface UseSuggestedProductsOptions {
  limit?: number;
  status?: 'active' | 'inactive';
  enabled?: boolean;
  categoryId?: string | null; // domain category filter (Estresse, Sono, etc.)
}

interface UseSuggestedProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useSuggestedProducts = (options: UseSuggestedProductsOptions = {}): UseSuggestedProductsReturn => {
  const { limit = 4, status = 'active', enabled = true, categoryId } = options;
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
      const [productsResponse, categoriesList] = await Promise.all([
        productService.listProducts({
          limit,
          status,
          ...(categoryId != null && categoryId !== '' ? { categoryId } : {}),
        }),
        categoryService.listCategories().catch(() => []),
      ]);

      if (productsResponse.success && productsResponse.data) {
        const mappedProducts: Product[] = productsResponse.data.products.map((p) => ({
          id: p.id,
          title: p.name,
          price: p.price || 0,
          tag: categoriesList.find((c) => c.categoryId === p.categoryId)?.name ?? 'Product',
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
  }, [enabled, limit, status, categoryId]);

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
