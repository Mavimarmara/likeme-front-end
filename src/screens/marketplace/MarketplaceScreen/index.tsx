import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { SearchBar } from '@/components/ui/inputs';
import { FloatingMenu, FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { FilterCategoryModal, type FilterCategoryResult, type SolutionId } from '@/components/ui/modals';
import { getCategoryDisplayLabel } from '@/components/ui/modals/FilterCategoryModal';
import { WeekHighlightCard, ProductsList } from '@/components/sections/marketplace';
import { useMarketplaceAds, useMenuItems, useCategories } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { handleAdNavigation } from '@/utils';
import type { Ad } from '@/types/ad';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';
import { useAnalyticsScreen } from '@/analytics';

const CATEGORY_ALL = 'all';
const CATEGORY_PRODUCTS = 'products';
const CATEGORY_SPECIALISTS = 'specialists';
const ORDER_BEST_RATED = 'best-rated';
const ORDER_ABOVE_100 = 'above-100';
const SOLUTION_PRODUCTS = 'products';
const SOLUTION_PROFESSIONALS = 'professionals';

const DEFAULT_HIGHLIGHT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

const getCategoryOptions = (t: (key: string) => string): ButtonCarouselOption<string>[] => [
  { id: CATEGORY_ALL, label: t('marketplace.allCategory') },
  { id: CATEGORY_PRODUCTS, label: t('marketplace.productsCategory') },
  { id: CATEGORY_SPECIALISTS, label: t('marketplace.specialistsCategory') },
];

const getOrderOptions = (t: (key: string) => string): ButtonCarouselOption<string>[] => [
  { id: ORDER_BEST_RATED, label: t('marketplace.bestRated') },
  { id: ORDER_ABOVE_100, label: t('marketplace.above100') },
];

type MarketplaceScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Marketplace'>;
  route?: RouteProp<RootStackParamList, 'Marketplace'>;
};

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Marketplace', screenClass: 'MarketplaceScreen' });
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORY_ALL);
  const [selectedOrder, setSelectedOrder] = useState<string>(ORDER_BEST_RATED);
  const [page, setPage] = useState(1);
  const [isFilterCategoryModalVisible, setIsFilterCategoryModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<SolutionId[]>([]);

  const { categories } = useCategories({ enabled: true });

  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);
  const orderOptions = useMemo(() => getOrderOptions(t), [t]);

  const { ads, loading, hasMore, loadAds } = useMarketplaceAds({
    selectedCategory,
    selectedCategoryId,
    page,
    searchQuery: appliedSearchQuery || undefined,
  });

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPage(1);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadAds();
  }, [loadAds, selectedCategory, selectedCategoryId, page, appliedSearchQuery]);

  const handleAdPress = (ad: Ad) => {
    handleAdNavigation(ad, navigation);
  };

  const menuItems = useMenuItems(navigation);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const handleFilterCategoryApply = (result: FilterCategoryResult) => {
    setSelectedCategoryId(result.categoryId ?? undefined);
    setSelectedSolutionIds(result.solutionIds);
    if (result.solutionIds.length === 1 && result.solutionIds[0] === SOLUTION_PRODUCTS) {
      setSelectedCategory(CATEGORY_PRODUCTS);
      setPage(1);
    } else if (result.solutionIds.length === 1 && result.solutionIds[0] === SOLUTION_PROFESSIONALS) {
      setSelectedCategory(CATEGORY_SPECIALISTS);
      setPage(1);
    } else {
      setSelectedCategory(CATEGORY_ALL);
      setPage(1);
    }
  };

  const handleClearFilterCategory = () => {
    setSelectedCategoryId(undefined);
    setSelectedSolutionIds([]);
    setSelectedCategory(CATEGORY_ALL);
    setPage(1);
  };

  const categoryFilterButtonLabel =
    selectedCategoryId != null ? getCategoryDisplayLabel(selectedCategoryId, categories, t) : t('marketplace.category');

  const renderCustomHeader = () => (
    <View style={styles.customHeader}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={t('marketplace.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearchPress={() => {
            setAppliedSearchQuery(searchQuery.trim());
            setPage(1);
          }}
          showFilterButton={true}
          onFilterPress={() => setIsFilterCategoryModalVisible(true)}
        />
      </View>
      <View style={styles.filterMenuContainer}>
        <FilterMenu
          filterButtonLabel={categoryFilterButtonLabel}
          onFilterButtonPress={() => setIsFilterCategoryModalVisible(true)}
          carouselOptions={categoryOptions}
          selectedCarouselId={selectedCategory}
          onCarouselSelect={handleCategorySelect}
        />
      </View>
      <FilterCategoryModal
        visible={isFilterCategoryModalVisible}
        onClose={() => setIsFilterCategoryModalVisible(false)}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(cat) => setSelectedCategoryId(cat?.categoryId ?? undefined)}
        selectedSolutionIds={selectedSolutionIds}
        onToggleSolution={(id) => {
          setSelectedSolutionIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
        }}
        onFilter={handleFilterCategoryApply}
        onClear={handleClearFilterCategory}
      />
    </View>
  );

  const renderWeekHighlights = () => {
    const highlight = ads[0];
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

  const displayAds = page === 1 && ads.length > 0 ? ads.slice(1) : ads;
  const sortedAds = useMemo(() => {
    return [...displayAds].sort((a, b) => {
      const priceA = a.product?.price ?? 0;
      const priceB = b.product?.price ?? 0;
      const nameA = (a.product?.name ?? '').toLowerCase();
      const nameB = (b.product?.name ?? '').toLowerCase();
      if (selectedOrder === ORDER_ABOVE_100) {
        const aAbove = priceA >= 100 ? 1 : 0;
        const bAbove = priceB >= 100 ? 1 : 0;
        if (bAbove !== aAbove) return bAbove - aAbove;
        return priceB - priceA;
      }
      return nameA.localeCompare(nameB);
    });
  }, [displayAds, selectedOrder]);

  const renderAllAds = () => (
    <ProductsList
      ads={sortedAds}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={() => setPage((prev) => prev + 1)}
      navigation={navigation}
      orderOptions={orderOptions}
      selectedOrder={selectedOrder}
      onOrderSelect={handleOrderSelect}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header showBackButton={false} showCartButton={true} onCartPress={handleCartPress} />
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
      <FloatingMenu items={menuItems} selectedId='marketplace' />
    </SafeAreaView>
  );
};

export default MarketplaceScreen;
