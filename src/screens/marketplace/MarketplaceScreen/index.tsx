import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, type ListRenderItem, TouchableOpacity, View, Text } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { SearchBar } from '@/components/ui/inputs';
import { IconButton } from '@/components/ui/buttons';
import { StickyFilterCarouselRow } from '@/components/ui/menu';
import { DEFAULT_MARKETPLACE_SORT_ORDER, type MarketplaceSortOrderId } from '@/constants/marketplaceSortOrder';
import { buildMarketplaceCategoryBadgeLabels } from '@/utils/marketplace/buildMarketplaceCategoryBadgeLabels';
import { sortAdsByMarketplaceOrder } from '@/utils/marketplace/sorting';
import { ScreenWithHeader } from '@/components/ui/layout';
import { EmptyState } from '@/components/ui/feedback';
import { GradientBackgroundByCategory } from '@/components/sections';
import { FilterCategoryModal, type FilterCategoryResult, type SolutionId } from '@/components/ui/modals';
import { WeekHighlightCard } from '@/components/sections/marketplace';
import { ProductItemCard, ProductItemCardSkeleton } from '@/components/ui/cards';
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
import type { Ad, Advertiser } from '@/types/ad';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import type { RootStackParamList } from '@/types/navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SecondaryButton } from '@/components/ui/buttons';
import { COLORS } from '@/constants';
import { styles as shoppingListStyles } from '@/components/sections/community/ShoppingList/styles';
import { styles } from './styles';
import { useAnalyticsScreen } from '@/analytics';
import { CategoryName } from '@/types';
import {
  marketplaceSolutionOptions,
  type MarketplaceSolutionFilterId,
  type SolutionFilterId,
  type SolutionTab,
} from '@/types/solution';

const CATEGORY_SPECIALISTS = 'specialists';
const SOLUTION_ALL: SolutionTab = 'all';
const MARKETPLACE_SOLUTION_ID_SET = new Set<SolutionFilterId>(marketplaceSolutionOptions.map((option) => option.id));

const DEFAULT_HIGHLIGHT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';
const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';
const MARKETPLACE_LIST_SKELETON_COUNT = 4;
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
  const selectedCategory =
    selectedSolutionTab === 'professionals'
      ? CATEGORY_SPECIALISTS
      : selectedSolutionTab === SOLUTION_ALL
      ? undefined
      : selectedSolutionTab;
  const [selectedCategoryName, setSelectedCategoryName] = useState<CategoryName | null>(null);
  const [page, setPage] = useState(1);
  const [isFilterCategoryModalVisible, setIsFilterCategoryModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<SolutionId[]>([]);

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

  const {
    ads: listingAds,
    loading: adsLoading,
    hasMore: adsHasMore,
    loadAds,
  } = useMarketplaceAds({
    selectedCategory,
    selectedCategoryId,
    page,
    searchQuery: appliedSearchQuery || undefined,
    enabled: !isProgramsTab,
  });

  const {
    ads: programCatalogAds,
    loading: programsLoading,
    hasMore: programsHasMore,
    loadProducts,
  } = useProducts({
    categoryId: selectedCategoryId,
    page,
    searchQuery: appliedSearchQuery || undefined,
    enabled: isProgramsTab,
  });

  const ads = isProgramsTab ? programCatalogAds : listingAds;
  const loading = isProgramsTab ? programsLoading : adsLoading;
  const hasMore = isProgramsTab ? programsHasMore : adsHasMore;

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
        setPage(1);
        return next;
      });
    }, 450);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    if (isProgramsTab) {
      loadProducts();
      return;
    }
    loadAds();
  }, [isProgramsTab, loadAds, loadProducts, selectedCategory, selectedCategoryId, page, appliedSearchQuery]);

  const handleAdPress = useCallback(
    (ad: Ad) => {
      handleAdNavigation(ad, navigation);
    },
    [navigation],
  );

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setPage((prev) => prev + 1);
  }, [loading, hasMore]);

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

    setPage(1);
  };

  const handleClearFilterCategory = useCallback(() => {
    setSelectedCategoryId(undefined);
    setSelectedSolutionIds([]);
    setSelectedSolutionTab(SOLUTION_ALL);
    setSelectedCategoryName(null);
    setSearchQuery('');
    setAppliedSearchQuery('');
    setPage(1);
  }, []);

  const selectedCategoryFromId =
    selectedCategoryId != null
      ? categories.find((category) => String(category.categoryId) === String(selectedCategoryId))
      : null;

  const categoryFilterButtonLabel =
    selectedCategoryName != null
      ? getCategoryName(selectedCategoryName)
      : selectedCategoryFromId?.name ?? t('marketplace.category');

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
              setPage(1);
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
            setPage(1);
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
    return sortAdsByMarketplaceOrder(ads, DEFAULT_MARKETPLACE_SORT_ORDER as MarketplaceSortOrderId);
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

  const listAdsForCurrentTab = useMemo(() => {
    const isSearching = appliedSearchQuery.trim().length > 0;
    const skipHighlightSlice = isSearching || selectedSolutionTab === 'programs' || selectedSolutionTab === 'services';
    if (skipHighlightSlice) {
      return filteredAdsBySolution;
    }
    return page === 1 ? filteredAdsBySolution.slice(1) : filteredAdsBySolution;
  }, [filteredAdsBySolution, page, appliedSearchQuery, selectedSolutionTab]);

  const handleProfessionalPress = useCallback(
    (advertiser: Advertiser) => {
      navigation.navigate('ProviderProfile', {
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
        <View style={shoppingListStyles.list}>
          {professionals.map((advertiser) => (
            <View key={advertiser.id} style={shoppingListStyles.professionalCardWrapper}>
              <View style={shoppingListStyles.professionalCardContent}>
                {advertiser.logo ? (
                  <CachedImage source={{ uri: advertiser.logo }} style={shoppingListStyles.professionalAvatar} />
                ) : (
                  <View style={shoppingListStyles.professionalAvatarPlaceholder}>
                    <Icon name='person' size={32} color={COLORS.NEUTRAL.LOW.MEDIUM} />
                  </View>
                )}
                <View style={shoppingListStyles.professionalInfo}>
                  <Text style={shoppingListStyles.professionalName} numberOfLines={1}>
                    {advertiser.name ?? ''}
                  </Text>
                  {advertiser.description ? (
                    <Text style={shoppingListStyles.professionalProfession}>{advertiser.description}</Text>
                  ) : null}
                </View>
                <SecondaryButton
                  label={t('community.viewProfile')}
                  onPress={() => handleProfessionalPress(advertiser)}
                  size='medium'
                  style={shoppingListStyles.professionalViewProfileButton}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }, [professionals, t, handleProfessionalPress]);

  const renderWeekHighlights = () => {
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

    const categoryBadgeLabels = buildMarketplaceCategoryBadgeLabels(highlight.product, categories);
    const categoryBadge = categoryBadgeLabels.length > 0 ? categoryBadgeLabels.join(' · ') : undefined;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('marketplace.weekHighlights')}</Text>
        <WeekHighlightCard
          title={highlight.product.name || t('marketplace.product')}
          image={highlight.product.image || DEFAULT_HIGHLIGHT_IMAGE}
          price={highlight.product.price}
          onPress={() => handleAdPress(highlight)}
          badge={categoryBadge}
        />
      </View>
    );
  };

  const isProfessionalsTab = selectedSolutionTab === 'professionals';
  const listData = isProfessionalsTab ? [] : listAdsForCurrentTab;
  const showProfessionalsAfterAllTab =
    selectedSolutionTab === SOLUTION_ALL && professionalsContent != null && listAdsForCurrentTab.length > 0;

  const listFooter = useMemo(() => {
    return (
      <View style={styles.listFooter}>
        {!isProfessionalsTab && loading && listAdsForCurrentTab.length > 0 ? (
          <View style={styles.listLoadingMore}>
            <ActivityIndicator size='small' color='#2196F3' />
          </View>
        ) : null}
        {!isProfessionalsTab && hasMore && !loading && listAdsForCurrentTab.length > 0 ? (
          <TouchableOpacity style={styles.listLoadMoreButton} onPress={handleLoadMore} activeOpacity={0.7}>
            <Text style={styles.listLoadMoreText}>{t('marketplace.loadMore')}</Text>
          </TouchableOpacity>
        ) : null}
        {showProfessionalsAfterAllTab ? professionalsContent : null}
      </View>
    );
  }, [
    isProfessionalsTab,
    loading,
    listAdsForCurrentTab.length,
    hasMore,
    handleLoadMore,
    t,
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
    if (loading) {
      return (
        <View style={styles.listLoadingInitial}>
          {Array.from({ length: MARKETPLACE_LIST_SKELETON_COUNT }).map((_, index) => (
            <ProductItemCardSkeleton key={`mkt-skeleton-${index}`} />
          ))}
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
  }, [isProfessionalsTab, professionalsContent, loading, t, handleClearFilterCategory]);

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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={MARKETPLACE_LIST_END_REACHED_THRESHOLD}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={11}
          removeClippedSubviews
        />
      </View>
    </ScreenWithHeader>
  );
};

export default MarketplaceScreen;
