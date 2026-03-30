import { useState, useCallback, useEffect } from 'react';
import { productService } from '@/services';
import { logger } from '@/utils/logger';
import type { Ad } from '@/types/ad';
import type { Product } from '@/types/product';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';

const adIsUsableForListing = (ad: Ad): boolean => {
  if (ad.status !== 'active') {
    return false;
  }
  const now = new Date();
  if (ad.startDate != null && ad.startDate !== '' && new Date(ad.startDate) > now) {
    return false;
  }
  if (ad.endDate != null && ad.endDate !== '' && new Date(ad.endDate) < now) {
    return false;
  }
  return true;
};

const LIST_LIMIT = 20;

interface UseProductsParams {
  categoryId?: string | null;
  page: number;
  searchQuery?: string;
  enabled?: boolean;
}

interface UseProductsReturn {
  ads: Ad[];
  loading: boolean;
  hasMore: boolean;
  loadProducts: () => Promise<void>;
}

const catalogProductToSyntheticAd = (product: Product): Ad => {
  const createdAt = product.createdAt ?? new Date().toISOString();
  const updatedAt = product.updatedAt ?? createdAt;
  const adStatus: Ad['status'] = product.status === 'inactive' ? 'inactive' : 'active';

  return {
    id: `catalog-program-${product.id}`,
    productId: product.id,
    advertiserId: product.advertiserId,
    status: adStatus,
    product,
    createdAt,
    updatedAt,
  };
};

const listingAdFromProduct = (product: Product): Ad => {
  const embedded = product.ads ?? [];
  const picked = embedded.find(adIsUsableForListing) ?? embedded.find((a) => a.status === 'active') ?? embedded[0];

  if (picked != null) {
    return {
      ...picked,
      productId: picked.productId ?? product.id,
      product: picked.product ?? product,
    };
  }

  return catalogProductToSyntheticAd(product);
};

export const useProducts = ({
  categoryId,
  page,
  searchQuery,
  enabled = true,
}: UseProductsParams): UseProductsReturn => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setAds([]);
      setLoading(false);
      setHasMore(false);
    }
  }, [enabled]);

  const loadProducts = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setLoading(true);
      const trimmedSearch = searchQuery?.trim();
      const response = await productService.listProducts({
        page,
        limit: LIST_LIMIT,
        status: 'active',
        type: PRODUCT_CATALOG_TYPE.PROGRAM,
        ...(categoryId != null && categoryId !== '' ? { categoryId } : {}),
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
      });

      if (!response.success || !response.data) {
        if (page === 1) {
          setAds([]);
        }
        setHasMore(false);
        return;
      }

      const products = response.data.products ?? [];
      const rows = products.map(listingAdFromProduct);

      if (page === 1) {
        setAds(rows);
      } else {
        setAds((prev) => [...prev, ...rows]);
      }

      const pag = response.data.pagination;
      if (pag) {
        setHasMore(pag.page < pag.totalPages);
      } else {
        setHasMore(rows.length >= LIST_LIMIT);
      }
    } catch (error) {
      logger.error('useProducts: falha ao listar programas', {
        error,
        page,
        search: searchQuery,
        categoryId,
      });
      if (page === 1) {
        setAds([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [enabled, categoryId, page, searchQuery]);

  return {
    ads,
    loading,
    hasMore,
    loadProducts,
  };
};
