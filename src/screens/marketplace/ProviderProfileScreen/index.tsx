import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui/layout';
import { Toggle } from '@/components/ui';
import { SecondaryButton } from '@/components/ui/buttons';
import { PostCard } from '@/components/sections/community';
import { ProductsList } from '@/components/sections/marketplace';
import { useUserFeed, useAdvertiser } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import type { ProviderChat } from '@/types/community';
import type { RootStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

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
  const { providerId, provider: providerFromParams } = route.params;
  const [activeTab, setActiveTab] = useState<'about' | 'communities'>('about');
  const [_isFavorite, _setIsFavorite] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isAcademicExpanded, setIsAcademicExpanded] = useState(true);

  const initialAdvertiser = useMemo(() => {
    if (!providerFromParams) return null;
    return {
      id: providerId,
      name: providerFromParams.name,
      description: providerFromParams.description ?? undefined,
      logo: providerFromParams.avatar ?? undefined,
      status: 'active',
      createdAt: '',
      updatedAt: '',
    };
  }, [providerId, providerFromParams]);

  const { advertiser, loading: loadingProvider } = useAdvertiser({
    advertiserId: providerId || undefined,
    initialAdvertiser: initialAdvertiser ?? undefined,
    enabled: !!providerId,
  });

  const providerData = useMemo(() => {
    if (advertiser) {
      return {
        name: advertiser.name ?? '',
        avatar: advertiser.logo ?? '',
        title: '',
        description: advertiser.description ?? '',
        rating: undefined as number | undefined,
        specialties: [] as string[],
        followers: undefined as number | undefined,
      };
    }
    if (providerFromParams) {
      return {
        name: providerFromParams.name ?? '',
        avatar: providerFromParams.avatar ?? '',
        title: providerFromParams.title ?? '',
        description: providerFromParams.description ?? '',
        rating: providerFromParams.rating,
        specialties: providerFromParams.specialties ?? [],
        followers: providerFromParams.followers,
      };
    }
    return null;
  }, [advertiser, providerFromParams]);

  const rootNavigation = navigation.getParent() ?? navigation;

  // Imagem do provider para background e hero section
  const backgroundImage = useMemo(() => {
    return providerData?.avatar ?? '';
  }, [providerData?.avatar]);

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
    if (!providerData) return;
    const chat: ProviderChat = {
      id: providerId,
      providerName: providerData.name,
      providerAvatar: providerData.avatar,
      lastMessage: '',
      timestamp: 'Now',
      unreadCount: 0,
    };

    rootNavigation.dispatch(
      CommonActions.navigate({
        name: 'Chat',
        params: {
          screen: 'ChatList',
          params: { chat },
        },
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton={true} onBackPress={handleBackPress} />
      {loadingProvider && !providerData && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#001137' />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      )}
      {!loadingProvider && !providerData && (
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>{t('marketplace.providerNotFound')}</Text>
        </View>
      )}
      {providerData && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Section with Image */}
          <View style={styles.heroSection}>
            <ImageBackground
              source={{ uri: backgroundImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' }}
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
                  {providerData.title ? <Text style={styles.heroTitle}>{providerData.title}</Text> : null}
                  <Text style={styles.heroName}>{providerData.name}</Text>
                  <View style={styles.heroFooter} />
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
                    <Text style={styles.sectionTitle}>
                      {t('marketplace.about')} {providerData.name}
                    </Text>
                    <Icon
                      name={isAboutExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                      size={24}
                      color='#001137'
                    />
                  </TouchableOpacity>
                  {isAboutExpanded && <Text style={styles.descriptionText}>{providerData.description}</Text>}
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
                      color='#001137'
                    />
                  </TouchableOpacity>
                  {isAcademicExpanded && (
                    <Text style={styles.descriptionText}>
                      I am trained in Yoga with specializations in meditation, mindful breathing, and restorative
                      practices. I've been teaching and supporting students for over 10 years working with people in
                      different stages of their journey.
                    </Text>
                  )}
                </View>

                <ProductsList
                  advertiserId={providerId}
                  navigation={navigation}
                  title={t('marketplace.recommendedProductsForJourney', { provider: providerData.name })}
                />

                <View style={styles.talkButtonContainer}>
                  <SecondaryButton
                    label={providerData.name ? `Talk to ${providerData.name}` : 'Talk to provider'}
                    onPress={handleTalkToProvider}
                    icon='arrow-forward'
                    iconPosition='right'
                    style={styles.talkButton}
                  />
                </View>
              </>
            )}

            {activeTab === 'communities' && (
              <View style={styles.communityPreviewContainer}>
                {loadingPosts ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color='#001137' />
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
      )}
    </SafeAreaView>
  );
};

export default ProviderProfileScreen;
