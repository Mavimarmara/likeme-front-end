import { useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { HOME_MVP_ASSETS } from '@/assets/homeMvp';
import { useTranslation } from '@/hooks/i18n';
import { FEATURE_FLAGS } from '@/constants';
import { useFeatureFlag } from '@/hooks/featureFlags/useFeatureFlag';

type MenuItem = {
  id: string;
  icon?: string;
  iconImage?: ImageSourcePropType;
  label: string;
  fullLabel: string;
  onPress: () => void;
};

export const useMenuItems = (navigation: any): MenuItem[] => {
  const rootNavigation = navigation.getParent() ?? navigation;
  const { t } = useTranslation();
  const shopLabel = t('community.solutions');
  const { isEnabled: isChatEnabled } = useFeatureFlag(FEATURE_FLAGS.CHAT_ENABLED);

  return useMemo(() => {
    const items: MenuItem[] = [
      {
        id: 'activities',
        icon: 'fitness-center',
        iconImage: HOME_MVP_ASSETS.navActivities,
        label: 'Atividades',
        fullLabel: 'Atividades',
        onPress: () => rootNavigation.navigate('Activities' as never),
      },
      {
        id: 'community',
        icon: 'group',
        iconImage: HOME_MVP_ASSETS.navCommunity,
        label: 'Comunidade',
        fullLabel: 'Comunidade',
        onPress: () =>
          rootNavigation.navigate('Community' as never, {
            screen: 'CommunityList',
          }),
      },
      {
        id: 'marketplace',
        icon: 'store',
        iconImage: HOME_MVP_ASSETS.navMarketplace,
        label: shopLabel,
        fullLabel: shopLabel,
        onPress: () => rootNavigation.navigate('Marketplace' as never),
      },
    ];

    if (isChatEnabled) {
      items.splice(2, 0, {
        id: 'chat',
        icon: 'chat',
        iconImage: HOME_MVP_ASSETS.navChat,
        label: 'Chat',
        fullLabel: 'Chat',
        onPress: () => rootNavigation.navigate('Chat' as never),
      });
    }

    return items;
  }, [isChatEnabled, rootNavigation, shopLabel]);
};
