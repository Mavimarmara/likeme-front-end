import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import type { Advertiser } from '@/types/ad';

export interface AdvertisersCacheEntry {
  advertisers: Advertiser[];
  fetchedAt: number;
}

interface AdvertisersCacheContextValue {
  read: (key: string) => AdvertisersCacheEntry | undefined;
  write: (key: string, entry: AdvertisersCacheEntry) => void;
  invalidate: (key?: string) => void;
}

export const ADVERTISERS_CACHE_STALE_MS = 5 * 60 * 1000;

const fallback: AdvertisersCacheContextValue = {
  read: () => undefined,
  write: () => undefined,
  invalidate: () => undefined,
};

const AdvertisersCacheContext = createContext<AdvertisersCacheContextValue>(fallback);

export const AdvertisersCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cacheRef = useRef<Map<string, AdvertisersCacheEntry>>(new Map());

  const read = useCallback((key: string) => cacheRef.current.get(key), []);

  const write = useCallback((key: string, entry: AdvertisersCacheEntry) => {
    cacheRef.current.set(key, entry);
  }, []);

  const invalidate = useCallback((key?: string) => {
    if (key == null) {
      cacheRef.current.clear();
      return;
    }
    cacheRef.current.delete(key);
  }, []);

  const value = useMemo(() => ({ read, write, invalidate }), [read, write, invalidate]);

  return <AdvertisersCacheContext.Provider value={value}>{children}</AdvertisersCacheContext.Provider>;
};

export function useAdvertisersCache(): AdvertisersCacheContextValue {
  return useContext(AdvertisersCacheContext);
}

export function isAdvertisersCacheEntryFresh(entry: AdvertisersCacheEntry, now: number = Date.now()): boolean {
  return now - entry.fetchedAt < ADVERTISERS_CACHE_STALE_MS;
}
