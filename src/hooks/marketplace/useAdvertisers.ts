import { useState, useEffect, useCallback, useRef } from 'react';
import { advertiserService } from '@/services';
import { logger } from '@/utils/logger';
import type { Advertiser } from '@/types/ad';
import { ADVERTISER_STATUS } from '@/constants';

type AdvertiserStatus = (typeof ADVERTISER_STATUS)[keyof typeof ADVERTISER_STATUS];

export interface UseAdvertisersListOptions {
  page?: number;
  limit?: number;
  status?: AdvertiserStatus;
  search?: string;
}

export interface UseAdvertisersParams {
  advertiserId?: string | null;
  communityId?: string;
  listOptions?: UseAdvertisersListOptions;
}

export interface UseAdvertisersReturn {
  advertisers: Advertiser[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export const useAdvertisers = (params: UseAdvertisersParams = {}): UseAdvertisersReturn => {
  const { advertiserId, communityId, listOptions } = params;
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const cancelledRef = useRef(false);
  const requestIdRef = useRef(0);

  const hasListOptions = listOptions != null;
  const shouldLoadList = hasListOptions || (!advertiserId && !!communityId);
  const page = listOptions?.page ?? 1;
  const limit = listOptions?.limit ?? 50;
  const status = listOptions?.status ?? ADVERTISER_STATUS.ACTIVE;
  const search = listOptions?.search?.trim() ?? '';

  const startRequest = useCallback((requestId: number, options?: { clear?: boolean }) => {
    if (options?.clear !== false) {
      setAdvertisers([]);
    }
    setLoading(true);
    setError(null);
    return requestId;
  }, []);

  const finishRequest = useCallback((requestId: number) => {
    if (!cancelledRef.current && requestId === requestIdRef.current) {
      setLoading(false);
    }
  }, []);

  const loadById = useCallback(async () => {
    if (!advertiserId) {
      return Promise.resolve();
    }
    const requestId = ++requestIdRef.current;
    startRequest(requestId);
    try {
      const response = await advertiserService.getAdvertiserById(advertiserId);
      if (cancelledRef.current || requestId !== requestIdRef.current) return;
      if (response.success && response.data) {
        const next = [response.data];
        setAdvertisers(communityId ? next.filter((item) => item.communityId === communityId) : next);
      } else {
        setAdvertisers([]);
      }
    } catch (err) {
      if (cancelledRef.current || requestId !== requestIdRef.current) return;
      logger.error('Error loading advertiser:', err);
      setError(err instanceof Error ? err : new Error('Failed to load advertiser'));
      setAdvertisers([]);
    } finally {
      finishRequest(requestId);
    }
  }, [advertiserId, communityId, finishRequest, startRequest]);

  const loadList = useCallback(async () => {
    if (!shouldLoadList) {
      return Promise.resolve();
    }
    const requestId = ++requestIdRef.current;
    startRequest(requestId);
    try {
      const response = await advertiserService.getAdvertisers({
        page,
        limit,
        status,
        communityId,
        ...(search ? { search } : {}),
      });
      if (cancelledRef.current || requestId !== requestIdRef.current) return;
      const list = response.success ? response.data?.advertisers ?? [] : [];
      setAdvertisers(list);
    } catch (err) {
      if (cancelledRef.current || requestId !== requestIdRef.current) return;
      logger.error('Error loading advertisers list:', err);
      setError(err instanceof Error ? err : new Error('Failed to load advertisers'));
      setAdvertisers([]);
    } finally {
      finishRequest(requestId);
    }
  }, [shouldLoadList, page, limit, status, communityId, search, finishRequest, startRequest]);

  const refresh = useCallback(async (): Promise<void> => {
    if (shouldLoadList) {
      return loadList();
    }
    return loadById();
  }, [shouldLoadList, loadList, loadById]);

  useEffect(() => {
    cancelledRef.current = false;

    if (shouldLoadList) {
      loadList();
    } else if (advertiserId) {
      loadById();
    } else {
      setAdvertisers([]);
      setError(null);
    }
    return () => {
      cancelledRef.current = true;
    };
  }, [shouldLoadList, advertiserId, communityId, page, limit, status, search, loadList, loadById]);

  return {
    advertisers,
    loading,
    error,
    refresh,
  };
};
