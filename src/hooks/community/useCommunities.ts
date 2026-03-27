import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { communityService, chatService } from '@/services';
import type { Community, CommunityCategory, CommunityUserRelation, ListCommunitiesParams } from '@/types/community';
import type { Event } from '@/types';
import type { LiveBannerData } from '@/components/sections/community';
import type { CategoryName } from '@/types/category';
import { mapChannelsToEvents } from '@/utils';
import { PAGINATION } from '@/constants';
import { logger } from '@/utils/logger';

/** Formato do item exibido no JoinCard (ui/cards; comunidade recomendada) */
export interface JoinCommunityItem {
  id: string;
  title: string;
  badge: string;
  image: string;
}

const DEFAULT_COMMUNITY_IMAGE = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800';

interface UseCommunitiesOptions {
  enabled?: boolean;
  pageSize?: number;
  params?: Partial<ListCommunitiesParams>;
  /** Quando true, carrega canais live/broadcast e community para liveBanner e events */
  loadLiveChannels?: boolean;
  /** Texto para filtrar joinCommunities por título/badge (opcional) */
  searchQuery?: string;
  /** Se 'all' ou 'communities', filteredJoinCommunities inclui as comunidades; caso contrário, lista vazia */
  solutionTab?: string;
  /** Nome da categoria selecionada para o badge do primeiro card */
  selectedCategoryName?: CategoryName | null;
  /** Função para obter o label da categoria (usado no primeiro card) */
  getCategoryName?: (id: CategoryName) => string;
  /** URL da imagem do primeiro card (ex.: comunidade Dr. Diogo) */
  firstCardImageUrl?: string;
}

const DEFAULT_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

interface UseCommunitiesReturn {
  communities: Community[];
  categories: CommunityCategory[];
  communityUsers: CommunityUserRelation[];
  /** Lista no formato esperado pelo JoinCard */
  joinCommunities: JoinCommunityItem[];
  /** joinCommunities filtrado por solutionTab e searchQuery */
  filteredJoinCommunities: JoinCommunityItem[];
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
  /** Preenchido quando loadLiveChannels: true */
  liveBanner: LiveBannerData | undefined;
  /** Preenchido quando loadLiveChannels: true */
  events: Event[];
}

export const useCommunities = (options: UseCommunitiesOptions = {}): UseCommunitiesReturn => {
  const {
    enabled = true,
    pageSize = DEFAULT_PAGE_SIZE,
    params = {},
    loadLiveChannels = false,
    searchQuery = '',
    solutionTab = 'all',
    selectedCategoryName = null,
    getCategoryName,
    firstCardImageUrl,
  } = options;

  const [communities, setCommunities] = useState<Community[]>([]);
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [communityUsers, setCommunityUsers] = useState<CommunityUserRelation[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paging, setPaging] = useState<{
    next: string | null;
    previous: string | null;
  } | null>(null);
  const [liveBanner, setLiveBanner] = useState<LiveBannerData | undefined>(undefined);
  const [events, setEvents] = useState<Event[]>([]);

  const paramsKey = JSON.stringify(params ?? {});
  const memoizedParams = useMemo(() => params ?? {}, [paramsKey]);

  const hasLoadedInitially = useRef(false);
  const previousParamsKey = useRef<string>('');
  const isLoadingRef = useRef(false);
  const hasErrorRef = useRef(false);

  const loadCommunities = useCallback(
    async (page: number, append = false) => {
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
        const communityUsersList = response.data.communityUsers || [];
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
        setCommunityUsers(communityUsersList);

        setCurrentPage(page);
        setPaging(
          pagingData
            ? {
                next: pagingData.next ?? null,
                previous: pagingData.previous ?? null,
              }
            : null,
        );

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
          setCommunityUsers([]);
          setPaging(null);
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

  useEffect(() => {
    if (!loadLiveChannels) return;
    const loadChannels = async () => {
      try {
        const [liveAndBroadcastChannelsResponse, communityChannelsResponse] = await Promise.all([
          chatService.getChannels({ types: ['live', 'broadcast'] }),
          chatService.getChannels({ types: 'community' }),
        ]);

        if (liveAndBroadcastChannelsResponse.success && liveAndBroadcastChannelsResponse.data?.channels) {
          const liveAndBroadcastChannels = liveAndBroadcastChannelsResponse.data.channels;
          setEvents(mapChannelsToEvents(liveAndBroadcastChannels));

          if (liveAndBroadcastChannels.length > 0) {
            const firstChannel = liveAndBroadcastChannels[0];
            const metadata = firstChannel.metadata || {};
            const thumbnail =
              (metadata.thumbnailUrl as string) ||
              (firstChannel.avatarFileId
                ? undefined
                : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400');

            setLiveBanner({
              id: firstChannel.channelId,
              title: (metadata.title as string) || firstChannel.displayName || 'Live Session',
              host: (metadata.host as string) || 'Host',
              status: 'Live Now' as const,
              startTime: (metadata.startTime as string) || '08:00 pm',
              endTime: (metadata.endTime as string) || '10:00 pm',
              thumbnail,
            });
          } else {
            setLiveBanner(undefined);
          }
        } else {
          setLiveBanner(undefined);
          setEvents([]);
        }

        if (communityChannelsResponse.success && communityChannelsResponse.data?.channels) {
          // Canal de comunidade disponível; redirecionamento para chat pode ser feito por outro fluxo
        }
      } catch (err) {
        logger.error('Error loading channels:', err);
        setLiveBanner(undefined);
        setEvents([]);
      }
    };
    loadChannels();
  }, [loadLiveChannels]);

  const joinCommunities = useMemo((): JoinCommunityItem[] => {
    const list: JoinCommunityItem[] = communities.map((community) => {
      const category = categories.length > 0 ? categories[0] : undefined;
      return {
        id: community.communityId,
        title: community.displayName,
        badge: category?.name ?? 'Community',
        image: DEFAULT_COMMUNITY_IMAGE,
      };
    });
    if (list.length > 0 && (firstCardImageUrl != null || (getCategoryName != null && selectedCategoryName != null))) {
      list[0] = {
        ...list[0],
        badge:
          getCategoryName != null && selectedCategoryName != null
            ? getCategoryName(selectedCategoryName)
            : list[0].badge,
        image: firstCardImageUrl ?? list[0].image,
      };
    }
    return list;
  }, [communities, categories, selectedCategoryName, getCategoryName, firstCardImageUrl]);

  const filteredJoinCommunities = useMemo((): JoinCommunityItem[] => {
    const base = solutionTab === 'all' || solutionTab === 'communities' ? joinCommunities : [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter((c) => c.title.toLowerCase().includes(q) || c.badge.toLowerCase().includes(q));
  }, [joinCommunities, searchQuery, solutionTab]);

  return {
    communities,
    categories,
    communityUsers,
    joinCommunities,
    filteredJoinCommunities,
    loading,
    loadingMore,
    error,
    hasMore,
    currentPage,
    paging,
    loadCommunities,
    loadMore,
    refresh,
    liveBanner,
    events,
  };
};
