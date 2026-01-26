import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from '@/components/ui/inputs';
import { FloatingMenu, FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { storageService } from '@/services';
import { formatPrice, handleAdNavigation, mapProductToCartItem } from '@/utils';
import { WeekHighlightCard } from '@/components/sections/marketplace';
import { useMarketplaceAds, useMenuItems } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import type { Ad } from '@/types/ad';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';
import { logger } from '@/utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getCategoryOptions = (t: (key: string) => string): ButtonCarouselOption<string>[] => [
  { id: 'all', label: t('marketplace.allCategory') },
  { id: 'products', label: t('marketplace.productsCategory') },
  { id: 'specialists', label: t('marketplace.specialistsCategory') },
];

const getOrderOptions = (t: (key: string) => string): ButtonCarouselOption<string>[] => [
  { id: 'best-rated', label: t('marketplace.bestRated') },
  { id: 'above-100', label: t('marketplace.above100') },
];

type MarketplaceScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Marketplace'>;
};

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string>('best-rated');
  const [page, setPage] = useState(1);
  
  const categoryOptions = useMemo(() => getCategoryOptions(t), [t]);
  const orderOptions = useMemo(() => getOrderOptions(t), [t]);

  const { ads, loading, hasMore, loadAds } = useMarketplaceAds({
    selectedCategory,
    page,
  });

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setPage(1);
      loadAds();
    });

    loadAds();

    return unsubscribe;
  }, [navigation, selectedCategory, page, loadAds]);

  const handleAdPress = (ad: Ad) => {
    handleAdNavigation(ad, navigation);
  };

  const handleAddToCart = async (ad: Ad, event?: any) => {
    if (event) {
      event.stopPropagation();
    }

    if (!ad.product) {
      return;
    }

    try {
      const cartItem = mapProductToCartItem(ad.product);
      await storageService.addToCart(cartItem);
      navigation.navigate('Cart');
    } catch (error) {
      // Error handling
    }
  };

  const menuItems = useMenuItems(navigation);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orderId);
  };

  const renderCustomHeader = () => (
    <View style={styles.customHeader}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={t('marketplace.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearchPress={() => {
            setPage(1);
            loadAds();
          }}
          showFilterButton={true}
        />
      </View>
      <View style={styles.filterMenuContainer}>
        <FilterMenu
          filterButtonLabel={t('marketplace.marker')}
          onFilterButtonPress={() => {
            // TODO: Implementar modal de marker se necessário
            console.log('Marker button pressed');
          }}
          carouselOptions={categoryOptions}
          selectedCarouselId={selectedCategory}
          onCarouselSelect={handleCategorySelect}
        />
      </View>
    </View>
  );

  const renderWeekHighlights = () => {
    const highlight = ads[0];
    if (!highlight?.product) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('marketplace.weekHighlights')}</Text>
        <WeekHighlightCard
          title={highlight.product.name || t('marketplace.product')}
          image={
            highlight.product.image ||
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'
          }
          price={highlight.product.price}
          onPress={() => handleAdPress(highlight)}
        />
      </View>
    );
  };

  const renderAllAds = () => {
    if (loading && page === 1) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>{t('marketplace.loadingAds')}</Text>
        </View>
      );
    }

    // Se é página 1 e há ads, remove o primeiro (usado no highlight)
    // Caso contrário, mostra todos os ads
    const displayAds = page === 1 && ads.length > 0 ? ads.slice(1) : ads;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('marketplace.allProducts')}</Text>
        </View>
        <View style={styles.orderFilterMenuContainer}>
          <FilterMenu
            filterButtonLabel={t('marketplace.orderBy')}
            onFilterButtonPress={() => {
              // TODO: Implementar modal de order se necessário
              console.log('Order by button pressed');
            }}
            carouselOptions={orderOptions}
            selectedCarouselId={selectedOrder}
            onCarouselSelect={handleOrderSelect}
          />
        </View>
        <View style={styles.productsList}>
          {displayAds.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('marketplace.noAdsFound')}</Text>
            </View>
          ) : (
            displayAds.map((ad) => {
              const product = ad.product;
              const displayTitle = product?.name || t('marketplace.product');
              const displayImage =
                product?.image ||
                'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';
              const displayCategory = product?.category;
              const productPrice = product?.price;

              return (
                <TouchableOpacity
                  key={ad.id}
                  style={styles.productRow}
                  onPress={() => handleAdPress(ad)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: displayImage }} style={styles.productRowImage} />
                  <View style={styles.productRowContent}>
                    {displayCategory && (
                      <View style={styles.productRowCategory}>
                        <Text style={styles.productRowCategoryText}>{displayCategory}</Text>
                      </View>
                    )}
                    <Text style={styles.productRowTitle}>{displayTitle}</Text>
                    <View style={styles.productRowFooter}>
                      {productPrice !== undefined && (
                        <Text style={styles.productRowPrice}>{formatPrice(productPrice)}</Text>
                      )}
                      {product && product.status === 'out_of_stock' && (
                        <Text style={styles.outOfStockText}>{t('marketplace.outOfStock')}</Text>
                      )}
                    </View>
                  </View>
                  {product && !product.externalUrl && (
                    <TouchableOpacity
                      style={styles.productRowAddButton}
                      activeOpacity={0.7}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(ad, e);
                      }}
                    >
                      <Icon name="add" size={24} color="#000" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              );
            })
          )}
          {loading && page > 1 && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#2196F3" />
            </View>
          )}
          {hasMore && !loading && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={() => {
                setPage((prev) => prev + 1);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.loadMoreText}>{t('marketplace.loadMore')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header showBackButton={false} showCartButton={true} onCartPress={handleCartPress} />
      <View style={styles.content}>
        {renderCustomHeader()}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderWeekHighlights()}
          {renderAllAds()}
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId="marketplace" />
    </SafeAreaView>
  );
};

export default MarketplaceScreen;
