import {
  COMMUNITY_MEDIA_TEST_ID,
  communitiesWithMediaTestStub,
  communityMediaTestStub,
  isCommunityMediaTestId,
} from '@/constants/community/communityMediaTest';

describe('communityMediaTest', () => {
  const originalDev = (global as { __DEV__?: boolean }).__DEV__;

  afterEach(() => {
    (global as { __DEV__?: boolean }).__DEV__ = originalDev;
  });

  it('injeta stub no topo em __DEV__ quando a comunidade não está na lista', () => {
    (global as { __DEV__?: boolean }).__DEV__ = true;

    const list = communitiesWithMediaTestStub([
      {
        communityId: 'other',
        displayName: 'Outra',
        isPublic: true,
        membersCount: 1,
        postsCount: 0,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ]);

    expect(list[0]?.communityId).toBe(COMMUNITY_MEDIA_TEST_ID);
    expect(list).toHaveLength(2);
  });

  it('não duplica quando a comunidade de teste já existe', () => {
    (global as { __DEV__?: boolean }).__DEV__ = true;

    const existing = communityMediaTestStub();
    const list = communitiesWithMediaTestStub([existing]);

    expect(list).toHaveLength(1);
    expect(isCommunityMediaTestId(list[0]?.communityId)).toBe(true);
  });
});
