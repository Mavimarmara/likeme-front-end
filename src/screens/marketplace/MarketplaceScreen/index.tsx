import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { SearchBar } from '@/components/ui/inputs';
import { IconButton } from '@/components/ui/buttons';
import { StickyFilterCarouselRow, type ButtonCarouselOption } from '@/components/ui/menu';
import { DEFAULT_MARKETPLACE_SORT_ORDER, type MarketplaceSortOrderId } from '@/constants/marketplaceSortOrder';
import { getMarketplaceSortOptions } from '@/utils/marketplace/sortOptions';
import { sortAdsByMarketplaceOrder } from '@/utils/marketplace/sorting';
import { ScreenWithHeader } from '@/components/ui/layout';
import { GradientBackgroundByCategory } from '@/components/sections';
import { FilterCategoryModal, type FilterCategoryResult, type SolutionId } from '@/components/ui/modals';
import { WeekHighlightCard, AdsList } from '@/components/sections/marketplace';
import {
  useMarketplaceAds,
  useProducts,
  useMenuItems,
  useCategories,
  useCategoryDisplayLabel,
  useUserAvatar,
  useAdvertisers,
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

const CATEGORY_ALL = 'all';
const CATEGORY_PRODUCTS = 'products';
const CATEGORY_SPECIALISTS = 'specialists';
const SOLUTION_PRODUCTS = 'products';
const SOLUTION_PROFESSIONALS = 'professionals';

const DEFAULT_HIGHLIGHT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

const getCategoryOptions = (t: (key: string) => string): ButtonCarouselOption<string>[] => [
  { id: CATEGORY_ALL, label: t('marketplace.allCategory') },
  { id: CATEGORY_PRODUCTS, label: t('marketplace.productsCategory') },
  { id: CATEGORY_SPECIALISTS, label: t('marketplace.specialistsCategory') },
];

const getSolutionTabs = (t: (key: string) => string) => [
  { id: 'products', label: t('filterCategory.solutions.products') },
  { id: 'services', label: t('filterCategory.solutions.services') },
  { id: 'programs', label: t('filterCategory.solutions.programs') },
  { id: 'professionals', label: t('filterCategory.solutions.professionals') },
];

type MarketplaceScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Marketplace'>;
  route?: RouteProp<RootStackParamList, 'Marketplace'>;
};

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Marketplace', screenClass: 'MarketplaceScreen' });
  const { t } = useTranslation();
  const rootNavigation = navigation.getParent() ?? navigation;
  const userAvatarUri = useUserAvatar();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [selectedSolutionTab, setSelectedSolutionTab] = useState<string>('products');
  const selectedCategory = selectedSolutionTab === 'professionals' ? CATEGORY_SPECIALISTS : selectedSolutionTab;
  const [selectedCategoryName, setSelectedCategoryName] = useState<CategoryName | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string>(DEFAULT_MARKETPLACE_SORT_ORDER);
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
    },
  });

  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);
  const solutionTabs = useMemo(() => getSolutionTabs(t), [t]);
  const orderOptions = useMemo(() => getMarketplaceSortOptions(t), [t]);

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
    const unsubscribe = navigation.addListener('focus', () => {
      setPage(1);
    });
    return unsubscribe;
  }, [navigation]);

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

  const handleAdPress = (ad: Ad) => {
    handleAdNavigation(ad, navigation);
  };

  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'marketplace');

  const handleSolutionTabChange = (tabId: string) => {
    setSelectedSolutionTab(tabId);
    setSelectedCategoryName(null);
    setPage(1);
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleFilterCategoryApply = (result: FilterCategoryResult) => {
    setSelectedCategoryId(result.categoryId ?? undefined);
    setSelectedSolutionIds(result.solutionIds);
    if (result.solutionIds.length === 1 && result.solutionIds[0] === SOLUTION_PRODUCTS) {
      setSelectedSolutionTab('products');
      setSelectedCategoryName(null);
      setPage(1);
    } else if (result.solutionIds.length === 1 && result.solutionIds[0] === SOLUTION_PROFESSIONALS) {
      setSelectedSolutionTab('professionals');
      setSelectedCategoryName(null);
      setPage(1);
    } else {
      setSelectedSolutionTab('products');
      setSelectedCategoryName(result.categoryName);
      setPage(1);
    }
  };

  const handleClearFilterCategory = () => {
    setSelectedCategoryId(undefined);
    setSelectedSolutionIds([]);
    setSelectedSolutionTab('products');
    setSelectedCategoryName(null);
    setSearchQuery('');
    setAppliedSearchQuery('');
    setPage(1);
  };

  const categoryFilterButtonLabel =
    selectedCategoryName != null ? getCategoryName(selectedCategoryName) : t('marketplace.category');

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
          filterButtonSelected={selectedCategoryName != null || selectedSolutionIds.length > 0}
          onFilterButtonPress={() => setIsFilterCategoryModalVisible(true)}
          carouselOptions={categoryOptions}
          selectedCarouselId={selectedCategory}
          onCarouselSelect={() => {
            /* category driven by tabs */
          }}
          showCarousel={false}
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
    return sortAdsByMarketplaceOrder(ads, selectedOrder as MarketplaceSortOrderId);
  }, [ads, selectedOrder]);

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

  const handleProfessionalPress = (advertiser: Advertiser) => {
    navigation.navigate('ProviderProfile', {
      providerId: advertiser.id,
      provider: {
        name: advertiser.name,
        avatar: advertiser.logo,
      },
    });
  };

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
                  <Image
                    source={{ uri: advertiser.logo }}
                    style={shoppingListStyles.professionalAvatar}
                    resizeMode='cover'
                  />
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
                    <Text style={shoppingListStyles.professionalProfession} numberOfLines={1}>
                      Especialista
                    </Text>
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
    if (selectedSolutionTab === 'professionals') {
      return null;
    }

    if (selectedSolutionTab === 'programs' || selectedSolutionTab === 'services') {
      return null;
    }

    if (appliedSearchQuery.trim().length > 0) {
      return null;
    }

    const highlight = filteredAdsBySolution[0];
    if (!highlight?.product) {
      return null;
    }

    const categoryBadge = highlight.product.categoryId
      ? categories.find((c) => c.categoryId === highlight.product?.categoryId)?.name
      : undefined;

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

  const renderAllAds = () => (
    <AdsList
      solutionTabs={solutionTabs}
      selectedTabId={selectedSolutionTab}
      onTabChange={handleSolutionTabChange}
      ads={listAdsForCurrentTab}
      professionalsContent={professionalsContent}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={() => setPage((prev) => prev + 1)}
      navigation={navigation}
      orderOptions={orderOptions}
      selectedOrder={selectedOrder}
      onOrderSelect={handleOrderSelect}
      emptyActionLabel={t('home.clearFilters')}
      onEmptyActionPress={handleClearFilterCategory}
    />
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
      contentContainerStyle={styles.container}
    >
      <GradientBackgroundByCategory category={selectedCategoryName} />
      <View pointerEvents='none' style={styles.backgroundGradient}>
        <GradientBackgroundByCategory category={selectedCategoryName} />
      </View>
      <View style={styles.content}>
        {renderCustomHeader()}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderWeekHighlights()}
          {renderAllAds()}
        </ScrollView>
      </View>
    </ScreenWithHeader>
  );
};

export default MarketplaceScreen;
