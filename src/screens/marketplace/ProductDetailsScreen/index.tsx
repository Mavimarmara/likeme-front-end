import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { LogoMini } from '@/assets';
import { ProductsCarousel, type Product } from '@/components/ui/carousel';
import { ProductHeroSection, ProductInfoTabs } from '@/components/marketplace';
import { useProductDetails } from '@/hooks/marketplace';
import { formatPrice } from '@/utils/formatters';
import { mapApiProductToCarouselProduct, mapApiProductToNavigationParams } from '@/utils/mappers/productMapper';
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
    return relatedProducts.map(mapApiProductToCarouselProduct);
  }, [relatedProducts]);

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

  const handleCommunityPreview = () => {
    if (!displayData) return;

    navigation.navigate('CommunityPreview', {
      productId: route.params?.productId,
      productName: displayData.title,
    });
  };

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

  if (!product || !displayData) {
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

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      {renderCustomHeader()}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProductHeroSection
          title={displayData.title}
          image={displayData.image}
          price={displayData.price}
          tags={displayData.tags}
          isOutOfStock={displayData.isOutOfStock}
          onAddToCart={handleAddToCart}
        />
        <View style={styles.content}>
          {renderTabs()}
          <Text style={styles.productTitle}>{displayData.title}</Text>
          <Text style={styles.productDescription}>
            {displayData.description || 'No description available'}
          </Text>
          
          {renderAddToCartButton()}
          {renderInfoSection()}
          {renderUserFeedback()}
          {renderRecommendedProducts()}
        </View>
      </ScrollView>
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

  function renderTabs() {
    return (
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.tabActive]}
          onPress={() => setActiveTab('info')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
            Program info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'preview' && styles.tabActive]}
          onPress={handleCommunityPreview}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'preview' && styles.tabTextActive]}>
            Community preview
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderAddToCartButton() {
    return (
      <TouchableOpacity 
        style={[
          styles.addToCartButton, 
          displayData.isOutOfStock && styles.addToCartButtonDisabled
        ]} 
        onPress={handleAddToCart} 
        activeOpacity={0.8}
        disabled={displayData.isOutOfStock}
      >
        <Text style={styles.addToCartText}>
          {displayData.isOutOfStock ? 'Out of Stock' : 'Add to cart'}
        </Text>
        {!displayData.isOutOfStock && (
          <>
            <Icon name="shopping-cart" size={20} color="#FFFFFF" />
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>5</Text>
              <Icon name="star" size={12} color="#FFB800" />
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  }

  function renderInfoSection() {
    return (
      <>
        <ProductInfoTabs 
          activeTab={activeInfoTab} 
          onTabChange={setActiveInfoTab} 
        />
        {activeInfoTab === 'about' && renderAboutContent()}
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
