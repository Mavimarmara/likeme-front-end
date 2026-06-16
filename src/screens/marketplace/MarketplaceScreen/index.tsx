import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  type ListRenderItem,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  View,
  Text,
} from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { SearchBar } from '@/components/ui/inputs';
import { IconButton } from '@/components/ui/buttons';
import { StickyFilterCarouselRow } from '@/components/ui/menu';
import { DEFAULT_MARKETPLACE_SORT_ORDER, type MarketplaceSortOrderId } from '@/constants/marketplaceSortOrder';
import { buildMarketplaceCategoryBadgeLabels } from '@/utils/marketplace/buildMarketplaceCategoryBadgeLabels';
import { groupMarketplaceAdsBySolutionKind } from '@/utils/marketplace/groupMarketplaceAdsBySolutionKind';
import { sortAdsByMarketplaceOrder } from '@/utils/marketplace/sorting';
import { uniqueAdsById } from '@/utils/marketplace/uniqueAdsById';
import { ScreenWithHeader } from '@/components/ui/layout';
import { EmptyState } from '@/components/ui/feedback';
import { GradientBackgroundByCategory } from '@/components/sections';
import { FilterCategoryModal, type FilterCategoryResult, type SolutionId } from '@/components/ui/modals';
import {
  MarketplaceCategoryBlocks,
  MarketplaceProductCardsList,
  MarketplaceProgramCardsRow,
  MarketplaceProfessionalsBlock,
  MarketplaceServiceCardsList,
} from '@/components/sections/marketplace';
import { JoinCard, ProductItemCard } from '@/components/ui/cards';
import { adToJoinCardItem } from '@/utils/marketplace/adToJoinCardItem';
import {
  useMarketplaceAds,
  useProducts,
  useMenuItems,
  useCategories,
  useCategoryDisplayLabel,
  useUserAvatar,
  useAdvertisers,
  useSolutions,
} from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { handleAdNavigation } from '@/utils';
import { navigateToProviderProfile } from '@/utils/navigation/marketplaceNavigation';
import type { Ad, Advertiser } from '@/types/ad';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';
import { useAnalyticsScreen } from '@/analytics';
import { CategoryName } from '@/types';
import {
  marketplaceSolutionOptions,
  type MarketplaceSolutionFilterId,
  type SolutionFilterId,
  type SolutionTab,
} from '@/types/solution';

const SOLUTION_ALL: SolutionTab = 'all';
const MARKETPLACE_SOLUTION_ID_SET = new Set<SolutionFilterId>(marketplaceSolutionOptions.map((option) => option.id));

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';
const MARKETPLACE_LIST_END_REACHED_THRESHOLD = 0.5;
type MarketplaceSolutionTab = SolutionTab | MarketplaceSolutionFilterId;

type MarketplaceScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Marketplace'>;
  route?: RouteProp<RootStackParamList, 'Marketplace'>;
};

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Marketplace', screenClass: 'MarketplaceScreen' });
  const { t } = useTranslation();
  const { marketplaceCarouselOptions } = useSolutions();
  const rootNavigation = navigation.getParent() ?? navigation;
  const userAvatarUri = useUserAvatar();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [selectedSolutionTab, setSelectedSolutionTab] = useState<MarketplaceSolutionTab>(SOLUTION_ALL);
  const [selectedCategoryName, setSelectedCategoryName] = useState<CategoryName | null>(null);
  const [isFilterCategoryModalVisible, setIsFilterCategoryModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<SolutionId[]>([]);
  const [allTabPage, setAllTabPage] = useState(1);
  const [productsTabPage, setProductsTabPage] = useState(1);
  const [servicesTabPage, setServicesTabPage] = useState(1);
  const [programsTabPage, setProgramsTabPage] = useState(1);

  const marketplaceListingsEnabled = selectedSolutionTab !== 'professionals';
  const marketplaceTabsPrefetchKeyRef = useRef<string | null>(null);
  const scrollNearBottomRef = useRef(false);
  const flatListLoadMoreLockedRef = useRef(false);

  const { categories } = useCategories({ enabled: true });
  const { getCategoryName } = useCategoryDisplayLabel();
  const professionalsSearch = appliedSearchQuery.trim();
  const { advertisers: professionals } = useAdvertisers({
    listOptions: {
      status: 'active',
      limit: 50,
      ...(professionalsSearch ? { search: professionalsSearch } : {}),
      ...(selectedCategoryId != null && selectedCategoryId !== '' ? { categoryId: selectedCategoryId } : {}),
    },
  });

  const solutionTabs = useMemo(() => marketplaceCarouselOptions, [marketplaceCarouselOptions]);

  const isProgramsTab = selectedSolutionTab === 'programs';
  const listingsSearchQuery = appliedSearchQuery || undefined;

  const {
    ads: allTabAds,
    loading: allTabLoading,
    hasMore: allTabHasMore,
    loadAds: loadAllTabAds,
  } = useMarketplaceAds({
    selectedCategory: undefined,
    selectedCategoryId,
    page: allTabPage,
    searchQuery: listingsSearchQuery,
    enabled: marketplaceListingsEnabled,
  });

  const {
    ads: productsTabAds,
    loading: productsTabLoading,
    hasMore: productsTabHasMore,
    loadAds: loadProductsTabAds,
  } = useMarketplaceAds({
    selectedCategory: 'products',
    selectedCategoryId,
    page: productsTabPage,
    searchQuery: listingsSearchQuery,
    enabled: marketplaceListingsEnabled,
  });

  const {
    ads: servicesTabAds,
    loading: servicesTabLoading,
    hasMore: servicesTabHasMore,
    loadAds: loadServicesTabAds,
  } = useMarketplaceAds({
    selectedCategory: 'services',
    selectedCategoryId,
    page: servicesTabPage,
    searchQuery: listingsSearchQuery,
    enabled: marketplaceListingsEnabled,
  });

  const {
    ads: programCatalogAds,
    loading: programsLoading,
    hasMore: programsHasMore,
    loadProducts,
  } = useProducts({
    categoryId: selectedCategoryId,
    page: programsTabPage,
    searchQuery: listingsSearchQuery,
    enabled: marketplaceListingsEnabled,
  });

  const listingTabState = useMemo(() => {
    switch (selectedSolutionTab) {
      case 'products':
        return {
          ads: productsTabAds,
          loading: productsTabLoading,
          hasMore: productsTabHasMore,
          page: productsTabPage,
        };
      case 'services':
        return {
          ads: servicesTabAds,
          loading: servicesTabLoading,
          hasMore: servicesTabHasMore,
          page: servicesTabPage,
        };
      case 'programs':
        return {
          ads: programCatalogAds,
          loading: programsLoading,
          hasMore: programsHasMore,
          page: programsTabPage,
        };
      case 'professionals':
        return { ads: [], loading: false, hasMore: false, page: 1 };
      default:
        return {
          ads: allTabAds,
          loading: allTabLoading,
          hasMore: allTabHasMore,
          page: allTabPage,
        };
    }
  }, [
    selectedSolutionTab,
    allTabAds,
    allTabLoading,
    allTabHasMore,
    allTabPage,
    productsTabAds,
    productsTabLoading,
    productsTabHasMore,
    productsTabPage,
    servicesTabAds,
    servicesTabLoading,
    servicesTabHasMore,
    servicesTabPage,
    programCatalogAds,
    programsLoading,
    programsHasMore,
    programsTabPage,
  ]);

  const { ads, loading, hasMore, page: activeListingPage } = listingTabState;

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleMenuPress = () => {
    rootNavigation.navigate('Profile' as never);
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      const next = searchQuery.trim();
      setAppliedSearchQuery((prev) => {
        if (prev === next) return prev;
        setAllTabPage(1);
        setProductsTabPage(1);
        setServicesTabPage(1);
        setProgramsTabPage(1);
        marketplaceTabsPrefetchKeyRef.current = null;
        return next;
      });
    }, 450);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    setAllTabPage(1);
    setProductsTabPage(1);
    setServicesTabPage(1);
    setProgramsTabPage(1);
    marketplaceTabsPrefetchKeyRef.current = null;
  }, [selectedCategoryId]);

  useEffect(() => {
    if (!marketplaceListingsEnabled) {
      return;
    }
    const prefetchKey = `${listingsSearchQuery ?? ''}::${selectedCategoryId ?? ''}`;
    if (marketplaceTabsPrefetchKeyRef.current === prefetchKey) {
      return;
    }
    marketplaceTabsPrefetchKeyRef.current = prefetchKey;
    if (selectedSolutionTab !== SOLUTION_ALL) {
      void loadAllTabAds();
    }
    if (selectedSolutionTab !== 'products') {
      void loadProductsTabAds();
    }
    if (selectedSolutionTab !== 'services') {
      void loadServicesTabAds();
    }
    if (selectedSolutionTab !== 'programs') {
      void loadProducts();
    }
  }, [
    marketplaceListingsEnabled,
    listingsSearchQuery,
    selectedCategoryId,
    selectedSolutionTab,
    loadAllTabAds,
    loadProductsTabAds,
    loadServicesTabAds,
    loadProducts,
  ]);

  useEffect(() => {
    if (!marketplaceListingsEnabled || isProgramsTab) {
      return;
    }
    if (selectedSolutionTab === 'products') {
      void loadProductsTabAds();
      return;
    }
    if (selectedSolutionTab === 'services') {
      void loadServicesTabAds();
      return;
    }
    void loadAllTabAds();
  }, [
    marketplaceListingsEnabled,
    isProgramsTab,
    selectedSolutionTab,
    allTabPage,
    productsTabPage,
    servicesTabPage,
    loadAllTabAds,
    loadProductsTabAds,
    loadServicesTabAds,
  ]);

  useEffect(() => {
    if (!marketplaceListingsEnabled) {
      return;
    }
    const needsProgramCatalog =
      isProgramsTab || (selectedSolutionTab === SOLUTION_ALL && appliedSearchQuery.trim().length === 0);
    if (!needsProgramCatalog) {
      return;
    }
    void loadProducts();
  }, [
    marketplaceListingsEnabled,
    isProgramsTab,
    selectedSolutionTab,
    appliedSearchQuery,
    selectedCategoryId,
    programsTabPage,
    loadProducts,
  ]);

  const handleAdPress = useCallback(
    (ad: Ad) => {
      handleAdNavigation(ad, navigation);
    },
    [navigation],
  );

  const handleLoadMore = useCallback(() => {
    const usesAllTabGroupedPagination = selectedSolutionTab === SOLUTION_ALL && appliedSearchQuery.trim().length === 0;
    if (usesAllTabGroupedPagination) {
      if (allTabLoading || programsLoading) {
        return;
      }
      if (!allTabHasMore && !programsHasMore) {
        return;
      }
      if (allTabHasMore) {
        setAllTabPage((prev) => prev + 1);
      }
      if (programsHasMore) {
        setProgramsTabPage((prev) => prev + 1);
      }
      return;
    }
    if (loading || !hasMore) {
      return;
    }
    if (isProgramsTab) {
      setProgramsTabPage((prev) => prev + 1);
      return;
    }
    if (selectedSolutionTab === 'products') {
      setProductsTabPage((prev) => prev + 1);
      return;
    }
    if (selectedSolutionTab === 'services') {
      setServicesTabPage((prev) => prev + 1);
      return;
    }
    setAllTabPage((prev) => prev + 1);
  }, [
    appliedSearchQuery,
    allTabHasMore,
    allTabLoading,
    hasMore,
    isProgramsTab,
    loading,
    programsHasMore,
    programsLoading,
    selectedSolutionTab,
  ]);

  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'marketplace');

  const handleFilterCategoryApply = (result: FilterCategoryResult) => {
    setSelectedCategoryId(result.categoryId ?? undefined);
    setSelectedSolutionIds(result.solutionIds);
    setSelectedCategoryName(result.categoryName);

    if (result.solutionIds.length === 1 && MARKETPLACE_SOLUTION_ID_SET.has(result.solutionIds[0])) {
      setSelectedSolutionTab(result.solutionIds[0]);
    } else if (result.solutionIds.length > 1 && !result.solutionIds.includes(selectedSolutionTab as SolutionId)) {
      const firstSupportedTab = result.solutionIds.find((id) => MARKETPLACE_SOLUTION_ID_SET.has(id));
      if (firstSupportedTab != null) {
        setSelectedSolutionTab(firstSupportedTab);
      }
    } else if (result.solutionIds.length === 0) {
      setSelectedSolutionTab(SOLUTION_ALL);
    }

    setAllTabPage(1);
    setProductsTabPage(1);
    setServicesTabPage(1);
    setProgramsTabPage(1);
    marketplaceTabsPrefetchKeyRef.current = null;
  };

  const handleClearFilterCategory = useCallback(() => {
    setSelectedCategoryId(undefined);
    setSelectedSolutionIds([]);
    setSelectedSolutionTab(SOLUTION_ALL);
    setSelectedCategoryName(null);
    setSearchQuery('');
    setAppliedSearchQuery('');
    setAllTabPage(1);
    setProductsTabPage(1);
    setServicesTabPage(1);
    setProgramsTabPage(1);
    marketplaceTabsPrefetchKeyRef.current = null;
  }, []);

  const selectedCategoryFromId =
    selectedCategoryId != null
      ? categories.find((category) => String(category.categoryId) === String(selectedCategoryId))
      : null;

  const categoryFilterButtonLabel =
    selectedCategoryName != null
      ? getCategoryName(selectedCategoryName)
      : selectedCategoryFromId?.name ?? t('marketplace.category');

  const categoryDisplayName =
    selectedCategoryName != null ? getCategoryName(selectedCategoryName) : selectedCategoryFromId?.name?.trim() ?? '';

  const showCategoryBlocks =
    selectedCategoryId != null && selectedSolutionTab === SOLUTION_ALL && appliedSearchQuery.trim().length === 0;

  const showAllTabGroupedLayout =
    selectedSolutionTab === SOLUTION_ALL && !showCategoryBlocks && appliedSearchQuery.trim().length === 0;

  const showSolutionKindLayout =
    showCategoryBlocks ||
    showAllTabGroupedLayout ||
    selectedSolutionTab === 'services' ||
    selectedSolutionTab === 'programs';

  const sortedAllTabAds = useMemo(() => {
    return sortAdsByMarketplaceOrder(
      uniqueAdsById(allTabAds),
      DEFAULT_MARKETPLACE_SORT_ORDER as MarketplaceSortOrderId,
    );
  }, [allTabAds]);

  const groupedCategoryAds = useMemo(() => groupMarketplaceAdsBySolutionKind(sortedAllTabAds), [sortedAllTabAds]);

  const sortedProgramAds = useMemo(() => {
    return sortAdsByMarketplaceOrder(programCatalogAds, DEFAULT_MARKETPLACE_SORT_ORDER as MarketplaceSortOrderId);
  }, [programCatalogAds]);

  const categoryProgramAds = useMemo(() => {
    const seen = new Set<string>();
    const merged: Ad[] = [];
    for (const ad of [...sortedProgramAds, ...groupedCategoryAds.program]) {
      if (seen.has(ad.id)) {
        continue;
      }
      seen.add(ad.id);
      merged.push(ad);
    }
    return merged;
  }, [sortedProgramAds, groupedCategoryAds.program]);

  const categoryIntroText =
    showCategoryBlocks && categoryDisplayName
      ? t('marketplace.categoryIntro', {
          categoryName: categoryDisplayName,
          defaultValue:
            'Aqui você encontra uma curadoria de produtos, conteúdos e serviços alinhados com {{categoryName}}.',
        })
      : null;

  const hasCategoryBlockContent =
    groupedCategoryAds.product.length > 0 ||
    groupedCategoryAds.service.length > 0 ||
    categoryProgramAds.length > 0 ||
    professionals.length > 0;

  const renderCustomHeader = () => (
    <View style={styles.customHeader}>
      <View style={styles.searchContainer}>
        <IconButton
          icon='chevron-left'
          onPress={() => navigation.goBack()}
          backgroundSize='medium'
          containerStyle={styles.searchRowBackButton}
        />
        <View style={styles.searchRowSearch}>
          <SearchBar
            placeholder={t('marketplace.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearchPress={() => {
              setAppliedSearchQuery(searchQuery.trim());
              setAllTabPage(1);
              setProductsTabPage(1);
              setServicesTabPage(1);
              setProgramsTabPage(1);
              marketplaceTabsPrefetchKeyRef.current = null;
            }}
            showFilterButton={false}
          />
        </View>
      </View>
      <View style={styles.filterMenuContainer}>
        <StickyFilterCarouselRow
          filterButtonLabel={categoryFilterButtonLabel}
          filterButtonSelected={
            selectedCategoryId != null || selectedCategoryName != null || selectedSolutionIds.length > 0
          }
          onFilterButtonPress={() => setIsFilterCategoryModalVisible(true)}
          carouselOptions={solutionTabs}
          selectedCarouselId={selectedSolutionTab}
          onCarouselSelect={(solutionId) => {
            setSelectedSolutionTab(solutionId);
            if (solutionId === SOLUTION_ALL) {
              setSelectedSolutionIds([]);
            } else {
              setSelectedSolutionIds([solutionId as SolutionId]);
            }
            setAllTabPage(1);
            setProductsTabPage(1);
            setServicesTabPage(1);
            setProgramsTabPage(1);
          }}
        />
      </View>
      <FilterCategoryModal
        visible={isFilterCategoryModalVisible}
        onClose={() => setIsFilterCategoryModalVisible(false)}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={() => {
          // A seleção de categoria só deve ser aplicada quando o usuário clicar em "Filtrar"
        }}
        selectedSolutionIds={selectedSolutionIds}
        onToggleSolution={(id) => {
          setSelectedSolutionIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
        }}
        onFilter={handleFilterCategoryApply}
        onClear={handleClearFilterCategory}
      />
    </View>
  );

  const sortedAds = useMemo(() => {
    return sortAdsByMarketplaceOrder(uniqueAdsById(ads), DEFAULT_MARKETPLACE_SORT_ORDER as MarketplaceSortOrderId);
  }, [ads]);

  const filteredAdsBySolution = useMemo(() => {
    return sortedAds.filter((ad) => {
      const product = ad.product;
      const type = (product?.type ?? '').trim().toLowerCase();
      const hasProduct = !!product;
      const isProgramType = type === PRODUCT_CATALOG_TYPE.PROGRAM;

      switch (selectedSolutionTab) {
        case 'products':
          return hasProduct && !isProgramType && type !== 'service';
        case 'services':
          return hasProduct && type === 'service';
        case 'programs':
          return hasProduct && isProgramType;
        case 'professionals':
          return false;
        default:
          return true;
      }
    });
  }, [sortedAds, selectedSolutionTab]);

  const highlightAdId = useMemo(() => {
    if (selectedSolutionTab !== SOLUTION_ALL || appliedSearchQuery.trim().length > 0) {
      return null;
    }
    if (activeListingPage !== 1) {
      return null;
    }
    return filteredAdsBySolution[0]?.id ?? null;
  }, [selectedSolutionTab, appliedSearchQuery, activeListingPage, filteredAdsBySolution]);

  const excludeHighlightFromAds = useCallback(
    (adsList: readonly Ad[]) => {
      if (highlightAdId == null) {
        return adsList;
      }
      return adsList.filter((ad) => ad.id !== highlightAdId);
    },
    [highlightAdId],
  );

  const allTabServiceAds = useMemo(
    () => excludeHighlightFromAds(groupedCategoryAds.service),
    [excludeHighlightFromAds, groupedCategoryAds.service],
  );

  const allTabProgramAds = useMemo(
    () => excludeHighlightFromAds(categoryProgramAds),
    [excludeHighlightFromAds, categoryProgramAds],
  );

  const allTabProductAds = useMemo(
    () => excludeHighlightFromAds(groupedCategoryAds.product),
    [excludeHighlightFromAds, groupedCategoryAds.product],
  );

  const hasAllTabGroupedContent =
    (highlightAdId != null && filteredAdsBySolution[0]?.product != null) ||
    allTabServiceAds.length > 0 ||
    allTabProgramAds.length > 0 ||
    allTabProductAds.length > 0 ||
    professionals.length > 0;

  const listAdsForCurrentTab = useMemo(() => {
    if (showAllTabGroupedLayout) {
      return allTabProductAds;
    }
    const isSearching = appliedSearchQuery.trim().length > 0;
    const skipHighlightSlice = isSearching || selectedSolutionTab === 'programs' || selectedSolutionTab === 'services';
    if (skipHighlightSlice) {
      return filteredAdsBySolution;
    }
    return activeListingPage === 1 ? filteredAdsBySolution.slice(1) : filteredAdsBySolution;
  }, [
    showAllTabGroupedLayout,
    allTabProductAds,
    filteredAdsBySolution,
    activeListingPage,
    appliedSearchQuery,
    selectedSolutionTab,
  ]);

  const handleProfessionalPress = useCallback(
    (advertiser: Advertiser) => {
      navigateToProviderProfile(navigation, {
        providerId: advertiser.id,
        provider: {
          name: advertiser.name,
          avatar: advertiser.logo,
        },
      });
    },
    [navigation],
  );

  const renderAdItem = useCallback<ListRenderItem<Ad>>(
    ({ item: ad }) => {
      const product = ad.product;
      const displayName = product?.name || t('marketplace.product', { defaultValue: 'Product' });
      const displayImage = product?.image || DEFAULT_PRODUCT_IMAGE;
      const categoryBadges = buildMarketplaceCategoryBadgeLabels(product, categories);

      return (
        <ProductItemCard
          image={displayImage}
          title={displayName}
          badges={categoryBadges}
          price={product?.price}
          outOfStock={product?.status === 'out_of_stock'}
          outOfStockLabel={t('marketplace.outOfStock', { defaultValue: 'Out of stock' })}
          onPress={() => handleAdPress(ad)}
          showTrailingChevron={!!product}
        />
      );
    },
    [t, categories, handleAdPress],
  );

  const adKeyExtractor = useCallback((ad: Ad) => ad.id, []);

  const renderItemSeparator = useCallback(() => <View style={styles.listItemSeparator} />, []);

  const professionalsContent = useMemo(() => {
    if (!professionals.length) {
      return null;
    }
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('filterCategory.solutions.professionals')}</Text>
        <MarketplaceProfessionalsBlock
          professionals={professionals}
          onProfessionalPress={handleProfessionalPress}
          viewProfileLabel={t('community.viewProfile')}
        />
      </View>
    );
  }, [professionals, t, handleProfessionalPress]);

  const renderWeekHighlights = () => {
    if (showCategoryBlocks) {
      return null;
    }
    if (selectedSolutionTab !== SOLUTION_ALL) {
      return null;
    }
    if (appliedSearchQuery.trim().length > 0) {
      return null;
    }

    const highlight = filteredAdsBySolution[0];
    if (!highlight?.product) {
      return null;
    }

    const highlightItem = adToJoinCardItem(highlight, {
      categories,
      includePrice: true,
      fallbackTitle: t('marketplace.product', { defaultValue: 'Product' }),
    });

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('marketplace.weekHighlights')}</Text>
        <JoinCard
          title={highlightItem.title}
          badges={highlightItem.badges}
          image={highlightItem.image}
          price={highlightItem.price}
          square
          onPress={() => handleAdPress(highlight)}
        />
      </View>
    );
  };

  const isProfessionalsTab = selectedSolutionTab === 'professionals';
  const listData = isProfessionalsTab ? [] : listAdsForCurrentTab;
  const showCategoryBlocksLoading =
    showCategoryBlocks && (allTabLoading || programsLoading) && !hasCategoryBlockContent;
  const showAllTabGroupedLoading =
    showAllTabGroupedLayout && (allTabLoading || programsLoading) && !hasAllTabGroupedContent;
  const showListInitialLoading =
    !isProfessionalsTab && !showCategoryBlocks && !showAllTabGroupedLayout && loading && listData.length === 0;
  const showProfessionalsAfterAllTab =
    !showCategoryBlocks &&
    selectedSolutionTab === SOLUTION_ALL &&
    professionalsContent != null &&
    (showAllTabGroupedLayout ? hasAllTabGroupedContent : listAdsForCurrentTab.length > 0);
  const groupedAllTabHasMore = allTabHasMore || programsHasMore;
  const solutionKindHasMore = showCategoryBlocks || showAllTabGroupedLayout ? groupedAllTabHasMore : hasMore;
  const solutionKindLoading =
    showCategoryBlocks || showAllTabGroupedLayout ? allTabLoading || programsLoading : loading;
  const productFallbackTitle = t('marketplace.product', { defaultValue: 'Product' });
  const outOfStockLabel = t('marketplace.outOfStock', { defaultValue: 'Out of stock' });

  const handleGroupedScrollEndReached = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const visibleBottom = layoutMeasurement.height + contentOffset.y;
      const threshold = layoutMeasurement.height * MARKETPLACE_LIST_END_REACHED_THRESHOLD;
      const isNearBottom = visibleBottom >= contentSize.height - threshold;

      if (!isNearBottom) {
        scrollNearBottomRef.current = false;
        return;
      }

      if (scrollNearBottomRef.current || !solutionKindHasMore || solutionKindLoading) {
        return;
      }

      scrollNearBottomRef.current = true;
      handleLoadMore();
    },
    [solutionKindHasMore, solutionKindLoading, handleLoadMore],
  );

  const handleFlatListEndReached = useCallback(() => {
    if (flatListLoadMoreLockedRef.current || loading || !hasMore) {
      return;
    }
    flatListLoadMoreLockedRef.current = true;
    handleLoadMore();
  }, [loading, hasMore, handleLoadMore]);

  const handleFlatListMomentumScrollBegin = useCallback(() => {
    flatListLoadMoreLockedRef.current = false;
  }, []);

  const listFooter = useMemo(() => {
    const groupedLayoutActive = showCategoryBlocks || showAllTabGroupedLayout;
    const groupedHasContent = showCategoryBlocks ? hasCategoryBlockContent : hasAllTabGroupedContent;
    const showLoadMoreSpinner = showSolutionKindLayout
      ? solutionKindLoading && (groupedLayoutActive ? groupedHasContent : filteredAdsBySolution.length > 0)
      : !isProfessionalsTab && loading && listAdsForCurrentTab.length > 0;

    return (
      <View style={styles.listFooter}>
        {showLoadMoreSpinner ? (
          <View style={styles.listLoadingMore}>
            <ActivityIndicator size='small' color='#2196F3' />
          </View>
        ) : null}
        {showProfessionalsAfterAllTab ? professionalsContent : null}
      </View>
    );
  }, [
    showSolutionKindLayout,
    showCategoryBlocks,
    showAllTabGroupedLayout,
    solutionKindLoading,
    hasCategoryBlockContent,
    hasAllTabGroupedContent,
    filteredAdsBySolution.length,
    isProfessionalsTab,
    loading,
    listAdsForCurrentTab.length,
    showProfessionalsAfterAllTab,
    professionalsContent,
  ]);

  const listEmpty = useMemo(() => {
    if (isProfessionalsTab) {
      return (
        professionalsContent ?? (
          <View style={styles.listEmptyContainer}>
            <EmptyState
              title={t('marketplace.noAdsFound')}
              description={t('marketplace.noAdsFoundDescription')}
              iconName='storefront'
            />
          </View>
        )
      );
    }
    if (showCategoryBlocks && !hasCategoryBlockContent && !showCategoryBlocksLoading) {
      return (
        <View style={styles.listEmptyContainer}>
          <EmptyState
            title={t('marketplace.noAdsFound')}
            description={t('marketplace.noAdsFoundDescription')}
            iconName='storefront'
            actionLabel={t('home.clearFilters')}
            onActionPress={handleClearFilterCategory}
          />
        </View>
      );
    }
    return (
      <View style={styles.listEmptyContainer}>
        <EmptyState
          title={t('marketplace.noAdsFound')}
          description={t('marketplace.noAdsFoundDescription')}
          iconName='storefront'
          actionLabel={t('home.clearFilters')}
          onActionPress={handleClearFilterCategory}
        />
      </View>
    );
  }, [
    isProfessionalsTab,
    professionalsContent,
    showCategoryBlocks,
    hasCategoryBlockContent,
    showCategoryBlocksLoading,
    t,
    handleClearFilterCategory,
  ]);

  const renderSolutionKindContent = () => {
    if (showCategoryBlocks) {
      if (!hasCategoryBlockContent) {
        return listEmpty;
      }
      return (
        <MarketplaceCategoryBlocks
          groupedAds={groupedCategoryAds}
          programAds={categoryProgramAds}
          professionals={professionals}
          categories={categories}
          onAdPress={handleAdPress}
          onProfessionalPress={handleProfessionalPress}
        />
      );
    }

    if (showAllTabGroupedLayout) {
      if (!hasAllTabGroupedContent) {
        return listEmpty;
      }

      return (
        <>
          {allTabProgramAds.length > 0 ? (
            <View style={styles.section} testID='marketplace-block-programs'>
              <Text style={styles.sectionTitle}>{t('filterCategory.solutions.programs')}</Text>
              <MarketplaceProgramCardsRow
                ads={allTabProgramAds}
                categories={categories}
                onAdPress={handleAdPress}
                fallbackTitle={productFallbackTitle}
              />
            </View>
          ) : null}
          {allTabProductAds.length > 0 ? (
            <View style={styles.section} testID='marketplace-block-products'>
              <Text style={styles.sectionTitle}>{t('marketplace.allProducts')}</Text>
              <MarketplaceProductCardsList
                ads={allTabProductAds}
                categories={categories}
                onAdPress={handleAdPress}
                fallbackTitle={productFallbackTitle}
                outOfStockLabel={outOfStockLabel}
              />
            </View>
          ) : null}
          {allTabServiceAds.length > 0 ? (
            <View style={styles.section} testID='marketplace-block-services'>
              <Text style={styles.sectionTitle}>{t('filterCategory.solutions.services')}</Text>
              <MarketplaceServiceCardsList
                ads={allTabServiceAds}
                categories={categories}
                onAdPress={handleAdPress}
                fallbackTitle={productFallbackTitle}
              />
            </View>
          ) : null}
        </>
      );
    }

    if (filteredAdsBySolution.length === 0) {
      return listEmpty;
    }

    if (selectedSolutionTab === 'services') {
      return (
        <MarketplaceServiceCardsList
          ads={filteredAdsBySolution}
          categories={categories}
          onAdPress={handleAdPress}
          fallbackTitle={productFallbackTitle}
        />
      );
    }

    return (
      <MarketplaceProgramCardsRow
        ads={filteredAdsBySolution}
        categories={categories}
        onAdPress={handleAdPress}
        fallbackTitle={productFallbackTitle}
      />
    );
  };

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
      contentContainerStyle={styles.container}
    >
      <GradientBackgroundByCategory category={selectedCategoryName} />
      <View pointerEvents='none' style={styles.backgroundGradient}>
        <GradientBackgroundByCategory category={selectedCategoryName} />
      </View>
      <View style={styles.content}>
        {renderCustomHeader()}
        {showCategoryBlocksLoading || showAllTabGroupedLoading || showListInitialLoading ? (
          <View style={styles.listLoadingFullScreen}>
            <ActivityIndicator size='large' color='#2196F3' />
            <Text style={styles.listLoadingText}>{t('common.loading')}</Text>
          </View>
        ) : showSolutionKindLayout ? (
          <ScrollView
            testID='marketplace-scroll'
            style={styles.scrollView}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={handleGroupedScrollEndReached}
          >
            {renderWeekHighlights()}
            {categoryIntroText ? (
              <Text style={styles.categoryIntro} testID='marketplace-category-intro'>
                {categoryIntroText}
              </Text>
            ) : null}
            {renderSolutionKindContent()}
            {listFooter}
          </ScrollView>
        ) : (
          <FlatList<Ad>
            testID='marketplace-list'
            style={styles.scrollView}
            contentContainerStyle={styles.listContentContainer}
            showsVerticalScrollIndicator={false}
            data={listData}
            keyExtractor={adKeyExtractor}
            renderItem={renderAdItem}
            ItemSeparatorComponent={renderItemSeparator}
            ListHeaderComponent={renderWeekHighlights()}
            ListFooterComponent={listFooter}
            ListEmptyComponent={listEmpty}
            onEndReached={handleFlatListEndReached}
            onEndReachedThreshold={MARKETPLACE_LIST_END_REACHED_THRESHOLD}
            onMomentumScrollBegin={handleFlatListMomentumScrollBegin}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={11}
            removeClippedSubviews
          />
        )}
      </View>
    </ScreenWithHeader>
  );
};

export default MarketplaceScreen;
