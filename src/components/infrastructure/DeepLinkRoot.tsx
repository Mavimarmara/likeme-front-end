import React, { useCallback, useEffect } from 'react';
import * as Linking from 'expo-linking';
import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import type { RootStackParamList } from '@/types/navigation';
import { flushPendingDeepLinkNavigation, openDeepLinkTarget } from '@/utils/share/communityPostShareDeepLink';

type Props = {
  activeRouteName: string | undefined;
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
};

const DeepLinkRoot: React.FC<Props> = ({ activeRouteName, navigationRef }) => {
  const handleIncomingUrl = useCallback(
    (url: string | null) => {
      if (!url) {
        return;
      }
      openDeepLinkTarget(navigationRef, url, activeRouteName);
    },
    [activeRouteName, navigationRef],
  );

  useEffect(() => {
    Linking.getInitialURL()
      .then(handleIncomingUrl)
      .catch(() => undefined);

    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleIncomingUrl(url);
    });

    return () => subscription.remove();
  }, [handleIncomingUrl]);

  useEffect(() => {
    flushPendingDeepLinkNavigation(navigationRef, activeRouteName);
  }, [activeRouteName, navigationRef]);

  return null;
};

export default DeepLinkRoot;
