import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { LogoMini } from '@/assets';
import { ProductsCarousel, type Product } from '@/components/ui/carousel';
import { productService, adService } from '@/services';
import type { Product as ApiProduct } from '@/types/product';
import type { Ad } from '@/types/ad';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const USER_REVIEWS = [
  {
    id: '1',
    userName: 'Caio César',
    comment: 'Helped me a lot',
    date: '20 Jan 2023',
    rating: 5,
  },
  {
    id: '2',
    userName: 'Maria Fernandes',
    comment: 'Really nice!',
    date: '20 Jan 2023',
    rating: 4,
  },
  {
    id: '3',
    userName: 'Carla Junqueira',
    comment: "I'd recommend it to everyone!",
    date: '19 Jan 2023',
    rating: 4,
  },
] as const;

type ProductDetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
  route: {
    params: {
      productId: string;
      product?: {
        id: string;
        title: string;
        price: string;
        image: string;
        category?: string;
        tags?: string[];
        description?: string;
        provider?: {
          name: string;
          avatar: string;
        };
        rating?: number;
      };
    };
  };
};

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'preview'>('info');
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'objectives' | 'communities'>('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [ad, setAd] = useState<Ad | null>(null);
  

  const productId = route.params?.productId;

  useEffect(() => {
    if (productId) {
      loadProduct();
      loadRelatedProducts();
    } else if (route.params?.product) {
      // Use provided product data as fallback
      const fallbackProduct = route.params.product;
      setProduct({
        id: fallbackProduct.id,
        name: fallbackProduct.title,
        description: fallbackProduct.description,
        price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')),
        image: fallbackProduct.image,
        category: fallbackProduct.category,
        quantity: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductById(productId);
      if (response.success && response.data) {
        const productData = response.data;
        
        // Verificar se é produto Amazon e redirecionar
        if (productData.category === 'amazon product') {
          // Buscar ad relacionado
          const adsResponse = await adService.listAds({
            productId: productId,
            activeOnly: true,
            limit: 1,
          });
          
          const adId = adsResponse.success && adsResponse.data && adsResponse.data.ads.length > 0
            ? adsResponse.data.ads[0].id
            : undefined;
          
          navigation.replace('AffiliateProduct', {
            productId: productId,
            adId: adId,
            product: {
              id: productData.id,
              title: productData.name,
              price: `$${Number(productData.price).toFixed(2)}`,
              image: productData.image || 'https://via.placeholder.com/400',
              category: productData.category,
              description: productData.description,
            },
          });
          return;
        }
        
        setProduct(productData);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const response = await productService.listProducts({
        limit: 5,
        category: route.params?.product?.category,
      });
      if (response.success && response.data) {
        setRelatedProducts(response.data.products.filter(p => p.id !== productId));
      }
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  };

  const loadAd = async () => {
    try {
      const response = await adService.listAds({
        productId: productId,
        activeOnly: true,
        limit: 1,
      });
      if (response.success && response.data && response.data.ads.length > 0) {
        const adData = response.data.ads[0];
        // Buscar detalhes completos do ad para incluir advertiser e product
        const adDetailResponse = await adService.getAdById(adData.id);
        if (adDetailResponse.success && adDetailResponse.data) {
          setAd(adDetailResponse.data);
        } else {
          setAd(adData);
        }
      }
    } catch (error) {
      console.error('Error loading ad:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.status === 'out_of_stock' || product.quantity === 0) {
      Alert.alert('Out of Stock', 'This product is currently out of stock');
      return;
    }

    try {
      // Adiciona o produto ao carrinho
      // Garante que o preço seja um número válido, preservando a precisão
      const productPrice = typeof product.price === 'number' 
        ? product.price 
        : parseFloat(String(product.price).replace(/[^0-9.-]/g, '')) || 0;
      
      const cartItem = {
        id: product.id,
        image: product.image || 'https://via.placeholder.com/108x140',
        title: product.name,
        subtitle: product.description,
        price: productPrice,
        quantity: 1,
        rating: 5, // Default rating
        tags: product.category ? [product.category] : [],
        category: product.category || 'Product',
        subCategory: product.category || 'Product',
      };
      
      // Importa o storageService dinamicamente para evitar dependência circular
      const storageService = require('@/services/auth/storageService').default;
      await storageService.addToCart(cartItem);
      
      // Navega para o carrinho após adicionar o produto
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add product to cart');
    }
  };

  const handleSeeProvider = () => {
    console.log('See provider');
  };

  const handleProductPress = (recommendedProduct: ApiProduct) => {
    navigation.navigate('ProductDetails', {
      productId: recommendedProduct.id,
      product: {
        id: recommendedProduct.id,
        title: recommendedProduct.name,
        price: `$${Number(recommendedProduct.price).toFixed(2)}`,
        image: recommendedProduct.image || 'https://via.placeholder.com/400',
        category: recommendedProduct.category,
        description: recommendedProduct.description,
      },
    });
  };

  const handleProductLike = (recommendedProduct: Product) => {
    console.log('Like product:', recommendedProduct.id);
  };

  const formatPrice = (price: number | undefined | null) => {
    if (price === undefined || price === null || isNaN(Number(price))) {
      return '$0.00';
    }
    // Garante que o preço seja formatado com 2 casas decimais
    const numPrice = typeof price === 'number' ? price : parseFloat(String(price)) || 0;
    return `$${numPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Background />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Background />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Product not found</Text>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Prioriza dados do ad quando disponível, senão usa dados do produto
  const displayTitle = ad?.title || product.name;
  const displayDescription = ad?.description || product.description;
  const displayImage = ad?.image || product.image;
  const displayPrice = product.price; // Preço sempre vem do produto
  
  const productTags = product.category ? [product.category] : [];
  const isOutOfStock = product.status === 'out_of_stock' || product.quantity === 0;

  const renderCustomHeader = () => (
    <View style={styles.customHeader}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
        <Icon name="arrow-back" size={24} color="#001137" />
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <LogoMini width={87} height={16} />
      </View>
      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress} activeOpacity={0.7}>
        <Icon name={isFavorite ? 'star' : 'star-border'} size={24} color="#001137" />
      </TouchableOpacity>
    </View>
  );

  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <Image 
        source={{ uri: displayImage || 'https://via.placeholder.com/800' }} 
        style={styles.heroImage} 
      />
      <View style={styles.heroProductCard}>
        <View style={styles.heroCardTags}>
          {productTags.map((tag, index) => (
            <View key={index} style={styles.heroCardTag}>
              <Text style={styles.heroCardTagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.heroCardTitle}>{displayTitle}</Text>
        <View style={styles.heroCardPriceRow}>
          <Text style={styles.heroCardPrice}>{formatPrice(product.price)}</Text>
          {!isOutOfStock && (
            <TouchableOpacity style={styles.heroCardCartButton} onPress={handleAddToCart} activeOpacity={0.7}>
              <Icon name="shopping-cart" size={20} color="#001137" />
            </TouchableOpacity>
          )}
        </View>
        {isOutOfStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'info' && styles.tabActive]}
        onPress={() => setActiveTab('info')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>Program info</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'preview' && styles.tabActive]}
        onPress={() => setActiveTab('preview')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'preview' && styles.tabTextActive]}>Community preview</Text>
      </TouchableOpacity>
    </View>
  );

  const renderInfoTabs = () => (
    <View style={styles.infoTabsContainer}>
      <TouchableOpacity
        style={[styles.infoTab, activeInfoTab === 'about' && styles.infoTabActive]}
        onPress={() => setActiveInfoTab('about')}
        activeOpacity={0.7}
      >
        <Text style={[styles.infoTabText, activeInfoTab === 'about' && styles.infoTabTextActive]}>About</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.infoTab, activeInfoTab === 'objectives' && styles.infoTabActive]}
        onPress={() => setActiveInfoTab('objectives')}
        activeOpacity={0.7}
      >
        <Text style={[styles.infoTabText, activeInfoTab === 'objectives' && styles.infoTabTextActive]}>Objectives</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.infoTab, activeInfoTab === 'communities' && styles.infoTabActive]}
        onPress={() => setActiveInfoTab('communities')}
        activeOpacity={0.7}
      >
        <Text style={[styles.infoTabText, activeInfoTab === 'communities' && styles.infoTabTextActive]}>Communities</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAboutContent = () => (
    <View style={styles.aboutContent}>
      {product.description ? (
        <Text style={styles.productDescription}>{product.description}</Text>
      ) : (
        <>
          <Text style={styles.aboutItem}>• Product information will be displayed here</Text>
          <Text style={styles.aboutItem}>• Additional details about the product</Text>
        </>
      )}
      {product.sku && (
        <Text style={styles.productSku}>SKU: {product.sku}</Text>
      )}
      {product.brand && (
        <Text style={styles.productBrand}>Brand: {product.brand}</Text>
      )}
      {product.weight && (
        <Text style={styles.productWeight}>Weight: {product.weight} kg</Text>
      )}
    </View>
  );

  const renderUserFeedback = () => (
    <View style={styles.feedbackSection}>
      <View style={styles.feedbackHeader}>
        <Text style={styles.feedbackTitle}>User Feedback</Text>
        <View style={styles.feedbackRating}>
          <Text style={styles.feedbackRatingText}>5</Text>
          <Icon name="star" size={16} color="#FFB800" />
        </View>
      </View>
      <View style={styles.reviewsList}>
        {USER_REVIEWS.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <Text style={styles.reviewUserName}>{review.userName}</Text>
            <Text style={styles.reviewComment}>{review.comment}</Text>
            <View style={styles.reviewFooter}>
              <Text style={styles.reviewDate}>{review.date}</Text>
              <View style={styles.reviewRating}>
                <Text style={styles.reviewRatingText}>{review.rating}</Text>
                <Icon name="star" size={14} color="#FFB800" />
              </View>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.seeAllButton} activeOpacity={0.7}>
        <Text style={styles.seeAllText}>See all {'>'}</Text>
      </TouchableOpacity>
    </View>
  );

  const recommendedProductsCarousel: Product[] = relatedProducts.map(p => ({
    id: p.id,
    title: p.name,
    price: Number(p.price),
    tag: p.category || 'Product',
    image: p.image || 'https://via.placeholder.com/400',
    likes: 0,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      {renderCustomHeader()}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeroSection()}
        <View style={styles.content}>
          {renderTabs()}
          <Text style={styles.productTitle}>{displayTitle}</Text>
          <Text style={styles.productDescription}>{displayDescription || 'No description available'}</Text>
          
          <TouchableOpacity 
            style={[
              styles.addToCartButton, 
              isOutOfStock && styles.addToCartButtonDisabled
            ]} 
            onPress={handleAddToCart} 
            activeOpacity={0.8}
            disabled={isOutOfStock}
          >
            <Text style={styles.addToCartText}>
              {isOutOfStock ? 'Out of Stock' : 'Add to cart'}
            </Text>
            {!isOutOfStock && (
              <>
                <Icon name="shopping-cart" size={20} color="#FFFFFF" />
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingBadgeText}>5</Text>
                  <Icon name="star" size={12} color="#FFB800" />
                </View>
              </>
            )}
          </TouchableOpacity>

          {renderInfoTabs()}
          {activeInfoTab === 'about' && renderAboutContent()}
          {renderUserFeedback()}

          {recommendedProductsCarousel.length > 0 && (
            <View style={styles.recommendedSection}>
              <ProductsCarousel
                title="Related products"
                subtitle="Discover similar products"
                products={recommendedProductsCarousel}
                onProductPress={(p) => {
                  const relatedProduct = relatedProducts.find(rp => rp.id === p.id);
                  if (relatedProduct) {
                    handleProductPress(relatedProduct);
                  }
                }}
                onProductLike={handleProductLike}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;
