import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from '@/components/ui/inputs';
import { FloatingMenu } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { productService } from '@/services';
import type { Product as ApiProduct } from '@/types/product';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

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
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const rootNavigation = navigation.getParent() ?? navigation;
  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory, page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 20,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      const response = await productService.listProducts(params);
      
      if (response.success && response.data) {
        if (page === 1) {
          setProducts(response.data.products);
        } else {
          setProducts(prev => [...prev, ...response.data.products]);
        }
        setHasMore(response.data.pagination.page < response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: ApiProduct) => {
    navigation.navigate('ProductDetails', {
      productId: product.id,
      product: {
        id: product.id,
        title: product.name,
        price: `$${Number(product.price).toFixed(2)}`,
        image: product.image || 'https://via.placeholder.com/400',
        category: product.category,
        description: product.description,
        tags: product.category ? [product.category] : [],
      },
    });
  };

  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null || isNaN(Number(price))) {
      return '$0.00';
    }
    // Garante que o preço seja formatado com 2 casas decimais
    const numPrice = typeof price === 'number' ? price : parseFloat(String(price)) || 0;
    return `$${numPrice.toFixed(2)}`;
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
            loadProducts();
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
              {category.hasDropdown && (
                <Icon name="arrow-drop-down" size={20} color={isSelected ? '#fff' : '#000'} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderWeekHighlights = () => {
    const highlight = products[0];
    if (!highlight) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Week highlights</Text>
        <TouchableOpacity
          style={styles.weekHighlightCard}
          onPress={() => handleProductPress(highlight)}
          activeOpacity={0.9}
        >
          <Image 
            source={{ uri: highlight.image || 'https://via.placeholder.com/400' }} 
            style={styles.weekHighlightImage} 
          />
          <View style={styles.weekHighlightBadge}>
            <Text style={styles.weekHighlightBadgeText}>Featured</Text>
          </View>
          <View style={styles.weekHighlightContent}>
            <Text style={styles.weekHighlightTitle}>{highlight.name}</Text>
            <Text style={styles.weekHighlightPrice}>{formatPrice(highlight.price)}</Text>
            <TouchableOpacity 
              style={styles.weekHighlightCartButton} 
              onPress={() => navigation.navigate('Cart')}
              activeOpacity={0.7}
            >
              <Icon name="shopping-cart" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.pagination}>
            <View style={[styles.paginationDot, styles.paginationDotActive]} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAllProducts = () => {
    if (loading && page === 1) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    const displayProducts = page === 1 ? products.slice(1) : products;

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
                {filter.hasDropdown && (
                  <Icon name="arrow-drop-down" size={20} color={isSelected ? '#fff' : '#000'} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.productsList}>
          {displayProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          ) : (
            displayProducts.map((product) => {
              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productRow}
                  onPress={() => handleProductPress(product)}
                  activeOpacity={0.8}
                >
                  <Image 
                    source={{ uri: product.image || 'https://via.placeholder.com/200' }} 
                    style={styles.productRowImage} 
                  />
                  <View style={styles.productRowContent}>
                    {product.category && (
                      <View style={styles.productRowCategory}>
                        <Text style={styles.productRowCategoryText}>{product.category}</Text>
                      </View>
                    )}
                    <Text style={styles.productRowTitle}>{product.name}</Text>
                    <View style={styles.productRowFooter}>
                      <Text style={styles.productRowPrice}>{formatPrice(product.price)}</Text>
                      {product.status === 'out_of_stock' && (
                        <Text style={styles.outOfStockText}>Out of stock</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity style={styles.productRowAddButton} activeOpacity={0.7}>
                    <Icon name="add" size={24} color="#000" />
                  </TouchableOpacity>
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
          {renderAllProducts()}
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId="marketplace" />
    </SafeAreaView>
  );
};

export default MarketplaceScreen;
