import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { SearchBar } from '@/components/ui/inputs';
import { IconButton } from '@/components/ui/buttons';
import { FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { Header } from '@/components/ui/layout';
import { GradientBackgroundByCategory } from '@/components/sections';
import { FilterCategoryModal, type FilterCategoryResult, type SolutionId } from '@/components/ui/modals';
import { WeekHighlightCard, AdsList } from '@/components/sections/marketplace';
import {
  useMarketplaceAds,
  useMenuItems,
  useCategories,
  useCategoryDisplayLabel,
  useUserAvatar,
  useAdvertiser,
} from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { handleAdNavigation } from '@/utils';
import type { Ad, Advertiser } from '@/types/ad';
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

const getSolutionTabs = (t: (key: string) => string) => [
  { id: 'products', label: t('filterCategory.solutions.products') },
  { id: 'services', label: t('filterCategory.solutions.services') },
  { id: 'programs', label: t('filterCategory.solutions.programs') },
  { id: 'professionals', label: t('filterCategory.solutions.professionals') },
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
  const rootNavigation = navigation.getParent() ?? navigation;
  const userAvatarUri = useUserAvatar();
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [selectedSolutionTab, setSelectedSolutionTab] = useState<string>('products');
  const selectedCategory = selectedSolutionTab === 'professionals' ? CATEGORY_SPECIALISTS : selectedSolutionTab;
  const [selectedCategoryName, setSelectedCategoryName] = useState<CategoryName | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string>(ORDER_BEST_RATED);
  const [page, setPage] = useState(1);
  const [isFilterCategoryModalVisible, setIsFilterCategoryModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<SolutionId[]>([]);

  const { categories } = useCategories({ enabled: true });
  const { getCategoryName } = useCategoryDisplayLabel();
  const { advertisers: professionals } = useAdvertiser({
    listOptions: { status: 'active', limit: 50 },
  });

  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);
  const solutionTabs = useMemo(() => getSolutionTabs(t), [t]);
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
    loadAds();
  }, [loadAds, selectedCategory, selectedCategoryId, page, appliedSearchQuery]);

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
        <FilterMenu
          filterButtonLabel={categoryFilterButtonLabel}
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
    return [...ads].sort((a, b) => {
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
  }, [ads, selectedOrder]);

  const filteredAdsBySolution = useMemo(() => {
    return sortedAds.filter((ad) => {
      const product = ad.product;
      const type = (product?.type ?? '').toLowerCase();
      const hasProduct = !!product;

      switch (selectedSolutionTab) {
        case 'products':
          return hasProduct && type !== 'program' && type !== 'service';
        case 'services':
          return hasProduct && type === 'service';
        case 'programs':
          return hasProduct && type === 'program';
        case 'professionals':
          return false;
        default:
          return true;
      }
    });
  }, [sortedAds, selectedSolutionTab]);

  const listAdsForCurrentTab = useMemo(
    () => (page === 1 ? filteredAdsBySolution.slice(1) : filteredAdsBySolution),
    [filteredAdsBySolution, page],
  );

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
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackgroundByCategory category={selectedCategoryName} />
      <Header
        showBackButton={false}
        showMenuWithAvatar={true}
        onMenuPress={handleMenuPress}
        userAvatarUri={userAvatarUri}
        showCartButton={true}
        onCartPress={handleCartPress}
      />
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
    </SafeAreaView>
  );
};

export default MarketplaceScreen;
