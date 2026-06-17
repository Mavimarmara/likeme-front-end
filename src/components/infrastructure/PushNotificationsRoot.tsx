import React, { useCallback, useEffect } from 'react';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { useNotifications } from '@/hooks/notification/useNotifications';
import type { RootStackParamList } from '@/types/navigation';
import { flushPendingPushNavigation, openPushNotificationTarget } from '@/utils/navigation/openPushNotificationTarget';
import type { RemoteMessage } from '@/services/notification/notificationService';

type Props = {
  activeRouteName: string | undefined;
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
};

const PushNotificationsRoot: React.FC<Props> = ({ activeRouteName, navigationRef }) => {
  const handleNotificationOpened = useCallback(
    (message: RemoteMessage) => {
      openPushNotificationTarget(navigationRef, message, activeRouteName);
    },
    [activeRouteName, navigationRef],
  );

  useNotifications({ activeRouteName, onNotificationOpened: handleNotificationOpened });

  useEffect(() => {
    flushPendingPushNavigation(navigationRef, activeRouteName);
  }, [activeRouteName, navigationRef]);

  return null;
};

export default PushNotificationsRoot;
