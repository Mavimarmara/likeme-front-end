import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui/layout';
import { BackgroundWithGradient, LogoMini } from '@/assets';
import { ProductsCarousel, type Product } from '@/components/ui/carousel';
import { useLogout } from '@/hooks';
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

const RECOMMENDED_PLANS: Product[] = [
  {
    id: '1',
    title: 'Strategies to relax in your day to day',
    price: 30.99,
    tag: 'Curated for you',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    likes: 10,
  },
  {
    id: '2',
    title: 'How to evolve to a deep sleep',
    price: 5.99,
    tag: 'Market based',
    image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=400',
    likes: 10,
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
  const { logout } = useLogout({ navigation });
  const handleLogout = logout;

  const product = route.params?.product || {
    id: route.params?.productId || '1',
    title: 'Mental Health in the Workplace',
    price: '$29.90',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    category: 'Programs',
    tags: ['Programs', 'Stress'],
    description: 'This protocol establishes guidelines to promote a healthy work environment, prevent mental illness, and provide adequate support to those who need it.',
    provider: {
      name: 'Dr. Peter Velasquez',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100',
    },
    rating: 5,
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    console.log('Add to cart:', product.id);
  };

  const handleSeeProvider = () => {
    console.log('See provider:', product.provider?.name);
  };

  const handleProductPress = (recommendedProduct: Product) => {
    navigation.navigate('ProductDetails', {
      productId: recommendedProduct.id,
      product: {
        id: recommendedProduct.id,
        title: recommendedProduct.title,
        price: `R$${recommendedProduct.price.toFixed(2)}`,
        image: recommendedProduct.image,
        category: recommendedProduct.tag,
      },
    });
  };

  const handleProductLike = (recommendedProduct: Product) => {
    console.log('Like product:', recommendedProduct.id);
  };

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
      <Image source={{ uri: product.image }} style={styles.heroImage} />
      <View style={styles.heroProductCard}>
        <View style={styles.heroCardTags}>
          {product.tags?.map((tag, index) => (
            <View key={index} style={styles.heroCardTag}>
              <Text style={styles.heroCardTagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.heroCardTitle}>{product.title}</Text>
        <View style={styles.heroCardPriceRow}>
          <Text style={styles.heroCardPrice}>{product.price}</Text>
          <TouchableOpacity style={styles.heroCardCartButton} onPress={handleAddToCart} activeOpacity={0.7}>
            <Icon name="shopping-cart" size={20} color="#001137" />
          </TouchableOpacity>
        </View>
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
      <Text style={styles.aboutItem}>• Promote an organizational culture that values mental health.</Text>
      <Text style={styles.aboutItem}>• Prevent situations of stress, harassment, and work overload.</Text>
      <Text style={styles.aboutItem}>• Encourage work-life balance.</Text>
      <Text style={styles.aboutItem}>• Ensure psychological support and appropriate guidance for employees.</Text>
    </View>
  );

  const renderVideoSection = () => (
    <View style={styles.videoSection}>
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800' }}
          style={styles.videoThumbnail}
        />
        <TouchableOpacity style={styles.playButton} activeOpacity={0.7}>
          <Icon name="play-arrow" size={40} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton} activeOpacity={0.7}>
          <Text style={styles.downloadButtonText}>Download</Text>
          <Icon name="download" size={16} color="#001137" />
        </TouchableOpacity>
        <View style={styles.videoOverlay}>
          <Text style={styles.videoTitle}>RELAXING MOMENT</Text>
          <Text style={styles.videoDuration}>3 minutes video</Text>
        </View>
      </View>
      <View style={styles.videoPagination}>
        <View style={[styles.videoDot, styles.videoDotActive]} />
        <View style={styles.videoDot} />
        <View style={styles.videoDot} />
      </View>
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

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={BackgroundWithGradient}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {renderCustomHeader()}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderHeroSection()}
        <View style={styles.content}>
          {renderTabs()}
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart} activeOpacity={0.8}>
            <Image source={{ uri: product.provider?.avatar }} style={styles.providerAvatarSmall} />
            <Text style={styles.addToCartText}>Add to cart</Text>
            <Icon name="shopping-cart" size={20} color="#FFFFFF" />
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>5</Text>
              <Icon name="star" size={12} color="#FFB800" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.providerButton} onPress={handleSeeProvider} activeOpacity={0.8}>
            <Text style={styles.providerButtonText}>See provider profile {'>'}</Text>
          </TouchableOpacity>

          {renderVideoSection()}
          {renderInfoTabs()}
          {activeInfoTab === 'about' && renderAboutContent()}
          {renderUserFeedback()}

          <View style={styles.recommendedSection}>
            <ProductsCarousel
              title="Plans for you based on the evolution of your markers"
              subtitle="Discover our options selected just for you"
              products={RECOMMENDED_PLANS}
              onProductPress={handleProductPress}
              onProductLike={handleProductLike}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;
