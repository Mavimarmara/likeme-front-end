import { useMemo } from 'react';

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  fullLabel: string;
  onPress: () => void;
};

export const useMenuItems = (navigation: any): MenuItem[] => {
  const rootNavigation = navigation.getParent() ?? navigation;

  return useMemo(
    () => [
      {
        id: 'activities',
        icon: 'fitness-center',
        label: 'Atividades',
        fullLabel: 'Atividades',
        onPress: () => rootNavigation.navigate('Activities' as never),
      },
      {
        id: 'community',
        icon: 'group',
        label: 'Comunidade',
        fullLabel: 'Comunidade',
        onPress: () =>
          rootNavigation.navigate('Community' as never, {
            screen: 'CommunityList',
          }),
      },
      {
        id: 'chat',
        icon: 'chat',
        label: 'Chat',
        fullLabel: 'Chat',
        onPress: () => rootNavigation.navigate('Chat' as never),
      },
      {
        id: 'marketplace',
        icon: 'store',
        label: 'Marketplace',
        fullLabel: 'Marketplace',
        onPress: () => rootNavigation.navigate('Marketplace' as never),
      },
    ],
    [rootNavigation],
  );
};
