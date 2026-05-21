import { useState, useEffect, useCallback, useMemo } from 'react';
import { productService } from '@/services';
import type { Product as CarouselProduct } from '@/components/sections/product';
import type { Product as ApiProduct } from '@/types/product';
import { useCategories } from '@/hooks/category/useCategories';
import { logger } from '@/utils/logger';
import { buildMarketplaceCategoryBadgeLabels } from '@/utils/marketplace/buildMarketplaceCategoryBadgeLabels';
import { pickRandomItems } from '@/utils/array/shuffleArray';
import { prefetchImageUris } from '@/utils/image/prefetchImageUris';

/** Lista padrão de produtos sugeridos (Home Summary, Activities, Comunidade sem filtro extra). */
export const SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS = {
  limit: 4,
  status: 'active' as const,
};

/** Pool máximo trazido da API. Margem pequena sobre o `limit` apenas para variar o slice final. */
const SUGGESTED_PRODUCTS_FETCH_POOL_MAX = 24;

function getSuggestedProductsFetchLimit(displayLimit: number): number {
  const minimum = Math.max(displayLimit, 4);
  return Math.min(Math.max(displayLimit * 2, minimum), SUGGESTED_PRODUCTS_FETCH_POOL_MAX);
}

const SUGGESTED_PRODUCT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

function mapApiProductToCarouselProduct(product: ApiProduct, tags: string[]): CarouselProduct {
  const categoryLabel = tags[0] ?? '';
  return {
    id: product.id,
    title: product.name,
    price: product.price ?? null,
    tag: categoryLabel,
    tags,
    image: product.image || SUGGESTED_PRODUCT_PLACEHOLDER_IMAGE,
    likes: 0,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
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
  products: CarouselProduct[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useSuggestedProducts = (options: UseSuggestedProductsOptions = {}): UseSuggestedProductsReturn => {
  const { limit = 4, status = 'active', enabled = true, categoryId, type } = options;
  const { categories } = useCategories({ enabled });
  /**
   * Pool já com `pickRandomItems` aplicado: o sorteio acontece uma única vez por load
   * (não a cada render nem quando `categories` chega depois). Isso evita o "pisca"
   * de conteúdo diferente sempre que a tela remonta sem motivo.
   */
  const [shuffledApiProducts, setShuffledApiProducts] = useState<ApiProduct[]>([]);
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
        const shuffled = pickRandomItems(productsResponse.data.products, limit);
        setShuffledApiProducts(shuffled);
      } else {
        setShuffledApiProducts([]);
      }
    } catch (err) {
      logger.error('[useSuggestedProducts] Erro ao carregar produtos sugeridos', err);
      setError(err instanceof Error ? err : new Error('Failed to load suggested products'));
      setShuffledApiProducts([]);
    } finally {
      setLoading(false);
    }
  }, [enabled, limit, status, categoryId, type]);

  /**
   * Tags vêm de `categoryNames` na resposta da API (join no banco).
   * Mantemos o mapping em `useMemo` para que a chegada tardia de `categories` não
   * dispare um segundo fetch — antes ela estava nas deps de `loadProducts`.
   */
  const products = useMemo<CarouselProduct[]>(
    () =>
      shuffledApiProducts.map((p) => {
        const tags = buildMarketplaceCategoryBadgeLabels(p, categories);
        return mapApiProductToCarouselProduct(p, tags);
      }),
    [shuffledApiProducts, categories],
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    void prefetchImageUris(products.map((p) => p.image));
  }, [products]);

  return {
    products,
    loading,
    error,
    refresh: loadProducts,
  };
};
