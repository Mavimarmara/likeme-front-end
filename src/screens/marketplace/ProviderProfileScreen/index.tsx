import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui/layout';
import { Toggle } from '@/components/ui';
import { SecondaryButton } from '@/components/ui/buttons';
import { ProductsCarousel, type Product } from '@/components/sections/product';
import { PostCard, NextEventsSection, type ProviderChat } from '@/components/sections/community';
import { useUserFeed } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice } from '@/utils';
import type { Post } from '@/types';
import type { Event } from '@/types/event';
import type { RootStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
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
  useAnalyticsScreen({ screenName: 'ProviderProfile', screenClass: 'ProviderProfileScreen' });
  const { t } = useTranslation();
  const { providerId, provider } = route.params;
  const [activeTab, setActiveTab] = useState<'about' | 'communities'>('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isAcademicExpanded, setIsAcademicExpanded] = useState(true);

  const rootNavigation = navigation.getParent() ?? navigation;

  const providerData = provider || {
    name: 'Marcela Ferraz',
    title: 'Professora de Yoga',
    description:
      "Hello! I'm Marcela Ferraz, a Yoga teacher passionate about everything that involves conscious movement, well-being, and self-connection. I believe that Yoga is a transformative journey—a space where body, mind, and breath come together in balance and purpose.",
    rating: 5,
    specialties: ['Provider', 'Shop', 'Spirituality'],
    followers: 2846,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  };

  // Imagem do provider para background e hero section
  const backgroundImage = useMemo(() => {
    return (
      providerData.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    );
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
    const chat: ProviderChat = {
      id: providerId,
      providerName: providerData.name,
      providerAvatar: providerData.avatar,
      lastMessage: '',
      timestamp: 'Now',
      unreadCount: 0,
    };

    // Navegar para ChatScreen dentro do Community stack usando CommonActions
    rootNavigation.dispatch(
      CommonActions.navigate({
        name: 'Community',
        params: {
          screen: 'ChatScreen',
          params: { chat },
        },
      })
    );
  };

  const handleEventPress = (event: Event) => {
    console.log('Event pressed:', event.id);
  };

  const handleEventSave = (event: Event) => {
    console.log('Save event:', event.id);
  };

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.id);
  };

  const handleProductLike = (product: Product) => {
    console.log('Like product:', product.id);
  };

  // Mock events data
  const providerEvents: Event[] = useMemo(
    () => [
      {
        id: '1',
        title: 'Home Mobility Challenge',
        date: '2024-01-15',
        time: '10:00',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        participants: [],
        participantsCount: 42,
      },
      {
        id: '2',
        title: 'Trail Run - United State',
        date: '2024-01-20',
        time: '08:00',
        thumbnail: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400',
        participants: [],
        participantsCount: 38,
      },
    ],
    []
  );

  // Mock products data
  const recommendedProducts: Product[] = useMemo(
    () => [
      {
        id: '1',
        title: 'Omega 3 Supplement',
        price: 150.99,
        tag: 'Medicine',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        likes: 0,
      },
      {
        id: '2',
        title: 'Melatonin Chocolate',
        price: 10.5,
        tag: 'Nutrition',
        image: 'https://images.unsplash.com/photo-1606312619070-d48d4e5b6916?w=400',
        likes: 0,
      },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton={true} onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Image */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: backgroundImage }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
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
                {providerData.title && <Text style={styles.heroTitle}>{providerData.title}</Text>}
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
                  <TouchableOpacity
                    style={styles.followButton}
                    onPress={handleFollow}
                    activeOpacity={0.7}
                  >
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
              options={[t('marketplace.about'), t('marketplace.myCommunities')] as any}
              selected={activeTab === 'about' ? t('marketplace.about') : t('marketplace.myCommunities')}
              onSelect={(option) => {
                if (option === t('marketplace.about')) {
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
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => setIsAboutExpanded(!isAboutExpanded)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sectionTitle}>{t('marketplace.about')} {providerData.name}</Text>
                  <Icon
                    name={isAboutExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color="#001137"
                  />
                </TouchableOpacity>
                {isAboutExpanded && (
                  <Text style={styles.descriptionText}>{providerData.description}</Text>
                )}
              </View>

              <View style={styles.aboutSection}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => setIsAcademicExpanded(!isAcademicExpanded)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sectionTitle}>Academic background</Text>
                  <Icon
                    name={isAcademicExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color="#001137"
                  />
                </TouchableOpacity>
                {isAcademicExpanded && (
                  <Text style={styles.descriptionText}>
                    I am trained in Yoga with specializations in meditation, mindful breathing, and
                    restorative practices. I've been teaching and supporting students for over 10
                    years working with people in different stages of their journey.
                  </Text>
                )}
              </View>

              {providerEvents.length > 0 && (
                <View style={styles.programsSection}>
                  <NextEventsSection
                    events={providerEvents}
                    onEventPress={handleEventPress}
                    onEventSave={handleEventSave}
                  />
                </View>
              )}

              {recommendedProducts.length > 0 && (
                <View style={styles.productsSection}>
                  <Text style={styles.sectionTitle}>Products I recommend</Text>
                  {recommendedProducts.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productRow}
                      onPress={() => handleProductPress(product)}
                      activeOpacity={0.8}
                    >
                      <Image source={{ uri: product.image }} style={styles.productRowImage} />
                      <View style={styles.productRowContent}>
                        {product.tag && (
                          <View style={styles.productRowCategory}>
                            <Text style={styles.productRowCategoryText}>{product.tag}</Text>
                          </View>
                        )}
                        <Text style={styles.productRowTitle}>{product.title}</Text>
                        <View style={styles.productRowFooter}>
                          <Text style={styles.productRowPrice}>{formatPrice(product.price)}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.productRowAddButton}
                        activeOpacity={0.7}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleProductPress(product);
                        }}
                      >
                        <Icon name="add" size={24} color="#000" />
                      </TouchableOpacity>
                    </TouchableOpacity>
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
                  <Text style={styles.emptyText}>{t('marketplace.noCommunityPostsFound')}</Text>
                </View>
              ) : (
                communityPosts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function renderUserFeedback() {
    return (
      <View style={styles.feedbackSection}>
        <View style={styles.feedbackHeader}>
          <Text style={styles.feedbackTitle}>{t('marketplace.userFeedback')}</Text>
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
