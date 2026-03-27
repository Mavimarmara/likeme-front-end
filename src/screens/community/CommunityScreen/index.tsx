import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, ScrollView, Text, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { SocialList, ShoppingList, LiveBannerData } from '@/components/sections/community';
import type { SpecialistCardProps } from '@/components/sections/community/SpecialistCard';
import { Product } from '@/components/sections/product';
import { GradientBackground, HeroImage, ScreenWithHeader } from '@/components/ui/layout';
import type { Event } from '@/types';
import { SPACING, COMMUNITY_FEED_POSTS_PAGE_SIZE } from '@/constants';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import {
  useUserFeed,
  useCommunities,
  useSuggestedProducts,
  SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
  useAdvertisers,
  useMenuItems,
} from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { storageService } from '@/services';
import { logger } from '@/utils/logger';
import type { Advertiser } from '@/types/ad';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import Toggle from '@/components/ui/buttons/Toggle';

type CommunityMode = 'Feed' | 'Solutions';

const getToggleOptions = (t: (key: string) => string): readonly [CommunityMode, CommunityMode] =>
  [t('community.social') as CommunityMode, t('community.solutions') as CommunityMode] as const;

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'CommunityList'>;
type Props = { navigation: NavigationProp };

/** Mesma imagem padrão do CommunityIntroSection para manter consistência. */
const DEFAULT_COMMUNITY_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400';

/** Distância do fim do conteúdo para disparar próxima página do feed (evita depender só de onMomentumScrollEnd). */
const FEED_END_THRESHOLD_PX = 120;

const CommunityScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'CommunityList', screenClass: 'CommunityScreen' });
  const { t } = useTranslation();
  const toggleOptions = useMemo(() => getToggleOptions(t), [t]);
  const rootNavigation = navigation.getParent()?.getParent?.() ?? navigation.getParent();
  const [selectedMode, setSelectedMode] = useState<CommunityMode>('Feed');
  const [welcomeDismissed, setWelcomeDismissed] = useState(true);
  const [isCommunityFavorite, setIsCommunityFavorite] = useState(false);

  useEffect(() => {
    storageService.getCommunityWelcomeDismissed().then(setWelcomeDismissed);
  }, []);

  const handleWelcomeClose = useCallback(() => {
    setWelcomeDismissed(true);
    storageService.setCommunityWelcomeDismissed(true);
  }, []);

  const {
    communities: rawCommunities,
    categories,
    loading: _communitiesLoading,
    loadingMore: _communitiesLoadingMore,
    error: _communitiesError,
    hasMore: _communitiesHasMore,
    loadMore: _loadMoreCommunities,
    refresh: _refreshCommunities,
    liveBanner,
    events,
  } = useCommunities({
    enabled: true,
    pageSize: 10,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
    loadLiveChannels: true,
  });

  const selectedCommunityId = rawCommunities[0]?.communityId;

  useEffect(() => {
    if (!selectedCommunityId) {
      setIsCommunityFavorite(false);
      return;
    }
    let cancelled = false;
    storageService.isCommunityFavorite(selectedCommunityId).then((fav) => {
      if (!cancelled) setIsCommunityFavorite(fav);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedCommunityId]);

  const { advertisers: advertisersList } = useAdvertisers({ communityId: selectedCommunityId });
  const advertiser = advertisersList[0] ?? null;

  const feedFilterParams = useMemo(() => ({}), []);

  const { posts, loading, loadingMore, error, loadMore } = useUserFeed({
    enabled: selectedMode === 'Feed',
    searchQuery: '',
    pageSize: COMMUNITY_FEED_POSTS_PAGE_SIZE,
    params: feedFilterParams,
  });

  const handleProductPress = (product: Product) => {
    rootNavigation?.navigate('ProductDetails', { productId: product.id } as never);
  };

  const handleProductLike = (product: Product) => {
    console.log('Curtir produto:', product.id);
  };

  const handleProfessionalPress = (advertiser: Advertiser) => {
    rootNavigation?.navigate('ProviderProfile', { providerId: advertiser.id } as never);
  };

  const { products: suggestedProducts } = useSuggestedProducts({
    ...SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
    enabled: true,
  });
  const { products: suggestedServices } = useSuggestedProducts({
    limit: 20,
    status: 'active',
    enabled: selectedMode === 'Solutions',
    type: 'service',
  });
  const { products: suggestedPrograms } = useSuggestedProducts({
    limit: 20,
    status: 'active',
    enabled: selectedMode === 'Solutions',
    type: PRODUCT_CATALOG_TYPE.PROGRAM,
  });

  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'community');

  const handleModeSelect = (mode: CommunityMode) => {
    setSelectedMode(mode);
  };

  const handleLivePress = (live: LiveBannerData) => {
    console.log('Navegar para live:', live.id);
  };

  const handleEventPress = (event: Event) => {
    console.log('Navegar para evento:', event.id);
  };

  const handleEventSave = (event: Event) => {
    console.log('Salvar evento:', event.id);
  };

  const handleLoadMore = useCallback(() => {
    if (selectedMode === 'Feed') {
      loadMore();
    }
  }, [selectedMode, loadMore]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (selectedMode !== 'Feed') return;
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
      if (distanceFromBottom <= FEED_END_THRESHOLD_PX) {
        handleLoadMore();
      }
    },
    [selectedMode, handleLoadMore],
  );

  const communityIntro = useMemo(() => {
    const first = rawCommunities[0];
    if (first) {
      return {
        title: first.displayName,
        description: first.description,
        imageUri: first.avatarFileId as string | undefined,
      };
    }
  }, [rawCommunities, t]);

  const communityIntroBadges = useMemo(() => {
    const firstTwo = categories?.slice(0, 2) ?? [];
    return firstTwo.map((c) => c.name).filter(Boolean);
  }, [categories]);

  const specialistData: SpecialistCardProps | null = useMemo(() => {
    if (!advertiser) return null;
    const advertiserName = advertiser.name?.trim();
    if (!advertiserName) return null;
    return {
      name: advertiserName,
      subtitle: t('community.specialistLabel'),
      rating: 5,
      tags: [],
      avatarUri: advertiser.logo ?? undefined,
    };
  }, [advertiser]);

  const handleCommunityFavoritePress = useCallback(() => {
    if (!selectedCommunityId) return;
    const next = !isCommunityFavorite;
    setIsCommunityFavorite(next);
    storageService.setCommunityFavorite(selectedCommunityId, next).catch((error) => {
      logger.error('Falha ao persistir favorito da comunidade', {
        communityId: selectedCommunityId,
        favorite: next,
        cause: error,
      });
      setIsCommunityFavorite(!next);
    });
  }, [selectedCommunityId, isCommunityFavorite]);

  return (
    <ScreenWithHeader
      navigation={rootNavigation}
      headerProps={{
        showBackButton: true,
        showMenuWithAvatar: false,
        onBackPress: () => navigation?.goBack?.(),
        showRating: true,
        favoriteActive: isCommunityFavorite,
        onRatingPress: handleCommunityFavoritePress,
      }}
      contentContainerStyle={styles.container}
    >
      <View pointerEvents='none' style={styles.gradientBackground}>
        <GradientBackground />
      </View>
      <ScrollView
        style={[{ flex: 1 }, { zIndex: 1 }]}
        contentContainerStyle={{ paddingBottom: SPACING.XL }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={100}
      >
        {communityIntro?.title != null && (
          <HeroImage
            imageUri={communityIntro.imageUri ?? DEFAULT_COMMUNITY_IMAGE}
            name={communityIntro.title}
            badges={communityIntroBadges}
            footer={
              communityIntro.description ? (
                <View style={styles.heroFooter}>
                  <Text style={styles.heroDescription}>{communityIntro.description}</Text>
                </View>
              ) : undefined
            }
          />
        )}
        <View style={styles.toggleRow}>
          <View style={styles.toggleContainer}>
            <Toggle<CommunityMode> options={toggleOptions} selected={selectedMode} onSelect={handleModeSelect} />
          </View>
        </View>
        {selectedMode === 'Feed' ? (
          <SocialList
            liveBanner={liveBanner}
            onLivePress={handleLivePress}
            specialist={specialistData}
            posts={posts}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            onLoadMore={handleLoadMore}
            events={events}
            onEventPress={handleEventPress}
            onEventSave={handleEventSave}
            products={suggestedProducts}
            onProductPress={handleProductPress}
            onProductLike={handleProductLike}
            welcomeDismissed={welcomeDismissed}
            onWelcomeClose={handleWelcomeClose}
            embedInParentScroll
          />
        ) : (
          <ShoppingList
            products={suggestedProducts}
            services={suggestedServices}
            programs={suggestedPrograms}
            professionals={advertisersList}
            onProductPress={handleProductPress}
            onProductLike={handleProductLike}
            onProfessionalPress={handleProfessionalPress}
            specialist={specialistData}
            embedInParentScroll
          />
        )}
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default CommunityScreen;
