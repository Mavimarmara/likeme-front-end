import { CommonActions, type NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { GA4_EVENTS, logEvent, ANALYTICS_PARAMS } from '@/analytics';
import { SHARE_CONFIG } from '@/config/environment';
import {
  COMMUNITY_POST_SHARE_PATH_PREFIX,
  COMMUNITY_SHARE_PATH_PREFIX,
  SHARE_CONTENT_TYPES,
  SHARE_DEEP_LINK_HOME_SCREEN,
  type ShareContentType,
} from '@/constants/share';
import type { CommunityStackParamList, RootStackParamList } from '@/types/navigation';
import {
  canNavigateFromDeepLink,
  consumePendingDeepLinkNavigation,
  setPendingDeepLinkNavigation,
  type PendingDeepLinkNavigationTarget,
} from '@/utils/navigation/pendingDeepLinkNavigation';
import { shareEntityIdFromPath, sharePathFromUrl } from '@/utils/share/sharePath';

type ShareDeepLinkMatch = {
  contentType: ShareContentType;
  itemId: string;
  target: PendingDeepLinkNavigationTarget;
};

const SHARE_HOME_TARGET: PendingDeepLinkNavigationTarget = {
  screen: SHARE_DEEP_LINK_HOME_SCREEN,
};

function shareHostFromBaseUrl(): string | null {
  try {
    return new URL(SHARE_CONFIG.baseUrl).host;
  } catch {
    return null;
  }
}

function isShareHostUrl(url: string): boolean {
  const shareHost = shareHostFromBaseUrl();
  if (!shareHost) {
    return false;
  }

  try {
    return new URL(url.trim()).host === shareHost;
  } catch {
    return false;
  }
}

function communityPostTarget(postId: string): PendingDeepLinkNavigationTarget {
  return {
    screen: 'Community',
    params: {
      screen: 'PostDetail',
      params: { postId } as CommunityStackParamList['PostDetail'],
    } as RootStackParamList['Community'],
  };
}

function communityFeedTarget(communityId: string): PendingDeepLinkNavigationTarget {
  return {
    screen: 'Community',
    params: {
      screen: 'CommunityList',
      params: { focusCommunityId: communityId } as CommunityStackParamList['CommunityList'],
    } as RootStackParamList['Community'],
  };
}

function shareDeepLinkMatchFromPath(path: string): ShareDeepLinkMatch | null {
  const postId = shareEntityIdFromPath(path, COMMUNITY_POST_SHARE_PATH_PREFIX);
  if (postId) {
    return {
      contentType: SHARE_CONTENT_TYPES.COMMUNITY_POST,
      itemId: postId,
      target: communityPostTarget(postId),
    };
  }

  const communityId = shareEntityIdFromPath(path, COMMUNITY_SHARE_PATH_PREFIX);
  if (communityId) {
    return {
      contentType: SHARE_CONTENT_TYPES.COMMUNITY,
      itemId: communityId,
      target: communityFeedTarget(communityId),
    };
  }

  return null;
}

export function shareDeepLinkTargetFromUrl(url: string): PendingDeepLinkNavigationTarget | null {
  const path = sharePathFromUrl(url);
  if (!path) {
    return null;
  }

  return shareDeepLinkMatchFromPath(path)?.target ?? null;
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
  if (!navigationRef.isReady()) {
    return;
  }

  const path = sharePathFromUrl(url);
  if (!path) {
    return;
  }

  const match = shareDeepLinkMatchFromPath(path);
  const target = match?.target ?? (isShareHostUrl(url) ? SHARE_HOME_TARGET : null);
  if (!target) {
    return;
  }

  if (match) {
    logEvent(GA4_EVENTS.SELECT_CONTENT, {
      [ANALYTICS_PARAMS.CONTENT_TYPE]: match.contentType,
      [ANALYTICS_PARAMS.ITEM_ID]: match.itemId,
      [ANALYTICS_PARAMS.ACTION_NAME]: 'deep_link_open',
    });
  } else {
    logEvent(GA4_EVENTS.SELECT_CONTENT, {
      [ANALYTICS_PARAMS.CONTENT_TYPE]: 'unknown',
      [ANALYTICS_PARAMS.ITEM_ID]: path,
      [ANALYTICS_PARAMS.ACTION_NAME]: 'deep_link_fallback_home',
    });
  }

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
