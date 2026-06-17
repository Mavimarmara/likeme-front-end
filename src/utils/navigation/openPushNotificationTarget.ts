import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import {
  canNavigateFromPush,
  consumePendingPushNavigation,
  setPendingPushNavigation,
} from '@/utils/navigation/pendingPushNavigation';
import { navigateToPushTarget, pushNavigationTargetFromData } from '@/utils/navigation/pushNotificationNavigation';
import type { RemoteMessage } from '@/services/notification/notificationService';

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

  navigateToPushTarget((screen, params) => navigationRef.navigate(screen, params), target);
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

  navigateToPushTarget((screen, params) => navigationRef.navigate(screen, params), target);
}
