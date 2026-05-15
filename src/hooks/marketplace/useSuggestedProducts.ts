import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services';
import type { Product } from '@/components/sections/product';
import { useCategories } from '@/hooks/category/useCategories';
import { logger } from '@/utils/logger';
import { buildMarketplaceCategoryBadgeLabels } from '@/utils/marketplace/buildMarketplaceCategoryBadgeLabels';
import { enrichProductsWithCategoriesFromByProductApi } from './productCategoryEnrichment';
import { pickRandomItems } from '@/utils/array/shuffleArray';

/** Lista padrão de produtos sugeridos (Home Summary, Activities, Comunidade sem filtro extra). */
export const SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS = {
  limit: 4,
  status: 'active' as const,
};

/** Pool maior na API para sortear sugestões variadas antes do slice final. */
const SUGGESTED_PRODUCTS_FETCH_POOL_MAX = 48;

function getSuggestedProductsFetchLimit(displayLimit: number): number {
  return Math.min(Math.max(displayLimit * 8, 16), SUGGESTED_PRODUCTS_FETCH_POOL_MAX);
}

interface UseSuggestedProductsOptions {
  limit?: number;
  status?: 'active' | 'inactive';
  enabled?: boolean;
  categoryId?: string | null; // domain category filter (Estresse, Sono, etc.)
  /** Filtro por `Product.type` (catálogo ou ex.: `service`). */
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
  const { categories } = useCategories({ enabled });
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
      const fetchLimit = getSuggestedProductsFetchLimit(limit);
      const productsResponse = await productService.listProducts({
        limit: fetchLimit,
        status,
        ...(categoryId != null && categoryId !== '' ? { categoryId } : {}),
        ...(type != null && type !== '' ? { type } : {}),
      });

      if (productsResponse.success && productsResponse.data) {
        const list = await enrichProductsWithCategoriesFromByProductApi(productsResponse.data.products);
        const mappedProducts: Product[] = list.map((p) => {
          const tags = buildMarketplaceCategoryBadgeLabels(p, categories);
          const categoryLabel = tags[0] ?? '';

          return {
            id: p.id,
            title: p.name,
            price: p.price ?? null,
            tag: categoryLabel,
            tags,
            image: p.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
            likes: 0,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          };
        });
        setProducts(pickRandomItems(mappedProducts, limit));
      } else {
        setProducts([]);
      }
    } catch (err) {
      logger.error('[useSuggestedProducts] Erro ao carregar produtos sugeridos', err);
      setError(err instanceof Error ? err : new Error('Failed to load suggested products'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, limit, status, categoryId, type, categories]);

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
