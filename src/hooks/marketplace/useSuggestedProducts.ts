import { useState, useEffect, useCallback } from 'react';
import { productService, categoryService } from '@/services';
import type { Product } from '@/components/sections/product';

/** Lista padrão de produtos sugeridos (Home Summary, Activities, Comunidade sem filtro extra). */
export const SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS = {
  limit: 4,
  status: 'active' as const,
};

interface UseSuggestedProductsOptions {
  limit?: number;
  status?: 'active' | 'inactive';
  enabled?: boolean;
  categoryId?: string | null; // domain category filter (Estresse, Sono, etc.)
  /** Filtro por tipo: 'physical product' | 'program' | 'service' etc. */
  type?: string;
}

interface UseSuggestedProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useSuggestedProducts = (options: UseSuggestedProductsOptions = {}): UseSuggestedProductsReturn => {
  const { limit = 4, status = 'active', enabled = true, categoryId, type } = options;
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
          ...(type != null && type !== '' ? { type } : {}),
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
  }, [enabled, limit, status, categoryId, type]);

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
