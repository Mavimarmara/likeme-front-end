import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useUserFeed } from './useUserFeed';
import { communityService } from '@/services';

jest.mock('@/services', () => ({
  communityService: {
    getUserFeed: jest.fn(),
    getCommunityPosts: jest.fn(),
  },
}));

jest.mock('@/utils/community/mappers', () => ({
  mapCommunityPostsForFeedList: jest.fn((posts: Array<{ postId: string }>) =>
    posts.map((p) => ({
      id: p.postId,
      content: '',
      comments: [],
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    })),
  ),
}));

jest.mock('@/utils/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

const getUserFeedMock = communityService.getUserFeed as jest.MockedFunction<typeof communityService.getUserFeed>;
const getCommunityPostsMock = communityService.getCommunityPosts as jest.MockedFunction<
  typeof communityService.getCommunityPosts
>;

const feedPayload = (options: {
  posts: Array<{ postId: string }>;
  paging?: { next?: string };
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}) => ({
  success: true as const,
  data: {
    status: 'ok' as const,
    data: {
      posts: options.posts.map((post) => ({
        createdAt: '2026-01-01T00:00:00.000Z',
        ...post,
      })),
      files: [],
      users: [],
      comments: [],
      postChildren: [],
      ...(options.paging !== undefined ? { paging: options.paging } : {}),
    },
    ...(options.pagination !== undefined ? { pagination: options.pagination } : {}),
  },
});

describe('useUserFeed (scroll infinito / paginação)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('na primeira página não envia token e define hasMore quando há paging.next', async () => {
    (communityService.getUserFeed as jest.Mock).mockResolvedValue(
      feedPayload({
        posts: [{ postId: 'a1' }],
        paging: { next: 'cursor-page-2' },
      }),
    );

    const { result } = renderHook(() => useUserFeed({ pageSize: 10, searchQuery: '' }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(communityService.getUserFeed).toHaveBeenCalledTimes(1);
    expect(communityService.getUserFeed).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 10 }));
    expect(getUserFeedMock.mock.calls[0][0]).not.toHaveProperty('token');

    expect(result.current.posts.map((p) => p.id)).toEqual(['a1']);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.currentPage).toBe(1);
  });

  it('loadMore envia page=2 e token igual ao paging.next da página anterior', async () => {
    (communityService.getUserFeed as jest.Mock)
      .mockResolvedValueOnce(
        feedPayload({
          posts: [{ postId: 'p1' }],
          paging: { next: 'next-tok-xyz' },
        }),
      )
      .mockResolvedValueOnce(
        feedPayload({
          posts: [{ postId: 'p2' }],
          paging: {},
        }),
      );

    const { result } = renderHook(() => useUserFeed({ pageSize: 10, searchQuery: '' }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.loadingMore).toBe(false));

    expect(communityService.getUserFeed).toHaveBeenCalledTimes(2);
    expect(communityService.getUserFeed).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        page: 2,
        limit: 10,
        token: 'next-tok-xyz',
      }),
    );

    expect(result.current.posts.map((p) => p.id)).toEqual(['p1', 'p2']);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.currentPage).toBe(2);
  });

  it('sem paging.next e menos posts que pageSize: hasMore false e loadMore não chama API de novo', async () => {
    (communityService.getUserFeed as jest.Mock).mockResolvedValue(
      feedPayload({
        posts: [{ postId: 'only' }],
        paging: {},
      }),
    );

    const { result } = renderHook(() => useUserFeed({ pageSize: 10, searchQuery: '' }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasMore).toBe(false);

    await act(async () => {
      result.current.loadMore();
    });

    expect(communityService.getUserFeed).toHaveBeenCalledTimes(1);
  });

  it('página cheia sem paging.next: hasMore heurístico true, loadMore não dispara fetch sem cursor', async () => {
    const ten = Array.from({ length: 10 }, (_, i) => ({ postId: `full-${i}` }));
    (communityService.getUserFeed as jest.Mock).mockResolvedValue(
      feedPayload({
        posts: ten,
        paging: {},
      }),
    );

    const { result } = renderHook(() => useUserFeed({ pageSize: 10, searchQuery: '' }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasMore).toBe(true);
    expect(result.current.posts).toHaveLength(10);

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.hasMore).toBe(false));
    expect(communityService.getUserFeed).toHaveBeenCalledTimes(1);
  });

  it('refresh volta à página 1 e nova carga não reutiliza token antigo', async () => {
    (communityService.getUserFeed as jest.Mock)
      .mockResolvedValueOnce(
        feedPayload({
          posts: [{ postId: 'old' }],
          paging: { next: 'stale-cursor' },
        }),
      )
      .mockResolvedValueOnce(
        feedPayload({
          posts: [{ postId: 'fresh' }],
          paging: {},
        }),
      );

    const { result } = renderHook(() => useUserFeed({ pageSize: 10, searchQuery: '' }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.posts[0]?.id).toBe('old');

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => expect(result.current.posts[0]?.id).toBe('fresh'));

    expect(communityService.getUserFeed).toHaveBeenCalledTimes(2);
    expect(communityService.getUserFeed).toHaveBeenNthCalledWith(2, expect.objectContaining({ page: 1, limit: 10 }));
    expect(getUserFeedMock.mock.calls[1][0]).not.toHaveProperty('token');
  });

  it('com enabled=false não dispara getUserFeed no mount', async () => {
    const { result } = renderHook(() => useUserFeed({ enabled: false, searchQuery: '' }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(communityService.getUserFeed).not.toHaveBeenCalled();
    expect(result.current.posts).toEqual([]);
  });

  it('com communityId usa getCommunityPosts e loadMore pagina por page sem token', async () => {
    getCommunityPostsMock
      .mockResolvedValueOnce(
        feedPayload({
          posts: [{ postId: 'c1' }],
          paging: {},
          pagination: { page: 1, limit: 10, total: 1, totalPages: 2 },
        }),
      )
      .mockResolvedValueOnce(
        feedPayload({
          posts: [{ postId: 'c2' }],
          paging: {},
          pagination: { page: 2, limit: 10, total: 1, totalPages: 2 },
        }),
      );

    const { result } = renderHook(() =>
      useUserFeed({
        pageSize: 10,
        searchQuery: '',
        params: { communityId: 'community-abc' },
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(getCommunityPostsMock).toHaveBeenCalledTimes(1);
    expect(getCommunityPostsMock).toHaveBeenCalledWith(
      'community-abc',
      expect.objectContaining({ page: 1, limit: 10 }),
    );
    expect(getUserFeedMock).not.toHaveBeenCalled();
    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.loadingMore).toBe(false));
    expect(getCommunityPostsMock).toHaveBeenCalledTimes(2);
    expect(getCommunityPostsMock).toHaveBeenNthCalledWith(
      2,
      'community-abc',
      expect.objectContaining({ page: 2, limit: 10 }),
    );
    expect(getCommunityPostsMock.mock.calls[1][1]).not.toHaveProperty('token');
    expect(result.current.posts.map((p) => p.id)).toEqual(['c1', 'c2']);
  });
});
