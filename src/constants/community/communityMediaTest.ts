import type { Community } from '@/types/community';

/** Comunidade de QA para posts com mídia variada (imagens, vídeo, arquivos). */
export const COMMUNITY_MEDIA_TEST_ID = '6a296b65526861aa43fb9a16';

export function isCommunityMediaTestId(communityId: string | undefined | null): boolean {
  return communityId?.trim() === COMMUNITY_MEDIA_TEST_ID;
}

export function communityMediaTestStub(): Community {
  return {
    communityId: COMMUNITY_MEDIA_TEST_ID,
    displayName: 'Comunidade teste mídia',
    description: 'Ambiente local (__DEV__) para validar anexos no feed.',
    socialDescription: 'Posts mockados com imagem, vídeo e PDF.',
    isPublic: true,
    membersCount: 1,
    postsCount: 5,
    createdAt: '2026-06-08T12:00:00.000Z',
  };
}

/** Garante a comunidade de QA na listagem em desenvolvimento (sem depender do join na API). */
export function communitiesWithMediaTestStub(communities: Community[]): Community[] {
  if (!__DEV__) {
    return communities;
  }

  if (communities.some((community) => isCommunityMediaTestId(community.communityId))) {
    return communities;
  }

  return [communityMediaTestStub(), ...communities];
}
