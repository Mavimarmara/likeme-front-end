import { useState, useCallback } from 'react';
import { adService } from '@/services';
import { mapUICategoryToApiCategory } from '@/utils';
import type { Ad } from '@/types/ad';

interface UseMarketplaceAdsParams {
  selectedCategory: string;
  selectedCategoryId?: string | null; // domain category (Estresse, Sono, etc.)
  page: number;
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
}: UseMarketplaceAdsParams): UseMarketplaceAdsReturn => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const buildParams = useCallback(() => {
    const params: any = {
      page,
      limit: 20,
    };

    const apiCategory = mapUICategoryToApiCategory(selectedCategory);
    if (apiCategory) {
      params.type = apiCategory;
    }

    if (selectedCategoryId != null && selectedCategoryId !== '') {
      params.categoryId = selectedCategoryId;
    }

    return params;
  }, [selectedCategory, selectedCategoryId, page]);

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
