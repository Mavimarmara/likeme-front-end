import { useState, useCallback } from 'react';
import { adService } from '@/services';
import { mapUICategoryToApiCategory } from '@/utils';
import { logger } from '@/utils/logger';
import type { Ad, ListAdsParams } from '@/types/ad';

interface UseMarketplaceAdsParams {
  selectedCategory: string;
  selectedCategoryId?: string | null;
  page: number;
  searchQuery?: string;
}

interface UseMarketplaceAdsReturn {
  ads: Ad[];
  loading: boolean;
  hasMore: boolean;
  loadAds: () => Promise<void>;
}

export const useMarketplaceAds = ({
  selectedCategory,
  selectedCategoryId,
  page,
  searchQuery,
}: UseMarketplaceAdsParams): UseMarketplaceAdsReturn => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const buildParams = useCallback((): ListAdsParams => {
    const params: ListAdsParams = {
      page,
      limit: 20,
      activeOnly: true,
    };

    if (selectedCategoryId != null && selectedCategoryId !== '') {
      params.categoryId = selectedCategoryId;
    }

    const trimmedSearch = searchQuery?.trim();
    if (trimmedSearch) {
      params.search = trimmedSearch;
    }
    const apiCategory = mapUICategoryToApiCategory(selectedCategory);
    if (apiCategory) {
      params.type = apiCategory;
    }

    return params;
  }, [selectedCategory, selectedCategoryId, page, searchQuery]);

  const loadAds = useCallback(async () => {
    try {
      setLoading(true);
      const params = buildParams();
      const response = await adService.listAds(params);

      if (!response.success || !response.data) {
        handleEmptyResponse();
        return;
      }

      const adsArray = response.data.ads || [];
      updateAds(adsArray);
      updatePagination(response.data.pagination, adsArray.length, params.limit);
    } catch (error) {
      logger.error('useMarketplaceAds: falha ao listar anúncios', {
        error,
        page,
        search: searchQuery,
        categoryId: selectedCategoryId,
        selectedCategory,
      });
      handleEmptyResponse();
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  const handleEmptyResponse = () => {
    if (page === 1) {
      setAds([]);
    }
    setHasMore(false);
  };

  const updateAds = (adsArray: Ad[]) => {
    if (page === 1) {
      setAds(adsArray);
      return;
    }
    setAds((prev) => [...prev, ...adsArray]);
  };

  const updatePagination = (pagination: any, adsLength: number, limit: number) => {
    if (pagination) {
      setHasMore(pagination.page < pagination.totalPages);
      return;
    }
    setHasMore(adsLength >= limit);
  };

  return {
    ads,
    loading,
    hasMore,
    loadAds,
  };
};
