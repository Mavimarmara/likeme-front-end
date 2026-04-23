import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Alert, View, ScrollView, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { GradientBackground, ScreenWithHeader } from '@/components/ui/layout';
import { SearchBar } from '@/components/ui/inputs';
import { StickyFilterCarouselRow } from '@/components/ui/menu';
import { FilterCategoryModal, type FilterCategoryResult, type SolutionId } from '@/components/ui/modals';
import {
  useCommunities,
  useCategories,
  useSuggestedProducts,
  SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
  useMenuItems,
  useNotifications,
  useCategoryDisplayLabel,
  useSolutions,
} from '@/hooks';
import { useFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
// import {
//   mapChannelsToEvents,
//   sortByDateObject,
// } from '@/utils';
import { communityService, storageService, advertiserService } from '@/services';
import {
  // NextEventsSection,
  PopularProvidersSection,
  type Provider,
} from '@/components/sections/community';
import { JoinCard, type JoinCardItem } from '@/components/ui/cards';
import { ProductsCarousel, type Product } from '@/components/sections/product';
import { EmptyState } from '@/components/ui/feedback';
// TODO: Temporariamente desabilitados
// import { AnamnesisPromptCard } from '@/components/sections/anamnesis';
// import { AvatarSection } from '@/components/sections/avatar';
// import type { Event } from '@/types/event';
// import type { Post } from '@/types';
import type { SolutionTab, SolutionFilterId } from '@/types/solution';
import { resolveSolutionTabFromFilters } from '@/types/solution';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import { useAnalyticsScreen } from '@/analytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

type SummarySolutionCarouselId = SolutionFilterId | 'all';

const SummaryScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Summary', screenClass: 'SummaryScreen' });
  useNotifications();
  const { t } = useTranslation();
  const { homeCarouselOptions } = useSolutions();
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

  const { allCategoryOptions, categories } = useCategories({ enabled: true });
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
    ...SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
    enabled: true,
    categoryId: selectedCategoryId ?? null,
  });

  const { products: suggestedPrograms } = useSuggestedProducts({
    ...SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
    enabled: true,
    categoryId: selectedCategoryId ?? null,
    type: PRODUCT_CATALOG_TYPE.PROGRAM,
  });

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

  const recommendedProgramCards = useMemo((): JoinCardItem[] => {
    return suggestedPrograms.map((p) => ({
      id: p.id,
      title: p.title,
      badge: p.tag,
      image: p.image,
    }));
  }, [suggestedPrograms]);

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
        return suggestedPrograms.length === 0;
      case 'all':
      default:
        return (
          filteredJoinCommunities.length === 0 &&
          filteredProviders.length === 0 &&
          filteredProducts.length === 0 &&
          suggestedPrograms.length === 0
        );
    }
  }, [
    hasActiveSearchOrFilter,
    selectedSolutionTab,
    filteredJoinCommunities.length,
    filteredProviders.length,
    filteredProducts.length,
    suggestedPrograms.length,
  ]);

  const showEmptyState = hasActiveSearchOrFilter && hasNoResultsForCurrentTab;

  const handleFilterCategoryApply = useCallback(
    (result: FilterCategoryResult) => {
      setSelectedCategoryId(result.categoryId ?? undefined);
      setSelectedCategoryName(result.categoryName ?? null);
      setSelectedSolutionIds(result.solutionIds);

      setSelectedSolutionTab(resolveSolutionTabFromFilters(result.solutionIds as SolutionFilterId[]));
    },
    [setSelectedCategoryId, setSelectedCategoryName],
  );

  const handleClearFilterCategory = useCallback(() => {
    setSelectedCategoryId(undefined);
    setSelectedCategoryName(null);
    setSelectedSolutionIds([]);
    setSelectedSolutionTab('all');
  }, []);

  const selectedCategoryFromId =
    selectedCategoryId != null
      ? categories.find((category) => String(category.categoryId) === String(selectedCategoryId))
      : null;

  const categoryFilterButtonLabel =
    selectedCategoryName != null
      ? getCategoryName(selectedCategoryName)
      : selectedCategoryFromId?.name ?? t('marketplace.category');
  const selectedCarouselSolutionId = useMemo<SummarySolutionCarouselId>(() => {
    if (selectedSolutionIds.length === 1) {
      return selectedSolutionIds[0] as SummarySolutionCarouselId;
    }

    return selectedSolutionTab;
  }, [selectedSolutionIds, selectedSolutionTab]);

  const menuItems = useMenuItems(navigation);
  const { setMenu } = useFloatingMenu();

  useFocusEffect(
    useCallback(() => {
      setMenu(menuItems, 'home');
    }, [menuItems, setMenu]),
  );

  // TODO: Temporariamente desabilitados
  // const handleEventPress = (event: Event) => {};
  // const handleEventSave = (event: Event) => {};
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
    async (community: JoinCardItem) => {
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
    (program: JoinCardItem) => {
      rootNavigation.navigate('ProductDetails', {
        productId: program.id,
      } as never);
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
        showBellButton: true,
        onBellPress: () => rootNavigation.navigate('Activities' as never),
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
              placeholder={t('common.search')}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearchPress={() => undefined}
              showFilterButton={false}
            />
            <StickyFilterCarouselRow<SummarySolutionCarouselId>
              filterButtonLabel={categoryFilterButtonLabel}
              filterButtonSelected={selectedCategoryName != null || selectedSolutionIds.length > 0}
              onFilterButtonPress={() => setIsFilterCategoryModalVisible(true)}
              carouselOptions={homeCarouselOptions}
              selectedCarouselId={selectedCarouselSolutionId}
              onCarouselSelect={(solutionId) => {
                if (solutionId === 'all') {
                  setSelectedSolutionIds([]);
                  setSelectedSolutionTab('all');
                  return;
                }

                setSelectedSolutionIds([solutionId]);
                setSelectedSolutionTab(resolveSolutionTabFromFilters([solutionId]));
              }}
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
                  <Text style={styles.sectionTitle}>{t('home.recommendedCommunitySectionTitle')}</Text>
                  <View style={styles.sectionContainer}>
                    <JoinCard items={filteredJoinCommunities} onItemPress={handleJoinCommunity} />
                  </View>
                </View>
              )}

              {(selectedSolutionTab === 'all' || selectedSolutionTab === 'programs') &&
                recommendedProgramCards.length > 0 && (
                  <View style={styles.sectionDivider}>
                    <Text style={styles.sectionTitle}>{t('home.recommendedProgramSectionTitle')}</Text>
                    <View style={styles.sectionContainer}>
                      <JoinCard items={recommendedProgramCards} onItemPress={handleProgramPress} />
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
            </>
          )}
        </ScrollView>
      </View>
    </ScreenWithHeader>
  );
};

export default SummaryScreen;
