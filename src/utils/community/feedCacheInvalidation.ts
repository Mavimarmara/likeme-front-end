import { logger } from '@/utils/logger';

type FeedCacheInvalidationHandler = (key?: string) => void;

const feedCacheInvalidationHandlers = new Set<FeedCacheInvalidationHandler>();

export function registerFeedCacheInvalidationHandler(handler: FeedCacheInvalidationHandler): () => void {
  feedCacheInvalidationHandlers.add(handler);
  return () => {
    feedCacheInvalidationHandlers.delete(handler);
  };
}

export function invalidateFeedCache(key?: string): void {
  feedCacheInvalidationHandlers.forEach((handler) => {
    try {
      handler(key);
    } catch (error) {
      logger.warn('[feedCacheInvalidation] Falha ao invalidar cache do feed', { key, cause: error });
    }
  });
}
