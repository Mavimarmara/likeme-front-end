import type { RootStackParamList } from '@/types/navigation';
import type { PendingPushNavigationTarget } from '@/utils/navigation/pendingPushNavigation';

export const ACTIVITY_CREATED_PUSH_TYPE = 'activity_created';
export const ACTIVITY_REMINDER_PUSH_TYPE = 'activity_reminder';

function activityNavigationTarget(activityId: string | undefined): PendingPushNavigationTarget | null {
  if (!activityId?.trim()) {
    return { screen: 'Activities', params: { initialTab: 'actives' } };
  }

  return {
    screen: 'Activities',
    params: {
      initialTab: 'actives',
      focusActivityId: activityId.trim(),
    },
  };
}

export function pushNavigationTargetFromData(
  data: Record<string, string> | undefined,
): PendingPushNavigationTarget | null {
  if (!data?.type) {
    return null;
  }

  if (data.type === ACTIVITY_CREATED_PUSH_TYPE || data.type === ACTIVITY_REMINDER_PUSH_TYPE) {
    return activityNavigationTarget(data.activityId);
  }

  return null;
}

export function navigateToPushTarget(
  navigate: (screen: keyof RootStackParamList, params?: RootStackParamList[keyof RootStackParamList]) => void,
  target: PendingPushNavigationTarget,
): void {
  navigate(target.screen, target.params);
}
