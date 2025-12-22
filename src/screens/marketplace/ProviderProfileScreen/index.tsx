import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui/layout';
import { Toggle } from '@/components/ui';
import { SecondaryButton } from '@/components/ui/buttons';
import { PlansCarousel, ProductsCarousel, type Plan, type Product } from '@/components/sections/product';
import { PostCard } from '@/components/sections/community';
import { useUserFeed } from '@/hooks/community/useUserFeed';
import type { Post } from '@/types';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type ProviderProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProviderProfile'>;
  route: {
    params: {
      providerId: string;
      provider?: {
        name: string;
        avatar?: string;
        title?: string;
        description?: string;
        rating?: number;
        specialties?: string[];
        followers?: number;
      };
    };
  };
};

const USER_REVIEWS = [
  {
    id: '1',
    userName: 'Caio César',
    comment: 'Helped me a lot',
    date: '20 Jun 2023',
    rating: 5,
  },
  {
    id: '2',
    userName: 'Maria Fernandes',
    comment: 'Really nice!',
    date: '19 Jun 2023',
    rating: 4,
  },
  {
    id: '3',
    userName: 'Carla Junqueira',
    comment: "I'd recommend it to everyone!",
    date: '19 Jun 2023',
    rating: 4,
  },
] as const;

const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({ navigation, route }) => {
  const { providerId, provider } = route.params;
  const [activeTab, setActiveTab] = useState<'about' | 'communities'>('about');
  const [isFavorite, setIsFavorite] = useState(false);

  const providerData = provider || {
    name: 'Marcela Ferraz',
    title: 'Professora de Yoga',
    description: 'Hello! I\'m Marcela Ferraz, a Yoga teacher passionate about everything that involves conscious movement, well-being, and self-connection. I believe that Yoga is a transformative journey—a space where body, mind, and breath come together in balance and purpose.',
    rating: 5,
    specialties: ['Provider', 'Shop', 'Spirituality'],
    followers: 2846,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  };

  // Imagem do provider para background e hero section
  const backgroundImage = useMemo(() => {
    return providerData.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';
  }, [providerData.avatar]);

  // Carregar posts quando a aba communities estiver ativa
  const {
    posts: communityPosts,
    loading: loadingPosts,
    loadPosts: loadCommunityPosts,
  } = useUserFeed({
    enabled: false,
    pageSize: 10,
  });

  React.useEffect(() => {
    if (activeTab === 'communities') {
      loadCommunityPosts(1);
    }
  }, [activeTab, loadCommunityPosts]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFollow = () => {
    console.log('Follow provider:', providerId);
  };

  const handleTalkToProvider = () => {
    console.log('Talk to provider:', providerId);
  };

  const handlePlanPress = (plan: Plan) => {
    console.log('Plan pressed:', plan.id);
  };

  const handlePlanLike = (plan: Plan) => {
    console.log('Like plan:', plan.id);
  };

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.id);
  };

  const handleProductLike = (product: Product) => {
    console.log('Like product:', product.id);
  };

  // Mock plans data
  const providerPlans: Plan[] = useMemo(() => [
    {
      id: '1',
      title: 'Home Mobility Challenge',
      price: null,
      tag: 'Fitness',
      tagColor: 'default',
      image: 'https://via.placeholder.com/300',
      likes: 42,
      currency: 'USD',
    },
    {
      id: '2',
      title: 'Trail Run - United State',
      price: null,
      tag: 'Fitness',
      tagColor: 'default',
      image: 'https://via.placeholder.com/300',
      likes: 38,
      currency: 'USD',
    },
  ], []);

  // Mock products data
  const recommendedProducts: Product[] = useMemo(() => [
    {
      id: '1',
      title: 'Omega 3 Supplement',
      price: 150.99,
      tag: 'Medicine',
      image: 'https://via.placeholder.com/200',
      likes: 0,
    },
    {
      id: '2',
      title: 'Melatonin Chocolate',
      price: 10.50,
      tag: 'Nutrition',
      image: 'https://via.placeholder.com/200',
      likes: 0,
    },
  ], []);

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
                    {providerData.specialties?.map((specialty, index) => (
                      <View key={index} style={styles.badge}>
                        <Text style={styles.badgeText}>{specialty}</Text>
                      </View>
                    ))}
                  </View>
                  {providerData.title && (
                    <Text style={styles.heroTitle}>{providerData.title}</Text>
                  )}
                  <Text style={styles.heroName}>{providerData.name}</Text>
                  <View style={styles.heroFooter}>
                    <View style={styles.heroStats}>
                      <View style={styles.statItem}>
                        <Icon name="star" size={16} color="#FFFFFF" />
                        <Text style={styles.statText}>{providerData.rating || 5}</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Icon name="people" size={16} color="#FFFFFF" />
                        <Text style={styles.statText}>{providerData.followers || 2846}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.followButton} onPress={handleFollow} activeOpacity={0.7}>
                      <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.content}>
            <View style={styles.tabsContainer}>
              <Toggle
                options={['About', 'My communities'] as const}
                selected={activeTab === 'about' ? 'About' : 'My communities'}
                onSelect={(option) => {
                  if (option === 'About') {
                    setActiveTab('about');
                  } else {
                    setActiveTab('communities');
                  }
                }}
              />
            </View>

            {activeTab === 'about' && (
              <>
                <View style={styles.aboutSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>About {providerData.name}</Text>
                    <Icon name="keyboard-arrow-up" size={24} color="#001137" />
                  </View>
                  <Text style={styles.descriptionText}>{providerData.description}</Text>
                </View>

                <View style={styles.aboutSection}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Academic background</Text>
                    <Icon name="keyboard-arrow-up" size={24} color="#001137" />
                  </View>
                  <Text style={styles.descriptionText}>
                    I am trained in Yoga with specializations in meditation, mindful breathing, and restorative practices.
                    I've been teaching and supporting students for over 10 years working with people in different stages of their journey.
                  </Text>
                </View>

                {providerPlans.length > 0 && (
                  <View style={styles.programsSection}>
                    <Text style={styles.sectionTitle}>My programs</Text>
                    <PlansCarousel
                      title=""
                      subtitle=""
                      plans={providerPlans}
                      onPlanPress={handlePlanPress}
                      onPlanLike={handlePlanLike}
                    />
                  </View>
                )}

                {recommendedProducts.length > 0 && (
                  <View style={styles.productsSection}>
                    <Text style={styles.sectionTitle}>Products I recommend</Text>
                    {recommendedProducts.map((product) => (
                      <View key={product.id} style={styles.productCard}>
                        <ImageBackground
                          source={{ uri: product.image }}
                          style={styles.productImage}
                          imageStyle={styles.productImageStyle}
                        />
                        <View style={styles.productInfo}>
                          <View style={styles.productBadge}>
                            <Text style={styles.productBadgeText}>{product.tag}</Text>
                          </View>
                          <Text style={styles.productName}>{product.title}</Text>
                          <View style={styles.productFooter}>
                            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                            <View style={styles.productRating}>
                              <Text style={styles.productRatingText}>5</Text>
                              <Icon name="star" size={14} color="#FFB800" />
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity style={styles.addProductButton} activeOpacity={0.7}>
                          <Icon name="add" size={24} color="#001137" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.talkButtonContainer}>
                  <SecondaryButton
                    label="Talk to Marcela"
                    onPress={handleTalkToProvider}
                    icon="arrow-forward"
                    iconPosition="right"
                    style={styles.talkButton}
                  />
                </View>

                {renderUserFeedback()}
              </>
            )}

            {activeTab === 'communities' && (
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
    </SafeAreaView>
  );

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
};

export default ProviderProfileScreen;
