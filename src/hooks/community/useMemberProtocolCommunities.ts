import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { communityService } from '@/services/community/communityService';
import type { Community, CommunityCategory, CommunityFile } from '@/types/community';
import { PAGINATION } from '@/constants';
import { MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK } from '@/constants/community/communityProtocol';
import { communityProtocolCardBadges } from '@/utils/community/communityProtocolCardBadges';
import { resolveCommunityHeroImageUri } from '@/utils/community/mappers';
import { logger } from '@/utils/logger';
import type { JoinCardItem } from '@/components/ui/cards/JoinCard';

export type MemberProtocolCardItem = JoinCardItem & {
  communityId: string;
  description?: string | null;
  agreement?: string | null;
};

function filterProtocolsBySearch(items: MemberProtocolCardItem[], searchQuery: string): MemberProtocolCardItem[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) {
    return items;
  }
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(query) || item.badges.some((badge) => badge.toLowerCase().includes(query)),
  );
}

export function useMemberProtocolCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [communityFiles, setCommunityFiles] = useState<CommunityFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const loadingRef = useRef(false);

  const loadPage = useCallback(async (page: number, append: boolean) => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;

    try {
      if (page === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const response = await communityService.listMemberProtocolCommunities({
        page,
        limit: PAGINATION.DEFAULT_PAGE_SIZE,
      });

      const isSuccess = response.success === true || response.status === 'success';
      if (!isSuccess || !response.data) {
        throw new Error(response.message || 'Erro ao listar protocolos');
      }

      const nextCommunities = response.data.communities ?? [];
      const nextCategories = response.data.categories ?? [];
      const nextFiles = response.data.files ?? [];
      const pagination = response.data.pagination ?? response.pagination;

      setCommunities((prev) => (append ? [...prev, ...nextCommunities] : nextCommunities));
      if (!append) {
        setCategories(nextCategories);
        setCommunityFiles(nextFiles);
      } else if (nextFiles.length > 0) {
        setCommunityFiles((prev) => {
          const byId = new Map(prev.map((file) => [file.fileId, file]));
          for (const file of nextFiles) {
            if (file?.fileId) {
              byId.set(file.fileId, file);
            }
          }
          return Array.from(byId.values());
        });
      }

      const totalPages = pagination?.totalPages ?? 1;
      setCurrentPage(page);
      setHasMore(page < totalPages);
    } catch (loadError) {
      logger.error('[useMemberProtocolCommunities] Falha ao carregar protocolos', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Erro ao listar protocolos');
      if (!append) {
        setCommunities([]);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const reload = useCallback(async () => {
    setCurrentPage(1);
    setHasMore(false);
    await loadPage(1, false);
  }, [loadPage]);

  useEffect(() => {
    void loadPage(1, false);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      void loadPage(currentPage + 1, true);
    }
  }, [currentPage, hasMore, loading, loadingMore, loadPage]);

  const protocolCards = useMemo((): MemberProtocolCardItem[] => {
    return communities.map((community) => ({
      id: community.communityId,
      communityId: community.communityId,
      title: community.displayName,
      badges: communityProtocolCardBadges(community, categories),
      image: resolveCommunityHeroImageUri(community, communityFiles, MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK),
      description: community.description ?? community.socialDescription ?? null,
      agreement: community.agreement ?? null,
    }));
  }, [categories, communities, communityFiles]);

  const filteredProtocols = useMemo(
    () => filterProtocolsBySearch(protocolCards, searchQuery),
    [protocolCards, searchQuery],
  );

  return {
    searchQuery,
    setSearchQuery,
    loading,
    loadingMore,
    error,
    protocols: filteredProtocols,
    hasMore,
    loadMore,
    reload,
  };
}
