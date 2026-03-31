import { useState, useEffect, useCallback } from 'react';
import { productService, categoryService } from '@/services';
import type { Product } from '@/components/sections/product';
import { getMarkerIdForCategory } from '@/hooks/category';
import { CATEGORY_NAMES, type CategoryName } from '@/types/category';

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

type ProductApiLike = {
  categoryId?: string | null;
  category?: string | { id?: string; name?: string } | null;
  categoryName?: string | null;
  category_id?: string | null;
};

const resolveCategoryReference = (
  product: ProductApiLike,
  categoriesList: Array<{ categoryId: string; name: string }>,
): { categoryId: string; categoryName: string } => {
  const rawCategory = product.category;
  const categoryFromObject =
    rawCategory && typeof rawCategory === 'object'
      ? {
          id: typeof rawCategory.id === 'string' ? rawCategory.id : '',
          name: typeof rawCategory.name === 'string' ? rawCategory.name : '',
        }
      : { id: '', name: '' };

  const categoryIdCandidates = [
    product.categoryId,
    product.category_id,
    categoryFromObject.id,
    typeof rawCategory === 'string' ? rawCategory : undefined,
  ]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);

  const categoryNameCandidates = [
    product.categoryName,
    categoryFromObject.name,
    typeof rawCategory === 'string' ? rawCategory : undefined,
  ]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean);

  const matchedById = categoriesList.find((category) =>
    categoryIdCandidates.some((candidate) => String(category.categoryId) === String(candidate)),
  );
  if (matchedById) {
    return {
      categoryId: String(matchedById.categoryId),
      categoryName: matchedById.name,
    };
  }

  const matchedByName = categoriesList.find((category) =>
    categoryNameCandidates.some((candidate) => candidate.toLowerCase() === category.name.toLowerCase()),
  );
  if (matchedByName) {
    return {
      categoryId: String(matchedByName.categoryId),
      categoryName: matchedByName.name,
    };
  }

  return {
    categoryId: categoryIdCandidates[0] ?? '',
    categoryName: categoryNameCandidates[0] ?? '',
  };
};

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
        const mappedProducts: Product[] = productsResponse.data.products.map((p) => {
          const { categoryId: resolvedCategoryId, categoryName } = resolveCategoryReference(
            p as ProductApiLike,
            categoriesList,
          );
          const markerId = getMarkerIdForCategory(resolvedCategoryId, categoryName);
          const categoryLabel = markerId ? CATEGORY_NAMES[markerId as CategoryName] : categoryName;

          return {
            id: p.id,
            title: p.name,
            price: p.price || 0,
            tag: categoryLabel,
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
