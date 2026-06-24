import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import type { Post } from '@/types';
import { registerFeedCacheInvalidationHandler } from '@/utils/community/feedCacheInvalidation';

interface FeedCacheEntry {
  posts: Post[];
  nextCursor: string | undefined;
  hasMore: boolean;
  currentPage: number;
  fetchedAt: number;
}

interface FeedCacheContextValue {
  read: (key: string) => FeedCacheEntry | undefined;
  write: (key: string, entry: FeedCacheEntry) => void;
  invalidate: (key?: string) => void;
}

/**
 * Janela em que uma entrada do cache do feed é considerada "fresca" e o hook
 * pode pular o fetch inicial ao remontar a tela. Após esse intervalo, refazemos
 * a requisição (mas o catálogo Supabase continua respondendo 304).
 */
export const FEED_CACHE_STALE_MS = 5 * 60 * 1000;

const feedCacheContextFallback: FeedCacheContextValue = {
  read: () => undefined,
  write: () => undefined,
  invalidate: () => undefined,
};

const FeedCacheContext = createContext<FeedCacheContextValue>(feedCacheContextFallback);

export const FeedCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cacheRef = useRef<Map<string, FeedCacheEntry>>(new Map());

  const read = useCallback((key: string) => cacheRef.current.get(key), []);

  const write = useCallback((key: string, entry: FeedCacheEntry) => {
    cacheRef.current.set(key, entry);
  }, []);

  const invalidate = useCallback((key?: string) => {
    if (key == null) {
      cacheRef.current.clear();
      return;
    }
    cacheRef.current.delete(key);
  }, []);

  useEffect(() => registerFeedCacheInvalidationHandler(invalidate), [invalidate]);

  const value = useMemo(() => ({ read, write, invalidate }), [read, write, invalidate]);

  return <FeedCacheContext.Provider value={value}>{children}</FeedCacheContext.Provider>;
};

export function useFeedCache(): FeedCacheContextValue {
  return useContext(FeedCacheContext);
}

export function isFeedCacheEntryFresh(entry: FeedCacheEntry, now: number = Date.now()): boolean {
  return now - entry.fetchedAt < FEED_CACHE_STALE_MS;
}

export type { FeedCacheEntry };
