import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from '@/components/ui/inputs';
import { FloatingMenu } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { storageService } from '@/services';
import { formatPrice } from '@/utils/formatters';
import { handleAdNavigation } from '@/utils/navigation/productNavigation';
import { mapProductToCartItem } from '@/utils/mappers/cartMapper';
import { WeekHighlightCard } from '@/components/sections/marketplace';
import { useMarketplaceAds } from '@/hooks/marketplace';
import type { Ad } from '@/types/ad';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';
import { logger } from '@/utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'marker', label: 'Marker', hasDropdown: true },
  { id: 'all', label: 'All' },
  { id: 'products', label: 'Products' },
  { id: 'specialists', label: 'Specialists' },
] as const;

const ORDER_FILTERS = [
  { id: 'order', label: 'Order by', hasDropdown: true },
  { id: 'best-rated', label: 'Best rated' },
  { id: 'above-100', label: 'Above $100' },
] as const;

type MarketplaceScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Marketplace'>;
};

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string>('best-rated');
  const [page, setPage] = useState(1);

  const rootNavigation = navigation.getParent() ?? navigation;
  
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


  const menuItems = useMemo(
    () => [
      {
        id: 'activities',
        icon: 'fitness-center',
        label: 'Atividades',
        fullLabel: 'Atividades',
        onPress: () => rootNavigation.navigate('Activities' as never),
      },
      {
        id: 'marketplace',
        icon: 'store',
        label: 'Marketplace',
        fullLabel: 'Marketplace',
        onPress: () => rootNavigation.navigate('Marketplace' as never),
      },
      {
        id: 'community',
        icon: 'group',
        label: 'Comunidade',
        fullLabel: 'Comunidade',
        onPress: () => rootNavigation.navigate('Community' as never),
      },
      {
        id: 'profile',
        icon: 'person',
        label: 'Perfil',
        fullLabel: 'Perfil',
        onPress: () => rootNavigation.navigate('Profile' as never),
      },
    ],
    [rootNavigation]
  );

  const renderCustomHeader = () => (
    <View style={styles.customHeader}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearchPress={() => {
            setPage(1);
            loadAds();
          }}
          showFilterButton={true}
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      >
        {CATEGORIES.map((category) => {
          const isSelected = category.id === selectedCategory;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryPill,
                isSelected && styles.categoryPillSelected,
              ]}
              onPress={() => {
                setSelectedCategory(category.id);
                setPage(1);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                ]}
              >
                {category.label}
              </Text>
              {(category.id === 'marker') && (
                <Icon name="arrow-drop-down" size={20} color={isSelected ? '#fff' : '#000'} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderWeekHighlights = () => {
    const highlight = ads[0];
    if (!highlight?.product) {
      return null;
    }

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Week highlights</Text>
        <WeekHighlightCard
          title={highlight.product.name || 'Product'}
          image={highlight.product.image || 'https://via.placeholder.com/400'}
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
          <Text style={styles.loadingText}>Loading ads...</Text>
        </View>
      );
    }

    // Se é página 1 e há ads, remove o primeiro (usado no highlight)
    // Caso contrário, mostra todos os ads
    const displayAds = page === 1 && ads.length > 0 ? ads.slice(1) : ads;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All products</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.orderFiltersList}
        >
          {ORDER_FILTERS.map((filter) => {
            const isSelected = filter.id === selectedOrder;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.orderFilterPill,
                  isSelected && styles.orderFilterPillSelected,
                ]}
                onPress={() => setSelectedOrder(filter.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.orderFilterText,
                    isSelected && styles.orderFilterTextSelected,
                  ]}
                >
                  {filter.label}
                </Text>
                {(filter.id === 'order') && (
                  <Icon name="arrow-drop-down" size={20} color={isSelected ? '#fff' : '#000'} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.productsList}>
          {displayAds.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No ads found</Text>
            </View>
          ) : (
            displayAds.map((ad) => {
              const product = ad.product;
              const displayTitle = product?.name || 'Product';
              const displayImage = product?.image || 'https://via.placeholder.com/200';
              const displayCategory = product?.category;
              const productPrice = product?.price;

              return (
                <TouchableOpacity
                  key={ad.id}
                  style={styles.productRow}
                  onPress={() => handleAdPress(ad)}
                  activeOpacity={0.8}
                >
                  <Image 
                    source={{ uri: displayImage }} 
                    style={styles.productRowImage} 
                  />
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
                        <Text style={styles.outOfStockText}>Out of stock</Text>
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
                setPage(prev => prev + 1);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.loadMoreText}>Load more</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header 
        showBackButton={false} 
        showCartButton={true}
        onCartPress={handleCartPress}
      />
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
