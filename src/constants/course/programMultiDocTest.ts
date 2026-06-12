import type { Community } from '@/types/community';

/** Comunidade de QA para protocolo com vários arquivos para download. */
export const PROGRAM_MULTI_DOC_TEST_COMMUNITY_ID = 'mock-program-multi-doc-qa';

export function isProgramMultiDocTestCommunityId(communityId: string | undefined | null): boolean {
  return communityId?.trim() === PROGRAM_MULTI_DOC_TEST_COMMUNITY_ID;
}

export function programMultiDocTestCommunityStub(): Community {
  return {
    communityId: PROGRAM_MULTI_DOC_TEST_COMMUNITY_ID,
    displayName: '[Mock] Protocolo — vários downloads',
    description: 'Ambiente local (__DEV__) para validar múltiplos anexos no conteúdo do programa.',
    socialDescription: 'Sessão mockada com PDF, planilha e documento.',
    isPublic: true,
    membersCount: 1,
    postsCount: 1,
    createdAt: '2026-06-10T12:00:00.000Z',
  };
}

export function memberProtocolCommunitiesWithMultiDocTestStub(communities: Community[]): Community[] {
  if (!__DEV__) {
    return communities;
  }

  if (communities.some((community) => isProgramMultiDocTestCommunityId(community.communityId))) {
    return communities;
  }

  return [programMultiDocTestCommunityStub(), ...communities];
}
