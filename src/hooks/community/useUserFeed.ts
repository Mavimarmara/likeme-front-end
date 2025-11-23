import { useState, useEffect, useCallback, useRef } from 'react';
import { communityService } from '@/services';
import type { Post } from '@/types';
import type { CommunityFeedData } from '@/types/community';
import { mapCommunityPostToPost } from '@/utils/community/mappers';
import { PAGINATION } from '@/constants';
import { logger } from '@/utils/logger';

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
          search: search,
        });

        const isSuccess = userFeedResponse.success === true || 
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

        logger.debug('User feed response:', {
          success: userFeedResponse.success,
          status: userFeedResponse.status || userFeedResponse.data?.status,
          postsCount: feedData.posts?.length || 0,
          filesCount: feedData.files?.length || 0,
          hasPagination: !!pagination,
        });

        logger.debug('Raw posts from API:', {
          postsArray: feedData.posts,
          postsLength: feedData.posts?.length || 0,
          firstPostRaw: feedData.posts?.[0] || null,
        });

        const mappedPosts: Post[] = (feedData.posts || [])
          .map((communityPost) =>
            mapCommunityPostToPost(communityPost, feedData.files, feedData.users, feedData.comments)
          )
          .filter((post): post is Post => post !== null);

        logger.debug('Mapped posts:', {
          count: mappedPosts.length,
          commentsCount: feedData.comments?.length || 0,
          posts: mappedPosts.map(p => ({
            id: p.id,
            userId: p.userId,
            contentLength: p.content?.length || 0,
            hasImage: !!p.image,
            commentsCount: p.comments?.length || 0,
            hasPoll: !!p.poll,
          })),
        });

        if (append) {
          setPosts((prev) => [...prev, ...mappedPosts]);
        } else {
          setPosts(mappedPosts);
        }

        setCurrentPage(page);
        
        const hasMorePages = pagination 
          ? page < pagination.totalPages 
          : feedData.paging?.next !== undefined;
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

