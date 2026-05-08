import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { communityService } from '@/services';
import type { Post } from '@/types';
import type { CommunityFeedData, UserFeedParams } from '@/types/community';
import { mapCommunityPostToPost } from '@/utils';
import { PAGINATION } from '@/constants';
import { logger } from '@/utils/logger';

interface UseUserFeedOptions {
  enabled?: boolean;
  searchQuery?: string;
  pageSize?: number;
  params?: Partial<UserFeedParams>;
}

const DEFAULT_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

interface UseUserFeedReturn {
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  loadPosts: (page: number, search?: string, append?: boolean) => Promise<void>;
  loadMore: () => void;
  refresh: () => void;
  search: (query: string) => void;
}

export const useUserFeed = (options: UseUserFeedOptions = {}): UseUserFeedReturn => {
  const { enabled = true, searchQuery = '', pageSize = DEFAULT_PAGE_SIZE, params = {} } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentPageRef = useRef(1);
  const nextFeedCursorRef = useRef<string | undefined>(undefined);

  const paramsKey = JSON.stringify(params ?? {});
  const memoizedParams = useMemo(() => params ?? {}, [paramsKey]);

  const hasLoadedInitially = useRef(false);
  const previousSearchQuery = useRef<string>('');
  const previousParamsKey = useRef<string>('');
  const isLoadingRef = useRef(false);
  const hasErrorRef = useRef(false);

  const loadPosts = useCallback(
    async (page: number, search?: string, append = false) => {
      if (isLoadingRef.current) {
        return;
      }

      if (page === 1) {
        nextFeedCursorRef.current = undefined;
      }

      if (page > 1 && (nextFeedCursorRef.current == null || nextFeedCursorRef.current.trim() === '')) {
        logger.warn('[useUserFeed] loadMore sem cursor: paging.next ausente na página anterior.');
        setHasMore(false);
        return;
      }

      const feedCursor = page === 1 ? undefined : nextFeedCursorRef.current?.trim();

      try {
        isLoadingRef.current = true;
        hasErrorRef.current = false;

        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);
        const userFeedResponse = await communityService.getUserFeed({
          page,
          limit: pageSize,
          search: search,
          ...(feedCursor != null && feedCursor.length > 0 ? { token: feedCursor } : {}),
          ...memoizedParams,
        });

        const isSuccess =
          userFeedResponse.success === true ||
          userFeedResponse.status === 'ok' ||
          userFeedResponse.data?.status === 'ok';

        let feedData: CommunityFeedData | undefined;
        if (userFeedResponse.data?.data) {
          feedData = userFeedResponse.data.data;
        } else if (userFeedResponse.data && 'posts' in userFeedResponse.data) {
          feedData = userFeedResponse.data as CommunityFeedData;
        }

        const pagination = userFeedResponse.data?.pagination || userFeedResponse.pagination;

        if (!isSuccess || !feedData) {
          throw new Error(userFeedResponse.message || 'Erro ao carregar feed do usuário');
        }

        const feedPosts = feedData.posts ?? [];
        const mappedPostsPromises = feedPosts.map((communityPost) =>
          mapCommunityPostToPost(
            communityPost,
            feedData.files,
            feedData.users,
            feedData.comments,
            feedData.postChildren,
            feedPosts,
          ),
        );

        const mappedPostsResults = await Promise.all(mappedPostsPromises);
        const mappedPosts: Post[] = mappedPostsResults.filter((post): post is Post => post !== null);

        if (append) {
          setPosts((prev) => [...prev, ...mappedPosts]);
        } else {
          setPosts(mappedPosts);
        }

        setCurrentPage(page);
        currentPageRef.current = page;

        const nextFromFeed =
          feedData.paging?.next != null && String(feedData.paging.next).trim().length > 0
            ? String(feedData.paging.next).trim()
            : undefined;
        nextFeedCursorRef.current = nextFromFeed;

        const receivedCount = mappedPosts.length;
        const hasNextToken = nextFromFeed != null;
        let hasMorePages = false;
        if (receivedCount === 0 && page === 1) {
          hasMorePages = false;
        } else if (hasNextToken) {
          hasMorePages = true;
        } else if (
          pagination &&
          typeof pagination.page === 'number' &&
          typeof pagination.totalPages === 'number' &&
          pagination.totalPages > 0
        ) {
          hasMorePages = pagination.page < pagination.totalPages;
        } else {
          hasMorePages = receivedCount >= pageSize;
        }
        setHasMore(hasMorePages);
      } catch (err) {
        hasErrorRef.current = true;
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar posts';
        setError(errorMessage);
        setHasMore(false);

        if (page === 1) {
          setPosts([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [pageSize, memoizedParams],
  );

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading && enabled) {
      loadPosts(currentPageRef.current + 1, searchQuery, true);
    }
  }, [hasMore, loadingMore, loading, searchQuery, enabled, loadPosts]);

  const refresh = useCallback(() => {
    hasLoadedInitially.current = false;
    previousSearchQuery.current = '';
    nextFeedCursorRef.current = undefined;
    setCurrentPage(1);
    currentPageRef.current = 1;
    setHasMore(true);
    loadPosts(1, searchQuery);
  }, [searchQuery, loadPosts]);

  const search = useCallback(
    (query: string) => {
      previousSearchQuery.current = query;
      hasLoadedInitially.current = false;
      nextFeedCursorRef.current = undefined;
      setCurrentPage(1);
      currentPageRef.current = 1;
      setHasMore(true);
      loadPosts(1, query);
    },
    [loadPosts],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (isLoadingRef.current) {
      return;
    }

    const searchChanged = previousSearchQuery.current !== searchQuery;
    const paramsChanged = previousParamsKey.current !== paramsKey;
    const shouldLoad = !hasLoadedInitially.current || searchChanged || paramsChanged;

    if (shouldLoad) {
      hasLoadedInitially.current = true;
      previousSearchQuery.current = searchQuery;
      previousParamsKey.current = paramsKey;
      hasErrorRef.current = false;

      if (searchChanged || paramsChanged) {
        nextFeedCursorRef.current = undefined;
        setCurrentPage(1);
        currentPageRef.current = 1;
        setHasMore(true);
      }
      loadPosts(1, searchQuery);
    }
  }, [searchQuery, enabled, loadPosts, paramsKey]);

  return {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    currentPage,
    loadPosts,
    loadMore,
    refresh,
    search,
  };
};
