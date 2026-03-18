import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Alert, View, ScrollView, Text } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
import { GradientBackground, ScreenWithHeader } from '@/components/ui/layout';
import { SearchBar } from '@/components/ui/inputs';
import { FilterMenu } from '@/components/ui/menu';
import { FilterCategoryModal, type FilterCategoryResult, type SolutionId } from '@/components/ui/modals';
import {
  useCommunities,
  useCategories,
  useSuggestedProducts,
  useMenuItems,
  useNotifications,
  useCategoryDisplayLabel,
} from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
// import {
//   mapCommunityToOtherCommunity,
//   mapCommunityPostToPost,
//   mapChannelsToEvents,
//   sortByDateObject,
// } from '@/utils';
import { communityService, storageService, advertiserService } from '@/services';
import {
  // NextEventsSection,
  // OtherCommunitiesSection,
  PopularProvidersSection,
  // YourCommunitiesSection,
  JoinCommunityCard,
  // type OtherCommunity,
  type Provider,
  // type YourCommunity,
  type JoinCommunity,
} from '@/components/sections/community';
import { ProductsCarousel, type Product } from '@/components/sections/product';
import { EmptyState } from '@/components/ui/feedback';
// TODO: Temporariamente desabilitados
// import { AnamnesisPromptCard } from '@/components/sections/anamnesis';
// import { AvatarSection } from '@/components/sections/avatar';
// import type { Event } from '@/types/event';
// import type { Post } from '@/types';
import type { SolutionTab } from '@/types/solution';
import { solutionOptions } from '@/types/solution';
import { useAnalyticsScreen } from '@/analytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

const DEFAULT_CARD_IMAGE = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800';

const RECOMMENDED_PROGRAM: JoinCommunity = {
  id: 'recommended-program',
  title: 'Vivência Curativa em Grupo',
  badge: 'Relacionamentos',
  image: DEFAULT_CARD_IMAGE,
};

type Props = {
  navigation: any;
  route: any;
};

const SummaryScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Summary', screenClass: 'SummaryScreen' });
  useNotifications();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const rootNavigation = navigation.getParent() ?? navigation;
  const [userAvatarUri, setUserAvatarUri] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSolutionTab, setSelectedSolutionTab] = useState<SolutionTab>('all');
  const { getCategoryName } = useCategoryDisplayLabel();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedCategoryName, setSelectedCategoryName] = useState<import('@/types').CategoryName | null>(null);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<SolutionId[]>([]);
  const [isFilterCategoryModalVisible, setIsFilterCategoryModalVisible] = useState(false);
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

  const handleCartPress = () => {
    rootNavigation.navigate('Cart' as never);
  };

  const handleMenuPress = () => {
    rootNavigation.navigate('Profile' as never);
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
    enabled: true,
    pageSize: 20,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
    searchQuery,
    solutionTab: selectedSolutionTab,
    selectedCategoryName,
    getCategoryName,
  });

  const { allCategoryOptions } = useCategories({ enabled: true });

  // const firstCommunity = rawCommunities.length > 0 ? rawCommunities[0] : null;

  // TODO: Temporariamente desabilitado (YourCommunitiesSection)
  // const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  // const [_loadingCommunityPosts, setLoadingCommunityPosts] = useState(false);
  const [popularProviders, setPopularProviders] = useState<Provider[]>([]);
  const [_loadingProviders, setLoadingProviders] = useState(false);
  // const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoadingProviders(true);
        const response = await advertiserService.getAdvertisers({
          page: 1,
          limit: 20,
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
        console.error('Error loading providers:', error);
        setPopularProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    };
    loadProviders();
  }, []);

  const { products: recommendedProducts } = useSuggestedProducts({
    limit: 4,
    status: 'active',
    enabled: true,
    categoryId: selectedCategoryId ?? null,
  });

  // TODO: Temporariamente desabilitado
  // const yourCommunity = useMemo((): YourCommunity | null => { ... }, [firstCommunity, communityPosts]);

  const filteredProviders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = selectedSolutionTab === 'all' || selectedSolutionTab === 'professionals' ? popularProviders : [];
    if (!q) return base;
    return base.filter((p) => p.name.toLowerCase().includes(q));
  }, [popularProviders, searchQuery, selectedSolutionTab]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const base = selectedSolutionTab === 'all' || selectedSolutionTab === 'products' ? recommendedProducts : [];
    if (!q) return base;
    return base.filter((p) => p.title?.toLowerCase?.().includes?.(q));
  }, [recommendedProducts, searchQuery, selectedSolutionTab]);

  const hasActiveSearchOrFilter =
    searchQuery.trim() !== '' || selectedCategoryName != null || selectedSolutionIds.length > 0;

  const hasNoResultsForCurrentTab = useMemo(() => {
    if (!hasActiveSearchOrFilter) return false;
    switch (selectedSolutionTab) {
      case 'communities':
        return filteredJoinCommunities.length === 0;
      case 'products':
        return filteredProducts.length === 0;
      case 'professionals':
        return filteredProviders.length === 0;
      case 'programs':
        return filteredJoinCommunities.length === 0;
      case 'all':
      default:
        return filteredJoinCommunities.length === 0 && filteredProviders.length === 0 && filteredProducts.length === 0;
    }
  }, [
    hasActiveSearchOrFilter,
    selectedSolutionTab,
    filteredJoinCommunities.length,
    filteredProviders.length,
    filteredProducts.length,
  ]);

  const showEmptyState = hasActiveSearchOrFilter && hasNoResultsForCurrentTab;

  const handleFilterCategoryApply = useCallback(
    (result: FilterCategoryResult) => {
      setSelectedCategoryId(result.categoryId ?? undefined);
      setSelectedCategoryName(result.categoryName ?? null);
      setSelectedSolutionIds(result.solutionIds);

      if (result.solutionIds.length === 1) {
        const only = result.solutionIds[0];
        if (only === 'products') setSelectedSolutionTab('products');
        else if (only === 'services') setSelectedSolutionTab('professionals');
        else if (only === 'professionals') setSelectedSolutionTab('professionals');
        else if (only === 'programs') setSelectedSolutionTab('programs');
        else if (only === 'communities') setSelectedSolutionTab('communities');
        else setSelectedSolutionTab('all');
      } else {
        setSelectedSolutionTab('all');
      }
    },
    [setSelectedCategoryId, setSelectedCategoryName],
  );

  const handleClearFilterCategory = useCallback(() => {
    setSelectedCategoryId(undefined);
    setSelectedCategoryName(null);
    setSelectedSolutionIds([]);
    setSelectedSolutionTab('all');
  }, []);

  const categoryFilterButtonLabel = selectedCategoryName != null ? getCategoryName(selectedCategoryName) : 'Autoestima';

  // TODO: Temporariamente desabilitado
  // const otherCommunities = useMemo(() => {
  //   return rawCommunities.map((community) => {
  //     const category = categories.length > 0 ? categories[0] : undefined;
  //     return mapCommunityToOtherCommunity(community, category);
  //   });
  // }, [rawCommunities, categories]);

  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'home');

  // TODO: Temporariamente desabilitados
  // const handleEventPress = (event: Event) => {};
  // const handleEventSave = (event: Event) => {};
  // const handleOtherCommunityPress = (community: OtherCommunity) => {};
  // const handleSearchChange = (text: string) => {};
  // const handleSearchPress = () => {};
  // const handleFilterPress = () => {};

  const handleProductPress = (product: Product) => {
    rootNavigation.navigate('ProductDetails', {
      productId: product.id,
    } as never);
  };

  const handleProductLike = (product: Product) => {
    console.log('Curtir produto:', product.id);
  };

  const handleProviderPress = (provider: Provider) => {
    rootNavigation.navigate('ProviderProfile', {
      providerId: provider.id,
      provider: { name: provider.name, avatar: provider.avatar },
    } as never);
  };

  const handleJoinCommunity = useCallback(
    async (community: JoinCommunity) => {
      try {
        await communityService.joinCommunity(community.id);
        rootNavigation.navigate('Community' as never);
      } catch (error) {
        Alert.alert(t('common.error'), t('home.joinCommunityError'));
      }
    },
    [rootNavigation, t],
  );

  const handleProgramPress = useCallback(
    (_program: JoinCommunity) => {
      rootNavigation.navigate('Community' as never);
    },
    [rootNavigation],
  );

  // TODO: Temporariamente desabilitados
  // const handleYourCommunityPress = (community: YourCommunity) => {};
  // const handleYourCommunityPostPress = (post: Post) => {};

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 0) + 180 }]}
          scrollIndicatorInsets={{ bottom: Math.max(insets.bottom, 0) + 180 }}
        >
          <View style={styles.searchAndFilters}>
            <SearchBar
              placeholder='Buscar'
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearchPress={() => undefined}
              showFilterButton={false}
            />
            <FilterMenu<SolutionTab>
              filterButtonLabel={categoryFilterButtonLabel}
              filterButtonSelected={selectedCategoryName != null || selectedSolutionIds.length > 0}
              onFilterButtonPress={() => setIsFilterCategoryModalVisible(true)}
              carouselOptions={[...solutionOptions]}
              selectedCarouselId={selectedSolutionTab}
              onCarouselSelect={setSelectedSolutionTab}
            />
          </View>
          <FilterCategoryModal
            visible={isFilterCategoryModalVisible}
            onClose={() => setIsFilterCategoryModalVisible(false)}
            categories={allCategoryOptions}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={() => {
              // aplica apenas ao confirmar "Filtrar"
            }}
            selectedSolutionIds={selectedSolutionIds}
            onToggleSolution={(id) => {
              setSelectedSolutionIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
            }}
            onFilter={handleFilterCategoryApply}
            onClear={handleClearFilterCategory}
          />

          {showEmptyState ? (
            <View style={[styles.sectionDivider, styles.sectionContainer, styles.emptyStateContainer]}>
              <EmptyState
                title={t('home.noResultsTitle')}
                description={t('home.noResultsDescription')}
                actionLabel={t('home.clearFilters')}
                onActionPress={() => {
                  setSearchQuery('');
                  handleClearFilterCategory();
                }}
              />
            </View>
          ) : (
            <>
              {filteredJoinCommunities.length > 0 && (
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Comunidade recomendada</Text>
                  <View style={styles.sectionContainer}>
                    <JoinCommunityCard communities={filteredJoinCommunities} onCommunityPress={handleJoinCommunity} />
                  </View>
                </View>
              )}

              {(selectedSolutionTab === 'all' || selectedSolutionTab === 'programs') && (
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Programa recomendado</Text>
                  <View style={styles.sectionContainer}>
                    <JoinCommunityCard communities={[RECOMMENDED_PROGRAM]} onCommunityPress={handleProgramPress} />
                  </View>
                </View>
              )}
              {/* TODO: Temporariamente desabilitado
          {yourCommunity && (
            <View style={styles.yourCommunitiesContainer}>
              <YourCommunitiesSection
                community={yourCommunity}
                onCommunityPress={handleYourCommunityPress}
                onPostPress={handleYourCommunityPostPress}
              />
            </View>
          )}
          */}
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
              {/* TODO: Temporariamente desabilitados
          {events.length > 0 && (
            <View style={styles.eventsContainer}>
              <NextEventsSection events={events} onEventPress={handleEventPress} onEventSave={handleEventSave} />
            </View>
          )}
          */}
              {filteredProviders.length > 0 && (
                <View style={[styles.sectionDivider]}>
                  <PopularProvidersSection providers={filteredProviders} onProviderPress={handleProviderPress} />
                </View>
              )}
              {filteredProducts.length > 0 && (
                <View style={[styles.productsContainer, styles.sectionDivider]}>
                  <Text style={styles.sectionTitle}>{t('home.recommendedProductsTitle')}</Text>
                  <View style={[styles.sectionContainer, styles.sectionRetreatedContainer]}>
                    <ProductsCarousel
                      title={t('home.productsRecommended', { provider: '' })}
                      subtitle={t('home.discoverProducts')}
                      products={filteredProducts}
                      onProductPress={handleProductPress}
                      onProductLike={handleProductLike}
                    />
                  </View>
                </View>
              )}
              {/* TODO: Temporariamente desabilitado
          <View style={styles.otherCommunitiesContainer}>
            <OtherCommunitiesSection
              communities={otherCommunities}
              onCommunityPress={handleOtherCommunityPress}
              onSearchChange={handleSearchChange}
              onSearchPress={handleSearchPress}
              onFilterPress={handleFilterPress}
            />
          </View>
          */}
            </>
          )}
        </ScrollView>
      </View>
    </ScreenWithHeader>
  );
};

export default SummaryScreen;
