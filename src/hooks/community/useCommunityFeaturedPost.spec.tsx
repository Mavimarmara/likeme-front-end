import { renderHook, waitFor } from '@testing-library/react-native';
import { useCommunityFeaturedPost, featuredPayloadFromResponse } from '@/hooks/community/useCommunityFeaturedPost';
import { communityService } from '@/services';

jest.mock('@/services', () => ({
  communityService: {
    getCommunityFeaturedPost: jest.fn(),
  },
}));

jest.mock('@/utils/logger', () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('featuredPayloadFromResponse', () => {
  it('lê payload aninhado data.data', () => {
    const payload = featuredPayloadFromResponse({
      success: true,
      data: {
        status: 'ok',
        data: {
          post: { postId: 'featured-1', createdAt: '2026-01-01T00:00:00Z' },
          posts: [],
        },
      },
    });

    expect(payload?.post?.postId).toBe('featured-1');
  });
});

describe('useCommunityFeaturedPost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca destaque e mapeia Post com isFeatured', async () => {
    (communityService.getCommunityFeaturedPost as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        status: 'ok',
        data: {
          post: {
            postId: 'featured-1',
            postedUserId: 'user-1',
            createdAt: '2026-01-01T00:00:00Z',
            data: { text: 'Destaque' },
          },
          posts: [],
          users: [{ userId: 'user-1', displayName: 'Ana' }],
        },
      },
    });

    const { result } = renderHook(() => useCommunityFeaturedPost({ communityId: 'community-a', enabled: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(communityService.getCommunityFeaturedPost).toHaveBeenCalledWith('community-a');
    expect(result.current.post?.id).toBe('featured-1');
    expect(result.current.post?.isFeatured).toBe(true);
  });

  it('retorna null quando endpoint não traz post', async () => {
    (communityService.getCommunityFeaturedPost as jest.Mock).mockResolvedValue({
      success: true,
      data: { status: 'ok', data: { post: null, posts: [] } },
    });

    const { result } = renderHook(() => useCommunityFeaturedPost({ communityId: 'community-a', enabled: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.post).toBeNull();
  });

  it('não consulta API quando disabled', async () => {
    const { result } = renderHook(() => useCommunityFeaturedPost({ communityId: 'community-a', enabled: false }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(communityService.getCommunityFeaturedPost).not.toHaveBeenCalled();
    expect(result.current.post).toBeNull();
  });
});
