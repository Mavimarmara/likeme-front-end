import { useState, useEffect, useCallback, useRef } from 'react';
import { communityService } from '@/services';
import type { Post } from '@/types';
import { mapCommunityPostToPost } from '@/utils/community/mappers';
import { PAGINATION } from '@/constants';

interface UseUserFeedOptions {
  enabled?: boolean;
  searchQuery?: string;
  pageSize?: number;
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
  const { enabled = true, searchQuery = '', pageSize = DEFAULT_PAGE_SIZE } = options;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasLoadedInitially = useRef(false);
  const previousSearchQuery = useRef<string>('');
  const isLoadingRef = useRef(false);
  const hasErrorRef = useRef(false);

  const loadPosts = useCallback(
    async (page: number, search?: string, append: boolean = false) => {
      if (isLoadingRef.current) {
        return;
      }

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
        });

        if (!userFeedResponse.success || !userFeedResponse.data) {
          throw new Error(userFeedResponse.message || 'Erro ao carregar feed do usuário');
        }

        const mappedPosts: Post[] = (userFeedResponse.data.posts || []).map((communityPost) =>
          mapCommunityPostToPost(communityPost, userFeedResponse.data?.files)
        );

        if (append) {
          setPosts((prev) => [...prev, ...mappedPosts]);
        } else {
          setPosts(mappedPosts);
        }

        setCurrentPage(page);
        
        const hasMorePages = userFeedResponse.pagination 
          ? page < userFeedResponse.pagination.totalPages 
          : userFeedResponse.data.paging?.next !== undefined;
        setHasMore(hasMorePages);
      } catch (err) {
        hasErrorRef.current = true;
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar posts';
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
    [pageSize]
  );

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading && enabled) {
      loadPosts(currentPage + 1, searchQuery, true);
    }
  }, [currentPage, hasMore, loadingMore, loading, searchQuery, enabled, loadPosts]);

  const refresh = useCallback(() => {
    hasLoadedInitially.current = false;
    previousSearchQuery.current = '';
    setCurrentPage(1);
    setHasMore(true);
    loadPosts(1, searchQuery);
  }, [searchQuery, loadPosts]);

  const search = useCallback((query: string) => {
    previousSearchQuery.current = query;
    hasLoadedInitially.current = false;
    setCurrentPage(1);
    setHasMore(true);
    loadPosts(1, query);
  }, [loadPosts]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (isLoadingRef.current) {
      return;
    }

    const searchChanged = previousSearchQuery.current !== searchQuery;
    const shouldLoad = !hasLoadedInitially.current || searchChanged;
    
    if (shouldLoad) {
      hasLoadedInitially.current = true;
      previousSearchQuery.current = searchQuery;
      hasErrorRef.current = false;
      
      if (searchChanged) {
        setCurrentPage(1);
        setHasMore(true);
      }
      loadPosts(1, searchQuery);
    }
  }, [searchQuery, enabled, loadPosts]);

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

