import { useState, useCallback, useEffect } from 'react';
import { adService } from '@/services';
import type { Ad } from '@/types/ad';

interface UseProviderAdsParams {
  advertiserId: string | undefined;
  page?: number;
  limit?: number;
}

interface UseProviderAdsReturn {
  ads: Ad[];
  loading: boolean;
  hasMore: boolean;
  loadAds: () => Promise<void>;
}

export const useProviderAds = ({ advertiserId, page = 1, limit = 20 }: UseProviderAdsParams): UseProviderAdsReturn => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setAds([]);
    setHasMore(true);
  }, [advertiserId]);

  const loadAds = useCallback(async () => {
    if (!advertiserId) {
      setAds([]);
      setHasMore(false);
      return;
    }

    try {
      setLoading(true);
      const response = await adService.listAds({
        advertiserId,
        page,
        limit,
        activeOnly: true,
      });

      if (!response.success || !response.data) {
        if (page === 1) setAds([]);
        setHasMore(false);
        return;
      }

      const adsArray = response.data.ads || [];
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
    } catch {
      if (page === 1) setAds([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [advertiserId, page, limit]);

  return {
    ads,
    loading,
    hasMore,
    loadAds,
  };
};
