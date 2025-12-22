import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui/layout';
import { Toggle } from '@/components/ui';
import { LogoMini } from '@/assets';
import { ProductsCarousel, type Product } from '@/components/sections/product';
import { PostCard } from '@/components/sections/community';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { useProductDetails } from '@/hooks/marketplace';
import { formatPrice } from '@/utils/formatters';
import { mapApiProductToCarouselProduct, mapApiProductToNavigationParams } from '@/utils/mappers/productMapper';
import { useUserFeed } from '@/hooks/community/useUserFeed';
import type { Post } from '@/types';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

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

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'preview'>('info');
  const [activeInfoTab, setActiveInfoTab] = useState<'about' | 'objectives' | 'communities'>('about');
  
  const {
    product,
    ad,
    relatedProducts,
    loading,
    isFavorite,
    setIsFavorite,
    handleAddToCart,
    loadAd,
  } = useProductDetails({
    productId: route.params?.productId,
    fallbackProduct: route.params?.product,
    navigation,
  });

  const displayData = useMemo(() => {
    if (!product) {
      return null;
    }

    return {
      title: ad?.product?.name || product.name,
      description: ad?.product?.description || product.description,
      image: ad?.product?.image || product.image,
      price: product.price,
      tags: product.category ? [product.category] : [],
      isOutOfStock: product.status === 'out_of_stock' || product.quantity === 0,
    };
  }, [product, ad]);

  const recommendedProducts: Product[] = useMemo(() => {
    if (!relatedProducts || !Array.isArray(relatedProducts)) {
      return [];
    }
    return relatedProducts.map(mapApiProductToCarouselProduct);
  }, [relatedProducts]);

  const infoTabOptions: ButtonCarouselOption<'about' | 'objectives' | 'communities'>[] = useMemo(() => [
    { id: 'about', label: 'About' },
    { id: 'objectives', label: 'Objectives' },
    { id: 'communities', label: 'Communities' },
  ], []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSeeProvider = () => {
    const provider = route.params?.product?.provider;
    if (!provider) return;

    navigation.navigate('ProviderProfile', {
      providerId: route.params?.productId,
      provider: {
        name: provider.name,
        avatar: provider.avatar,
        title: 'Therapist & Wellness Coach',
        description: 'Specialized in mental health and wellness coaching with over 10 years of experience.',
        rating: route.params?.product?.rating || 4.8,
        specialties: ['Mental Health', 'Wellness Coaching', 'Therapy'],
      },
    });
  };

  // Carregar posts quando a aba preview estiver ativa
  const {
    posts: communityPosts,
    loading: loadingPosts,
    loadPosts: loadCommunityPosts,
  } = useUserFeed({
    enabled: false, // Não carregar automaticamente
    pageSize: 10,
  });

  useEffect(() => {
    if (activeTab === 'preview') {
      loadCommunityPosts(1);
    }
  }, [activeTab, loadCommunityPosts]);

  const handleProductPress = (recommendedProduct: Product) => {
    const relatedProduct = relatedProducts.find(rp => rp.id === recommendedProduct.id);
    if (!relatedProduct) return;

    navigation.navigate('ProductDetails', {
      productId: relatedProduct.id,
      product: mapApiProductToNavigationParams(relatedProduct),
    });
  };

  const handleProductLike = (recommendedProduct: Product) => {
    console.log('Like product:', recommendedProduct.id);
  };

  // Obter imagem do produto para o background e hero section
  const backgroundImage = useMemo(() => {
    if (displayData?.image) return displayData.image;
    if (ad?.product?.image) return ad.product.image;
    if (product?.image) return product.image;
    if (route.params?.product?.image) return route.params.product.image;
    return 'https://via.placeholder.com/400';
  }, [displayData, ad, product, route.params?.product]);

  // Array de imagens do produto (por enquanto apenas uma)
  const productImages = useMemo(() => {
    const images: string[] = [];
    if (backgroundImage && backgroundImage !== 'https://via.placeholder.com/400') {
      images.push(backgroundImage);
    }
    return images;
  }, [backgroundImage]);

  // Categoria do produto para badges
  const productCategory = displayData?.tags?.[0] || product?.category || route.params?.product?.category || 'Product';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Loading product...</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  if (!product || !displayData) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={{ uri: backgroundImage }}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Product not found</Text>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Text>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <Header showBackButton={true} onBackPress={handleBackPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Image */}
        <View style={styles.heroSection}>
          <ImageBackground source={{ uri: backgroundImage }} style={styles.heroImage} imageStyle={styles.heroImageStyle}>
            <View style={styles.heroOverlay}>
              <LinearGradient
                colors={['rgba(48, 48, 48, 0)', 'rgba(41, 41, 41, 1)']}
                locations={[0.64, 1]}
                style={styles.heroGradient}
              />
              <View style={styles.heroContent}>
                <View style={styles.badgesContainer}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Product</Text>
                  </View>
                  {productCategory && productCategory !== 'Product' && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{productCategory}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.heroTitle}>{displayData.title}</Text>
                {displayData.price && (
                  <Text style={styles.heroPrice}>{formatPrice(displayData.price)}</Text>
                )}
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Pagination Dots - Mostrar apenas se houver mais de uma imagem */}
        {productImages && productImages.length > 1 && (
          <View style={styles.paginationContainer}>
            {productImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === 0 && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.tabsContainer}>
            <Toggle
              options={['Program info', 'Community preview'] as const}
              selected={activeTab === 'info' ? 'Program info' : 'Community preview'}
              onSelect={(option) => {
                if (option === 'Program info') {
                  setActiveTab('info');
                } else {
                  setActiveTab('preview');
                }
              }}
            />
          </View>
          {activeTab === 'info' && (
            <>
              <Text style={styles.productDescription}>
                {displayData.description || 'No description available'}
              </Text>
              {renderInfoSection()}
              {renderUserFeedback()}
              {renderRecommendedProducts()}
            </>
          )}
          
          {activeTab === 'preview' && (
            <View style={styles.communityPreviewContainer}>
              {loadingPosts ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#001137" />
                </View>
              ) : !communityPosts || communityPosts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No community posts found</Text>
                </View>
              ) : (
                communityPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
      </ImageBackground>
      {renderAddToCartButton()}
    </SafeAreaView>
  );

  function renderCustomHeader() {
    return (
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress} 
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#001137" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <LogoMini width={87} height={16} />
        </View>
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => setIsFavorite(!isFavorite)} 
          activeOpacity={0.7}
        >
          <Icon 
            name={isFavorite ? 'star' : 'star-border'} 
            size={24} 
            color="#001137" 
          />
        </TouchableOpacity>
      </View>
    );
  }


  function renderAddToCartButton() {
    if (displayData.isOutOfStock) {
      return null;
    }

    return (
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={styles.floatingAddToCartButton}
          onPress={handleAddToCart} 
          activeOpacity={0.8}
        >
          <Text style={styles.floatingAddToCartText}>Add to cart</Text>
          <View style={styles.floatingCartIconContainer}>
            <Icon name="shopping-cart" size={20} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  function renderInfoSection() {
    return (
      <>
        <ButtonCarousel
          options={infoTabOptions}
          selectedId={activeInfoTab}
          onSelect={setActiveInfoTab}
        />
        {renderAboutContent()}
      </>
    );
  }

  function renderAboutContent() {
    return (
      <View style={styles.aboutContent}>
        {product.description ? (
          <Text style={styles.productDescription}>{product.description}</Text>
        ) : (
          <>
            <Text style={styles.aboutItem}>
              • Product information will be displayed here
            </Text>
            <Text style={styles.aboutItem}>
              • Additional details about the product
            </Text>
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
        {route.params?.product?.provider && (
          <TouchableOpacity
            style={styles.providerButton}
            onPress={handleSeeProvider}
            activeOpacity={0.7}
          >
            <Text style={styles.providerButtonText}>See provider profile</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderUserFeedback() {
    return (
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
  }

  function renderRecommendedProducts() {
    if (recommendedProducts.length === 0) {
      return null;
    }

    return (
      <View style={styles.recommendedSection}>
        <ProductsCarousel
          title="Related products"
          subtitle="Discover similar products"
          products={recommendedProducts}
          onProductPress={handleProductPress}
          onProductLike={handleProductLike}
        />
      </View>
    );
  }
};

export default ProductDetailsScreen;
