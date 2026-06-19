import { useEffect, useRef, useState } from 'react';
import type { Post } from '@/types';
import { communityService } from '@/services';
import { logger } from '@/utils/logger';
import { mapCommunityPostToPost } from '@/utils/community/mappers';
import type { CommunityFeaturedPostApiResponse, CommunityFeaturedPostData } from '@/types/community';

export type UseCommunityFeaturedPostOptions = {
  communityId: string | undefined;
  enabled?: boolean;
};

export type UseCommunityFeaturedPostReturn = {
  post: Post | null;
  loading: boolean;
};

function isFeaturedResponseSuccess(response: CommunityFeaturedPostApiResponse): boolean {
  return response.success === true || response.data?.status === 'ok' || response.data?.data != null;
}

export function featuredPayloadFromResponse(
  response: CommunityFeaturedPostApiResponse,
): CommunityFeaturedPostData | undefined {
  if (response.data?.data) {
    return response.data.data;
  }
  if (response.data && 'post' in response.data) {
    return response.data as CommunityFeaturedPostData;
  }
  return undefined;
}

export function useCommunityFeaturedPost({
  communityId,
  enabled = true,
}: UseCommunityFeaturedPostOptions): UseCommunityFeaturedPostReturn {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const latestCommunityIdRef = useRef(communityId);
  latestCommunityIdRef.current = communityId;

  useEffect(() => {
    const trimmedCommunityId = communityId?.trim();
    if (!enabled || !trimmedCommunityId) {
      setPost(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const response = await communityService.getCommunityFeaturedPost(trimmedCommunityId);
        if (cancelled || latestCommunityIdRef.current?.trim() !== trimmedCommunityId) {
          return;
        }

        if (!isFeaturedResponseSuccess(response)) {
          setPost(null);
          return;
        }

        const payload = featuredPayloadFromResponse(response);
        const featuredCommunityPost = payload?.post;
        if (!featuredCommunityPost) {
          setPost(null);
          return;
        }

        const mapped = mapCommunityPostToPost(
          featuredCommunityPost,
          payload?.files,
          payload?.users,
          payload?.comments,
          payload?.postChildren,
          payload?.posts,
          { includeComments: false, isFeatured: true },
        );
        setPost(mapped);
      } catch (error) {
        if (!cancelled) {
          logger.warn('[useCommunityFeaturedPost] falha ao carregar destaque', {
            communityId: trimmedCommunityId,
            cause: error,
          });
          setPost(null);
        }
      } finally {
        if (!cancelled && latestCommunityIdRef.current?.trim() === trimmedCommunityId) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [communityId, enabled]);

  return { post, loading };
}
