export const COMMUNITY_POST_SHARE_PATH_PREFIX = '/post';
export const COMMUNITY_SHARE_PATH_PREFIX = '/community';

export const SHARE_CONTENT_TYPES = {
  COMMUNITY_POST: 'community_post',
  COMMUNITY: 'community',
} as const;

export type ShareContentType = (typeof SHARE_CONTENT_TYPES)[keyof typeof SHARE_CONTENT_TYPES];

/** Tela principal do app após onboarding (HomeScreen redireciona para Summary). */
export const SHARE_DEEP_LINK_HOME_SCREEN = 'Summary' as const;
