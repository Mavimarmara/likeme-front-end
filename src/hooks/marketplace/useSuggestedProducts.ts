import { useState, useEffect, useCallback } from 'react';
import { productService, categoryService } from '@/services';
import type { Product } from '@/components/sections/product';
import { logger } from '@/utils/logger';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const TAGS_QUANTITY = 2;

  const loadProducts = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productsResponse = await productService.listProducts({
        limit,
        status,
        ...(categoryId != null && categoryId !== '' ? { categoryId } : {}),
        ...(type != null && type !== '' ? { type } : {}),
      });

      if (productsResponse.success && productsResponse.data) {
        const list = productsResponse.data.products;
        const categoriesByProductId = await Promise.all(
          list.map(async (p) => {
            try {
              const res = await categoryService.listProductCategories(p.id);
              if (res.success && res.data?.categories?.length) {
                return { productId: p.id, categories: res.data.categories };
              }
            } catch (e) {
              logger.warn('[useSuggestedProducts] Falha ao carregar categorias do produto', {
                productId: p.id,
                cause: e,
              });
            }
            return { productId: p.id, categories: [] as { id: string; name: string }[] };
          }),
        );
        const categoriesMap = new Map(categoriesByProductId.map((row) => [row.productId, row.categories]));

        const mappedProducts: Product[] = list.map((p) => {
          const allNames = (categoriesMap.get(p.id) ?? []).map((c) => c.name.trim()).filter(Boolean);
          const tags = allNames.slice(0, TAGS_QUANTITY);
          const categoryLabel = tags[0] ?? '';

          return {
            id: p.id,
            title: p.name,
            price: p.price || 0,
            tag: categoryLabel,
            tags,
            image: p.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
            likes: 0,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          };
        });
        setProducts(mappedProducts);
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
