import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from '@/components/ui/inputs';
import { FloatingMenu } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { adService, storageService } from '@/services';
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
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const rootNavigation = navigation.getParent() ?? navigation;
  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const loadAds = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 20,
        // Temporariamente removendo activeOnly para testar se há ads no banco
        // activeOnly: true,
      };

      // Mapear categoria da UI para categoria do anúncio
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'products') {
          params.category = 'physical product';
        } else if (selectedCategory === 'programs') {
          params.category = 'program';
        }
      }

      console.error('[MarketplaceScreen] Loading ads with params:', JSON.stringify(params, null, 2));
      const response = await adService.listAds(params);
      console.error('[MarketplaceScreen] Ads response:', JSON.stringify({
        success: response.success,
        hasData: !!response.data,
        adsCount: response.data?.ads?.length || 0,
        pagination: response.data?.pagination,
        firstAd: response.data?.ads?.[0] || null,
      }, null, 2));
      
      // Log detalhado da resposta completa
      console.error('[MarketplaceScreen] Full response:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        const adsArray = response.data.ads || [];
        console.error('[MarketplaceScreen] Setting ads:', adsArray.length);
        
        if (page === 1) {
          setAds(adsArray);
        } else {
          setAds(prev => [...prev, ...adsArray]);
        }
        
        const pagination = response.data.pagination;
        if (pagination) {
          setHasMore(pagination.page < pagination.totalPages);
        } else {
          setHasMore(adsArray.length >= (params.limit || 20));
        }
      } else {
        console.warn('[MarketplaceScreen] Response not successful or missing data:', response);
        if (page === 1) {
          setAds([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error('[MarketplaceScreen] Error loading ads:', error);
      console.error('[MarketplaceScreen] Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      if (page === 1) {
        setAds([]);
      }
      setHasMore(false);
    } finally {
      console.log('[MarketplaceScreen] loadAds finished, setting loading to false');
      setLoading(false);
    }
  }, [selectedCategory, page]);

  // Carregar ads quando a tela recebe foco ou quando category/page mudam
  useEffect(() => {
    console.error('[MarketplaceScreen] useEffect triggered', { selectedCategory, page });
    console.error('[MarketplaceScreen] loadAds function exists:', typeof loadAds === 'function');
    
    // Listener para quando a tela recebe foco (para atualizar quando voltar de outra tela)
    const unsubscribe = navigation.addListener('focus', () => {
      console.error('[MarketplaceScreen] Screen focused, reloading ads');
      setPage(1);
      // Recarrega quando a tela recebe foco
      if (typeof loadAds === 'function') {
        loadAds();
      }
    });

    // Chama loadAds na primeira renderização e quando category/page mudam
    console.error('[MarketplaceScreen] Calling loadAds from useEffect');
    if (typeof loadAds === 'function') {
      loadAds();
    } else {
      console.error('[MarketplaceScreen] ERROR: loadAds is not a function!');
    }

    return unsubscribe;
  }, [navigation, selectedCategory, page, loadAds]);

  const handleAdPress = (ad: Ad) => {
    console.log('handleAdPress called with ad:', {
      id: ad.id,
      productId: ad.productId,
      hasProduct: !!ad.product,
      productCategory: ad.product?.category,
    });

    // Se for amazon product, verificar apenas em ad.product
    const isAmazonProduct = ad.product?.category === 'amazon product';
    
    if (isAmazonProduct) {
      console.log('Amazon product detected, navigating to AffiliateProduct');
      if (ad.product) {
        // Usa productId do produto ou ad.id como fallback
        const productId = ad.productId || ad.product.id;
        navigation.navigate('AffiliateProduct', {
          productId: productId,
          adId: ad.id,
          product: {
            id: ad.product.id,
            title: ad.product.name,
            price: `$${Number(ad.product.price).toFixed(2)}`,
            image: ad.product.image || 'https://via.placeholder.com/400',
            category: ad.product.category,
            description: ad.product.description,
          },
        });
      } else if (ad.productId) {
        // Se tem productId mas não tem product carregado, ainda navegar
        navigation.navigate('AffiliateProduct', {
          productId: ad.productId,
          adId: ad.id,
        });
      } else {
        // Sem productId e sem product, não é possível navegar
        console.warn('Amazon product ad has no productId and no product data, cannot navigate');
      }
      return;
    }

    // Se tem externalUrl, abrir link externo
    if (ad.externalUrl) {
      // Em React Native, você precisaria usar Linking para abrir URLs externas
      console.log('Open external URL:', ad.externalUrl);
      // Linking.openURL(ad.externalUrl);
      return;
    }

    // Se tem produto relacionado, navegar para ProductDetails normal
    if (ad.productId && ad.product) {
      navigation.navigate('ProductDetails', {
        productId: ad.productId,
        product: {
          id: ad.product.id,
          title: ad.product.name,
          price: `$${Number(ad.product.price).toFixed(2)}`,
          image: ad.product.image || 'https://via.placeholder.com/400',
          category: ad.product.category,
          description: ad.product.description,
          tags: ad.product.category ? [ad.product.category] : [],
        },
      });
    } else {
      console.warn('Ad has no productId or product, cannot navigate');
    }
  };

  const handleAddToCart = async (ad: Ad, event?: any) => {
    if (event) {
      event.stopPropagation();
    }
    
    // Só pode adicionar ao carrinho se tiver produto relacionado
    if (!ad.product) {
      console.warn('Ad has no related product to add to cart');
      return;
    }

    try {
      const product = ad.product;
      const price = Number(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
      
      const cartItem = {
        id: product.id,
        image: product.image || 'https://via.placeholder.com/200',
        title: product.name,
        subtitle: product.description,
        price: price,
        quantity: 1,
        rating: 5,
        tags: product.category ? [product.category] : [],
        category: 'Product' as const,
        subCategory: product.category || 'Product',
      };

      await storageService.addToCart(cartItem);
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
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
    if (!highlight) {
      console.log('[MarketplaceScreen] No highlight ad available');
      return null;
    }

    const productPrice = highlight.product?.price || 0;
    const displayTitle = highlight.product?.name || highlight.title || 'Product';
    const displayImage = highlight.product?.image || highlight.image || 'https://via.placeholder.com/400';

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Week highlights</Text>
        <TouchableOpacity
          style={styles.weekHighlightCard}
          onPress={() => handleAdPress(highlight)}
          activeOpacity={0.9}
        >
          <Image 
            source={{ uri: displayImage }} 
            style={styles.weekHighlightImage} 
          />
          <View style={styles.weekHighlightBadge}>
            <Text style={styles.weekHighlightBadgeText}>Featured</Text>
          </View>
          <View style={styles.weekHighlightContent}>
            <Text style={styles.weekHighlightTitle}>{displayTitle}</Text>
            {highlight.product && (
              <Text style={styles.weekHighlightPrice}>{formatPrice(productPrice)}</Text>
            )}
            {highlight.product && (
              <TouchableOpacity 
                style={styles.weekHighlightCartButton} 
                onPress={(e) => {
                  e.stopPropagation();
                  handleAddToCart(highlight);
                }}
                activeOpacity={0.7}
              >
                <Icon name="shopping-cart" size={20} color="#000" />
              </TouchableOpacity>
            )}
            {highlight.externalUrl && (
              <TouchableOpacity 
                style={styles.weekHighlightCartButton} 
                onPress={(e) => {
                  e.stopPropagation();
                  handleAdPress(highlight);
                }}
                activeOpacity={0.7}
              >
                <Icon name="open-in-new" size={20} color="#000" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.pagination}>
            <View style={[styles.paginationDot, styles.paginationDotActive]} />
          </View>
        </TouchableOpacity>
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
              const displayTitle = product?.name || ad.title || 'Product';
              const displayImage = product?.image || ad.image || 'https://via.placeholder.com/200';
              const displayCategory = product?.category || ad.category;
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
                      {ad.externalUrl && (
                        <Text style={styles.externalLinkText}>External link</Text>
                      )}
                    </View>
                  </View>
                  {product && (
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
                  {ad.externalUrl && !product && (
                    <TouchableOpacity 
                      style={styles.productRowAddButton} 
                      activeOpacity={0.7}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAdPress(ad);
                      }}
                    >
                      <Icon name="open-in-new" size={24} color="#000" />
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
