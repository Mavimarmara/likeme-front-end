import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GradientBackground, ScreenWithHeader } from '@/components/ui/layout';
import {
  useCommunities,
  useSuggestedProducts,
  SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
  useMenuItems,
  useSessionTokenReady,
} from '@/hooks';
import { useFloatingMenuActions } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { logger } from '@/utils/logger';
import { communityService, storageService, advertiserService } from '@/services';
import { PopularProvidersSection, type Provider } from '@/components/sections/community';
import { type JoinCardItem } from '@/components/ui/cards';
import { JoinCardList } from '@/components/ui/lists/JoinCardList';
import { ProductsCarousel, type Product } from '@/components/sections/product';
import ProfileFloatingMenu from '@/components/sections/profile/ProfileFloatingMenu';
// TODO: Temporariamente desabilitados
// import { AnamnesisPromptCard } from '@/components/sections/anamnesis';
// import { AvatarSection } from '@/components/sections/avatar';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import { useAnalyticsScreen } from '@/analytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCommunityStackNavigator } from '@/navigation/rootStackScreenLoaders';
import { navigateToCommunity } from '@/utils/navigation/communityNavigation';
import { navigateToProviderProfile } from '@/utils/navigation/marketplaceNavigation';
import { navigateToProductDetailsScreen } from '@/utils/navigation/productNavigation';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const SummaryScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Summary', screenClass: 'SummaryScreen' });
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const rootNavigation = navigation.getParent() ?? navigation;
  const hasSessionToken = useSessionTokenReady();
  const [userAvatarUri, setUserAvatarUri] = useState<string | null>(null);
  const [isProfileMenuVisible, setIsProfileMenuVisible] = useState(false);
  // TODO: Temporariamente desabilitados
  // const [hasCompletedAnamnesis, setHasCompletedAnamnesis] = useState<boolean>(false);
  // const [hasAnyAnamnesisAnswers, setHasAnyAnamnesisAnswers] = useState<boolean>(false);
  // const { progress: _anamnesisProgress } = useAnamnesisProgress();
  // const { scores: anamnesisScores, refresh: refreshAnamnesisScores } = useAnamnesisScores();

  // useFocusEffect(
  //   useCallback(() => {
  //     refreshAnamnesisScores();
  //   }, [refreshAnamnesisScores]),
  // );

  useEffect(() => {
    const loadUser = async () => {
      const user = await storageService.getUser();
      setUserAvatarUri(user?.picture ?? null);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!hasSessionToken) {
      return;
    }
    getCommunityStackNavigator();
  }, [hasSessionToken]);

  const handleCartPress = () => {
    rootNavigation.navigate('Cart' as never);
  };

  const handleMenuPress = () => {
    setIsProfileMenuVisible(true);
  };

  // TODO: Temporariamente desabilitados
  // const handleStartAnamnesis = () => {
  //   rootNavigation.navigate('Anamnesis' as never);
  // };
  // const handleAvatarSeeMore = () => {
  //   rootNavigation.navigate('AvatarProgress' as never);
  // };
  // const handleShareAvatar = async () => {
  //   try {
  //     const mindPct = anamnesisScores?.mentalPercentage || 0;
  //     const bodyPct = anamnesisScores?.physicalPercentage || 0;
  //     const message = t('avatar.shareMessage', {
  //       mindPercentage: mindPct,
  //       bodyPercentage: bodyPct,
  //     });
  //     await Share.share({ message });
  //   } catch (error) {
  //     console.log('Share cancelled or failed:', error);
  //   }
  // };

  // TODO: Temporariamente desabilitado
  // useEffect(() => {
  //   const checkAnamnesisStatus = async () => { ... };
  //   checkAnamnesisStatus();
  // }, []);

  const { filteredJoinCommunities, loading: _communitiesLoading } = useCommunities({
    enabled: hasSessionToken,
    pageSize: 20,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
  });

  const [popularProviders, setPopularProviders] = useState<Provider[]>([]);

  useEffect(() => {
    if (!hasSessionToken) {
      setPopularProviders([]);
      return;
    }

    // PopularProvidersSection e um carrossel horizontal — 10 e suficiente
    // pra preencher mais que a primeira tela na maioria dos devices, sem
    // pagar latencia/dados para itens que nunca serao vistos.
    const loadProviders = async () => {
      try {
        const response = await advertiserService.getAdvertisers({
          page: 1,
          limit: 10,
          status: 'active',
        });
        if (!response.success || !response.data?.advertisers) {
          setPopularProviders([]);
          return;
        }
        const providers: Provider[] = response.data.advertisers.map((a) => ({
          id: a.id,
          name: a.name,
          avatar: a.logo,
        }));
        setPopularProviders(providers);
      } catch (error) {
        logger.error('[SummaryScreen] Erro ao carregar provedores', error);
        setPopularProviders([]);
      }
    };
    loadProviders();
  }, [hasSessionToken]);

  const { products: recommendedProducts } = useSuggestedProducts({
    ...SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
    enabled: hasSessionToken,
  });

  const { products: suggestedPrograms } = useSuggestedProducts({
    ...SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
    enabled: hasSessionToken,
    type: PRODUCT_CATALOG_TYPE.PROGRAM,
  });

  const recommendedProgramCards = useMemo(
    (): JoinCardItem[] =>
      suggestedPrograms.map((p) => ({
        id: p.id,
        title: p.title,
        badges: p.tags ?? [],
        image: p.image,
      })),
    [suggestedPrograms],
  );

  const menuItems = useMenuItems(navigation);
  const { setMenu } = useFloatingMenuActions();

  useFocusEffect(
    useCallback(() => {
      setMenu(menuItems, 'home');
    }, [menuItems, setMenu]),
  );

  const handleProductPress = (product: Product) => {
    navigateToProductDetailsScreen(rootNavigation, { productId: product.id });
  };

  const handleProviderPress = (provider: Provider) => {
    navigateToProviderProfile(rootNavigation, {
      providerId: provider.id,
      provider: { name: provider.name, avatar: provider.avatar },
    });
  };

  const handleJoinCommunity = useCallback(
    (community: JoinCardItem) => {
      navigateToCommunity(rootNavigation, { openFeedFromMenu: true });
      void communityService.joinCommunity(community.id).catch((error) => {
        logger.error('[SummaryScreen] Falha ao entrar na comunidade em background', {
          communityId: community.id,
          cause: error,
        });
      });
    },
    [rootNavigation],
  );

  const handleProgramPress = useCallback(
    (program: JoinCardItem) => {
      navigateToProductDetailsScreen(rootNavigation, { productId: program.id });
    },
    [rootNavigation],
  );

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{
        showBackButton: false,
        showMenuWithAvatar: true,
        onMenuPress: handleMenuPress,
        userAvatarUri,
        showCartButton: true,
        onCartPress: handleCartPress,
      }}
      contentContainerStyle={styles.content}
    >
      <View pointerEvents='none' style={styles.gradientBackground}>
        <GradientBackground />
      </View>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {filteredJoinCommunities.length > 0 && (
            <View style={styles.sectionDivider}>
              <Text style={styles.sectionTitle}>{t('home.recommendedCommunitySectionTitle')}</Text>
              <View style={styles.sectionContainer}>
                <JoinCardList items={filteredJoinCommunities} onItemPress={handleJoinCommunity} />
              </View>
            </View>
          )}

          {recommendedProgramCards.length > 0 && (
            <View style={styles.sectionDivider}>
              <Text style={styles.sectionTitle}>{t('home.recommendedProgramSectionTitle')}</Text>
              <View style={styles.sectionContainer}>
                <JoinCardList items={recommendedProgramCards} onItemPress={handleProgramPress} />
              </View>
            </View>
          )}
          {/* TODO: Avatar e Anamnese temporariamente desabilitados
          {(hasAnyAnamnesisAnswers || hasCompletedAnamnesis) && (
            <View style={styles.avatarContainer}>
              <AvatarSection
                hasAnswers={hasAnyAnamnesisAnswers || hasCompletedAnamnesis}
                mindPercentage={anamnesisScores?.mentalPercentage || 0}
                bodyPercentage={anamnesisScores?.physicalPercentage || 0}
                onSharePress={handleShareAvatar}
                onSeeMorePress={handleAvatarSeeMore}
              />
            </View>
          )}
          {!hasCompletedAnamnesis && (
            <View style={styles.anamnesisPromptContainer}>
              <AnamnesisPromptCard onStartPress={handleStartAnamnesis} />
            </View>
          )}
          {!hasAnyAnamnesisAnswers && !hasCompletedAnamnesis && (
            <View style={styles.avatarContainer}>
              <AvatarSection
                hasAnswers={false}
                mindPercentage={0}
                bodyPercentage={0}
                onSeeMorePress={handleAvatarSeeMore}
              />
            </View>
          )}
          */}
          {popularProviders.length > 0 && (
            <View style={[styles.sectionDivider]}>
              <PopularProvidersSection providers={popularProviders} onProviderPress={handleProviderPress} />
            </View>
          )}
          {recommendedProducts.length > 0 && (
            <View style={[styles.productsContainer, styles.sectionDivider]}>
              <Text style={styles.sectionTitle}>{t('home.recommendedProductsTitle')}</Text>
              <View style={[styles.sectionContainer, styles.sectionRetreatedContainer]}>
                <ProductsCarousel
                  title={t('home.productsRecommended', { provider: '' })}
                  subtitle={t('home.discoverProducts')}
                  products={recommendedProducts}
                  onProductPress={handleProductPress}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <ProfileFloatingMenu
        visible={isProfileMenuVisible}
        navigation={rootNavigation}
        onClose={() => setIsProfileMenuVisible(false)}
      />
    </ScreenWithHeader>
  );
};

export default SummaryScreen;
