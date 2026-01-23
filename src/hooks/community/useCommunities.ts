import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { communityService } from '@/services';
import type { Community, CommunityCategory, ListCommunitiesParams } from '@/types/community';
import { PAGINATION } from '@/constants';
import { logger } from '@/utils/logger';

interface UseCommunitiesOptions {
  enabled?: boolean;
  pageSize?: number;
  params?: Partial<ListCommunitiesParams>;
}

const DEFAULT_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

interface UseCommunitiesReturn {
  communities: Community[];
  categories: CommunityCategory[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  paging: {
    next: string | null;
    previous: string | null;
  } | null;
  loadCommunities: (page: number, append?: boolean) => Promise<void>;
  loadMore: () => void;
  refresh: () => void;
}

export const useCommunities = (options: UseCommunitiesOptions = {}): UseCommunitiesReturn => {
  const { enabled = true, pageSize = DEFAULT_PAGE_SIZE, params = {} } = options;

  const [communities, setCommunities] = useState<Community[]>([]);
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paging, setPaging] = useState<{
    next: string | null;
    previous: string | null;
  } | null>(null);

  const paramsKey = JSON.stringify(params ?? {});
  const memoizedParams = useMemo(() => params ?? {}, [paramsKey]);

  const hasLoadedInitially = useRef(false);
  const previousParamsKey = useRef<string>('');
  const isLoadingRef = useRef(false);
  const hasErrorRef = useRef(false);

  const loadCommunities = useCallback(
    async (page: number, append: boolean = false) => {
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

        const response = await communityService.listCommunities({
          page,
          limit: pageSize,
          ...memoizedParams,
        });

        const isSuccess = response.success === true || response.status === 'success';

        if (!isSuccess || !response.data) {
          throw new Error(response.message || 'Erro ao listar comunidades');
        }

        const communitiesList = response.data.communities || [];
        const categoriesList = response.data.categories || [];
        const pagingData = response.data.paging || null;

        logger.debug('Communities list response:', {
          success: response.success,
          status: response.status,
          communitiesCount: communitiesList.length,
          categoriesCount: categoriesList.length,
          hasPaging: !!pagingData,
          next: pagingData?.next || null,
          previous: pagingData?.previous || null,
        });

        if (append) {
          setCommunities((prev) => [...prev, ...communitiesList]);
        } else {
          setCommunities(communitiesList);
          // Categories são atualizadas apenas na primeira página
          setCategories(categoriesList);
        }

        setCurrentPage(page);
        setPaging(pagingData);

        // Determina se há mais páginas baseado no paging.next ou pagination
        const hasMorePages = pagingData?.next !== null && pagingData?.next !== undefined;
        const pagination = response.data.pagination || response.pagination;
        const hasMoreFromPagination = pagination ? page < pagination.totalPages : false;

        setHasMore(hasMorePages || hasMoreFromPagination);
      } catch (err) {
        hasErrorRef.current = true;
        const errorMessage = err instanceof Error ? err.message : 'Erro ao listar comunidades';
        setError(errorMessage);
        setHasMore(false);

        if (page === 1) {
          setCommunities([]);
          setCategories([]);
          setPaging(null);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [pageSize, memoizedParams]
  );

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading && enabled) {
      loadCommunities(currentPage + 1, true);
    }
  }, [currentPage, hasMore, loadingMore, loading, enabled, loadCommunities]);

  const refresh = useCallback(() => {
    hasLoadedInitially.current = false;
    previousParamsKey.current = '';
    setCurrentPage(1);
    setHasMore(true);
    loadCommunities(1);
  }, [loadCommunities]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (isLoadingRef.current) {
      return;
    }

    const paramsChanged = previousParamsKey.current !== paramsKey;
    const shouldLoad = !hasLoadedInitially.current || paramsChanged;

    if (shouldLoad) {
      hasLoadedInitially.current = true;
      previousParamsKey.current = paramsKey;
      hasErrorRef.current = false;

      if (paramsChanged) {
        setCurrentPage(1);
        setHasMore(true);
      }
      loadCommunities(1);
    }
  }, [enabled, loadCommunities, paramsKey]);

  return {
    communities,
    categories,
    loading,
    loadingMore,
    error,
    hasMore,
    currentPage,
    paging,
    loadCommunities,
    loadMore,
    refresh,
  };
};
