import { useState, useEffect, useCallback, useRef } from 'react';
import { advertiserService } from '@/services';
import { logger } from '@/utils/logger';
import type { Advertiser } from '@/types/ad';

export interface UseAdvertiserListOptions {
  page?: number;
  limit?: number;
  status?: string;
  communityId?: string;
}

export interface UseAdvertiserParams {
  advertiserId?: string | null;
  initialAdvertiser?: Advertiser | null;
  listOptions?: UseAdvertiserListOptions;
}

export interface UseAdvertiserReturn {
  advertiser: Advertiser | null;
  advertisers: Advertiser[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useAdvertiser = (params: UseAdvertiserParams = {}): UseAdvertiserReturn => {
  const { advertiserId, initialAdvertiser = null, listOptions } = params;
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(initialAdvertiser ?? null);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cancelledRef = useRef(false);

  const loadById = useCallback(async () => {
    if (!advertiserId || advertiserId.trim() === '') {
      return Promise.resolve();
    }
    setLoading(true);
    setError(null);
    try {
      const response = await advertiserService.getAdvertiserById(advertiserId.trim());
      if (cancelledRef.current) return;
      if (response.success && response.data) {
        setAdvertiser(response.data);
        setAdvertisers([]);
      } else {
        setAdvertiser(null);
        setAdvertisers([]);
      }
    } catch (err) {
      if (cancelledRef.current) return;
      logger.error('Error loading advertiser:', err);
      setError(err instanceof Error ? err : new Error('Failed to load advertiser'));
      setAdvertiser(null);
      setAdvertisers([]);
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [advertiserId]);

  const loadList = useCallback(async () => {
    if (!listOptions) {
      return Promise.resolve();
    }
    const { page = 1, limit = 50, status = 'active', communityId } = listOptions;
    setLoading(true);
    setError(null);
    try {
      const response = await advertiserService.getAdvertisers({ page, limit, status, communityId });
      if (cancelledRef.current) return;
      if (response.success && response.data?.advertisers?.length) {
        const list = response.data.advertisers;
        setAdvertisers(list);
        setAdvertiser(list[0] ?? null);
      } else {
        setAdvertisers([]);
        setAdvertiser(null);
      }
    } catch (err) {
      if (cancelledRef.current) return;
      logger.error('Error loading advertisers list:', err);
      setError(err instanceof Error ? err : new Error('Failed to load advertisers'));
      setAdvertisers([]);
      setAdvertiser(null);
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [listOptions?.page, listOptions?.limit, listOptions?.status, listOptions?.communityId]);

  const refresh = useCallback(async (): Promise<void> => {
    if (listOptions != null && (advertiserId == null || advertiserId === '')) {
      return loadList();
    }
    return loadById();
  }, [listOptions, advertiserId, loadList, loadById]);

  const hasListOptions = listOptions != null;
  const listPage = listOptions?.page;
  const listLimit = listOptions?.limit;
  const listStatus = listOptions?.status;
  const listCommunityId = listOptions?.communityId;

  useEffect(() => {
    cancelledRef.current = false;

    if (initialAdvertiser?.id === advertiserId && advertiserId) {
      setAdvertiser(initialAdvertiser);
      setAdvertisers([]);
      setError(null);
      return () => {
        cancelledRef.current = true;
      };
    }
    if (hasListOptions && (advertiserId == null || advertiserId === '')) {
      loadList();
      return () => {
        cancelledRef.current = true;
      };
    }
    if (!advertiserId && !hasListOptions) {
      setAdvertiser(initialAdvertiser ?? null);
      setAdvertisers([]);
      setError(null);
      return () => {
        cancelledRef.current = true;
      };
    }
    loadById();
    return () => {
      cancelledRef.current = true;
    };
  }, [
    advertiserId,
    initialAdvertiser,
    hasListOptions,
    listPage,
    listLimit,
    listStatus,
    listCommunityId,
    loadList,
    loadById,
  ]);

  return {
    advertiser,
    advertisers,
    loading,
    error,
    refresh,
  };
};
