import { CommonActions, type NavigationContainerRefWithCurrent } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import {
  canNavigateFromPush,
  consumePendingPushNavigation,
  setPendingPushNavigation,
  type PendingPushNavigationTarget,
} from '@/utils/navigation/pendingPushNavigation';
import { pushNavigationTargetFromData } from '@/utils/navigation/pushNotificationNavigation';
import type { RemoteMessage } from '@/services/notification/notificationService';

function dispatchPushTarget(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  target: PendingPushNavigationTarget,
): void {
  navigationRef.dispatch(
    CommonActions.navigate({
      name: target.screen,
      params: target.params,
    }),
  );
}

export function openPushNotificationTarget(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  message: RemoteMessage,
  activeRouteName: string | undefined,
): void {
  const target = pushNavigationTargetFromData(message.data);
  if (!target || !navigationRef.isReady()) {
    return;
  }

  if (!canNavigateFromPush(activeRouteName)) {
    setPendingPushNavigation(target);
    return;
  }

  dispatchPushTarget(navigationRef, target);
}

export function flushPendingPushNavigation(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
  activeRouteName: string | undefined,
): void {
  if (!navigationRef.isReady() || !canNavigateFromPush(activeRouteName)) {
    return;
  }

  const target = consumePendingPushNavigation();
  if (!target) {
    return;
  }

  dispatchPushTarget(navigationRef, target);
}
