import { enrichAdsProductsWithCategoriesFromByProductApi } from '@/hooks/marketplace/productCategoryEnrichment';
import { useState, useCallback, useEffect } from 'react';
import { adService } from '@/services';
import { mapUICategoryToApiCategory } from '@/utils';
import { logger } from '@/utils/logger';
import type { Ad, ListAdsParams } from '@/types/ad';

interface UseProviderAdsParams {
  advertiserId: string | undefined;
  page?: number;
  limit?: number;
  /** products | services | programs — mesmo mapeamento do marketplace */
  selectedCategory?: string;
  enabled?: boolean;
}

interface UseProviderAdsReturn {
  ads: Ad[];
  loading: boolean;
  hasMore: boolean;
  loadAds: () => Promise<void>;
}

export const useProviderAds = ({
  advertiserId,
  page = 1,
  limit = 20,
  selectedCategory,
  enabled = true,
}: UseProviderAdsParams): UseProviderAdsReturn => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setAds([]);
      setLoading(false);
      setHasMore(false);
      return;
    }
    setAds([]);
    setHasMore(true);
  }, [advertiserId, selectedCategory, enabled]);

  const loadAds = useCallback(async () => {
    if (!enabled) {
      return;
    }

    if (!advertiserId) {
      setAds([]);
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);
      const params: ListAdsParams = {
        advertiserId,
        page,
        limit,
        activeOnly: true,
      };
      const apiCategory = selectedCategory ? mapUICategoryToApiCategory(selectedCategory) : undefined;
      if (apiCategory) {
        params.type = apiCategory;
      }

      const response = await adService.listAds(params);

      if (!response.success || !response.data) {
        if (page === 1) setAds([]);
        setHasMore(false);
        return;
      }

      const adsArray = await enrichAdsProductsWithCategoriesFromByProductApi(response.data.ads || []);
      if (page === 1) {
        setAds(adsArray);
      } else {
        setAds((prev) => [...prev, ...adsArray]);
      }

      const pagination = response.data.pagination;
      if (pagination) {
        setHasMore(pagination.page < pagination.totalPages);
      } else {
        setHasMore(adsArray.length >= limit);
      }
    } catch (error) {
      logger.error('useProviderAds: falha ao listar anúncios do provider', {
        error,
        advertiserId,
        page,
        selectedCategory,
      });
      if (page === 1) setAds([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [advertiserId, page, limit, selectedCategory, enabled]);

  return {
    ads,
    loading,
    hasMore,
    loadAds,
  };
};
