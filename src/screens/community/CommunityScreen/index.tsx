import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, ScrollView, type LayoutChangeEvent } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Toggle, Header } from '@/components/ui';
import { IconButton } from '@/components/ui/buttons';
import { SocialList, ShoppingList, LiveBannerData } from '@/components/sections/community';
import type { SpecialistCardProps } from '@/components/sections/community/SpecialistCard';
import { Product } from '@/components/sections/product';
import { Background, HeroImage } from '@/components/ui/layout';
import type { Event } from '@/types';
import { SPACING } from '@/constants';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import { useUserFeed, useCommunities, useSuggestedProducts, useAdvertiser, useMenuItems, useUserAvatar } from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { storageService } from '@/services';
import type { Advertiser } from '@/types/ad';

type CommunityMode = 'Feed' | 'Solutions';

const getToggleOptions = (t: (key: string) => string): readonly [CommunityMode, CommunityMode] =>
  [t('community.social') as CommunityMode, t('community.solutions') as CommunityMode] as const;

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'CommunityList'>;
type Props = { navigation: NavigationProp };

/** Mesma imagem padrão do CommunityIntroSection para manter consistência. */
const DEFAULT_COMMUNITY_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400';

const CommunityScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'CommunityList', screenClass: 'CommunityScreen' });
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const toggleOptions = useMemo(() => getToggleOptions(t), [t]);
  const rootNavigation = navigation.getParent()?.getParent?.() ?? navigation.getParent();
  const userAvatarUri = useUserAvatar();
  const [selectedMode, setSelectedMode] = useState<CommunityMode>('Feed');
  const [welcomeDismissed, setWelcomeDismissed] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  }, []);

  const heroOffsetTop = insets.top + headerHeight;

  useEffect(() => {
    storageService.getCommunityWelcomeDismissed().then(setWelcomeDismissed);
  }, []);

  const handleWelcomeClose = useCallback(() => {
    setWelcomeDismissed(true);
    storageService.setCommunityWelcomeDismissed(true);
  }, []);

  const { advertiser: featuredAdvertiser, advertisers: advertisersList } = useAdvertiser({
    listOptions: { page: 1, limit: 50, status: 'active' },
  });

  const handleCartPress = () => {
    rootNavigation?.navigate('Cart' as never);
  };

  const handleMenuPress = () => {
    rootNavigation?.navigate('Profile' as never);
  };

  const {
    communities: rawCommunities,
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

  const feedFilterParams = useMemo(() => ({}), []);

  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMore: _hasMore,
    loadMore,
  } = useUserFeed({
    enabled: selectedMode === 'Feed',
    searchQuery: '',
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
    limit: 20,
    status: 'active',
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
    type: 'program',
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

  const specialistData: SpecialistCardProps | null = useMemo(() => {
    if (!featuredAdvertiser) return null;
    return {
      name: featuredAdvertiser.name ?? '',
      subtitle: t('community.specialistLabel'),
      rating: undefined,
      tags: [],
      avatarUri: featuredAdvertiser.logo ?? undefined,
    };
  }, [featuredAdvertiser, t]);

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <View
        style={[styles.headerWrapper, { top: 0, paddingTop: insets.top, zIndex: 10 }]}
        onLayout={handleHeaderLayout}
        pointerEvents='box-none'
      >
        <Header
          showBackButton={false}
          showMenuWithAvatar={true}
          onMenuPress={handleMenuPress}
          userAvatarUri={userAvatarUri}
          showCartButton={true}
          onCartPress={handleCartPress}
        />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: SPACING.XXL, paddingBottom: SPACING.XL }}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
          if (selectedMode === 'Feed' && layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {communityIntro?.title != null && (
          <HeroImage
            imageUri={communityIntro.imageUri ?? DEFAULT_COMMUNITY_IMAGE}
            name={communityIntro.title}
            heightRatio={0.35}
            offsetTop={heroOffsetTop}
          />
        )}
        <View style={styles.toggleRow}>
          <IconButton
            icon='chevron-left'
            onPress={() => navigation.goBack()}
            backgroundSize='medium'
            containerStyle={styles.toggleBackButton}
          />
          <View style={styles.toggleContainer}>
            <Toggle<CommunityMode> options={toggleOptions} selected={selectedMode} onSelect={handleModeSelect} />
          </View>
        </View>
        {selectedMode === 'Feed' ? (
          <SocialList
            liveBanner={liveBanner}
            onLivePress={handleLivePress}
            communityIntro={communityIntro}
            onIntroSeeMore={() => {
              /* expand or navigate to community detail */
            }}
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
            communityIntro={communityIntro}
            onIntroSeeMore={() => {
              /* expand or navigate to community detail */
            }}
            specialist={specialistData}
            embedInParentScroll
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommunityScreen;
