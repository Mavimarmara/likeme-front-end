import { CommonActions, type NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { GA4_EVENTS, logEvent, ANALYTICS_PARAMS } from '@/analytics';
import { COMMUNITY_POST_SHARE_PATH_PREFIX, SHARE_CONTENT_TYPES } from '@/constants/share';
import type { CommunityStackParamList, RootStackParamList } from '@/types/navigation';
import {
  canNavigateFromDeepLink,
  consumePendingDeepLinkNavigation,
  setPendingDeepLinkNavigation,
  type PendingDeepLinkNavigationTarget,
} from '@/utils/navigation/pendingDeepLinkNavigation';

const POST_PATH_PREFIX = `${COMMUNITY_POST_SHARE_PATH_PREFIX.replace(/^\/+/, '')}/`;

export function communityPostIdFromSharePath(path: string): string | null {
  const normalized = path.replace(/^\/+/, '');
  if (!normalized.startsWith(POST_PATH_PREFIX)) {
    return null;
  }

  const postId = normalized.slice(POST_PATH_PREFIX.length).split('/')[0]?.trim();
  return postId ? decodeURIComponent(postId) : null;
}

export function communityPostIdFromShareUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  let path = trimmed;
  if (trimmed.includes('://')) {
    try {
      const parsed = new URL(trimmed);
      const scheme = parsed.protocol.replace(':', '');
      if (scheme !== 'http' && scheme !== 'https') {
        return null;
      }
      path = parsed.pathname;
    } catch {
      return null;
    }
  }

  return communityPostIdFromSharePath(path);
}

function communityPostDeepLinkTarget(postId: string): PendingDeepLinkNavigationTarget {
  return {
    screen: 'Community',
    params: {
      screen: 'PostDetail',
      params: { postId } as CommunityStackParamList['PostDetail'],
    } as RootStackParamList['Community'],
  };
}

export function communityPostDeepLinkTargetFromUrl(url: string): PendingDeepLinkNavigationTarget | null {
  const postId = communityPostIdFromShareUrl(url);
  return postId ? communityPostDeepLinkTarget(postId) : null;
}

function dispatchDeepLinkTarget(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  target: PendingDeepLinkNavigationTarget,
): void {
  navigationRef.dispatch(
    CommonActions.navigate({
      name: target.screen,
      params: target.params,
    }),
  );
}

export function openDeepLinkTarget(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  url: string,
  activeRouteName: string | undefined,
): void {
  const postId = communityPostIdFromShareUrl(url);
  if (!postId || !navigationRef.isReady()) {
    return;
  }

  const target = communityPostDeepLinkTarget(postId);

  logEvent(GA4_EVENTS.SELECT_CONTENT, {
    [ANALYTICS_PARAMS.CONTENT_TYPE]: SHARE_CONTENT_TYPES.COMMUNITY_POST,
    [ANALYTICS_PARAMS.ITEM_ID]: postId,
    [ANALYTICS_PARAMS.ACTION_NAME]: 'deep_link_open',
  });

  if (!canNavigateFromDeepLink(activeRouteName)) {
    setPendingDeepLinkNavigation(target);
    return;
  }

  dispatchDeepLinkTarget(navigationRef, target);
}

export function flushPendingDeepLinkNavigation(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  activeRouteName: string | undefined,
): void {
  if (!navigationRef.isReady() || !canNavigateFromDeepLink(activeRouteName)) {
    return;
  }

  const target = consumePendingDeepLinkNavigation();
  if (!target) {
    return;
  }

  dispatchDeepLinkTarget(navigationRef, target);
}
