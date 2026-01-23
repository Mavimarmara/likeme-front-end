import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { FloatingMenu } from '@/components/ui/menu';
import { PrimaryButton, SecondaryButton, ButtonGroup } from '@/components/ui/buttons';
import { BackgroundIconButton } from '@/assets';
import { useMenuItems, useCommunities, useSuggestedProducts } from '@/hooks';
import { mapChannelsToEvents } from '@/utils';
import { communityService } from '@/services';
import type { Channel } from '@/types/community';
import type { Event } from '@/types/event';
import { 
  NextEventsSection,
  PopularProvidersSection,
  RecommendedCommunitiesSection,
  type Provider,
  type RecommendedCommunity,
} from '@/components/sections/community';
import { ProductsCarousel, type Product } from '@/components/sections/product';
import Carousel from '@/components/sections/product/Carousel';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const AvatarProgressScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = navigation.getParent() ?? navigation;
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [events, setEvents] = useState<Event[]>([]);
  const [popularProviders, setPopularProviders] = useState<Provider[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const menuItems = useMenuItems(navigation);

  const { products: recommendedProducts } = useSuggestedProducts({
    limit: 3,
    status: 'active',
    enabled: true,
  });

  const {
    communities: rawCommunities,
    categories,
  } = useCommunities({
    enabled: true,
    pageSize: 2,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
  });

  const recommendedCommunities = useMemo(() => {
    return rawCommunities
      .slice(0, 2)
      .map((community) => {
        const category = categories.length > 0 ? categories[0] : undefined;
        return {
          id: community.communityId,
          title: community.displayName,
          badge: category?.name || 'Community',
          image: '',
        };
      });
  }, [rawCommunities, categories]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await communityService.getChannels({
          types: ['live', 'broadcast'],
        });

        if (response.success && response.data?.channels) {
          const mappedEvents = mapChannelsToEvents(response.data.channels);
          setEvents(mappedEvents.slice(0, 2));
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadPopularProviders = async () => {
      try {
        setLoadingProviders(true);
        const userFeedResponse = await communityService.getUserFeed({
          page: 1,
          limit: 20,
        });

        const isSuccess = userFeedResponse.success === true || 
                         userFeedResponse.status === 'ok' || 
                         userFeedResponse.data?.status === 'ok';
        
        let feedData: {
          communityUsers?: Array<{ userId: string; roles?: string[]; communityMembership?: string }>;
          users?: Array<{ userId: string; displayName?: string; avatarFileId?: string }>;
          files?: Array<{ fileId: string; fileUrl?: string }>;
        } | undefined;
        if (userFeedResponse.data?.data) {
          feedData = userFeedResponse.data.data as typeof feedData;
        } else if (userFeedResponse.data && 'posts' in userFeedResponse.data) {
          feedData = userFeedResponse.data as typeof feedData;
        }

        if (!isSuccess || !feedData) {
          setPopularProviders([]);
          return;
        }

        const communityUsers = feedData.communityUsers || [];
        const users = feedData.users || [];
        const files = feedData.files || [];
        
        const ownerUserIds = new Set<string>();
        communityUsers.forEach((relation) => {
          const roles = relation.roles || [];
          if (roles.includes('community-moderator') || 
              roles.includes('community-admin') || 
              roles.includes('owner') ||
              relation.communityMembership === 'owner') {
            ownerUserIds.add(relation.userId);
          }
        });

        if (ownerUserIds.size === 0) {
          const uniqueUserIds = new Set<string>();
          communityUsers.forEach((relation) => {
            if (relation.userId) {
              uniqueUserIds.add(relation.userId);
            }
          });
          uniqueUserIds.forEach((userId) => ownerUserIds.add(userId));
        }

        const providers: Provider[] = Array.from(ownerUserIds)
          .slice(0, 6)
          .map((userId) => {
            const user = users.find((u) => u.userId === userId);
            if (!user || !user.displayName) {
              return null;
            }

            const avatarUrl = user.avatarFileId
              ? files.find((f) => f.fileId === user.avatarFileId)?.fileUrl
              : undefined;

            return {
              id: user.userId,
              name: user.displayName,
              avatar: avatarUrl,
            };
          })
          .filter((provider) => provider !== null) as Provider[];

        setPopularProviders(providers);
      } catch (error) {
        console.error('Error loading popular providers:', error);
        setPopularProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    };

    loadPopularProviders();
  }, []);

  const handleBackPress = () => {
    rootNavigation.goBack();
  };

  const handleSharePress = () => {
    console.log('Share progress');
  };

  const handleEventPress = (event: Event) => {
    console.log('Event pressed:', event.id);
  };

  const handleEventSave = (event: Event) => {
    console.log('Save event:', event.id);
  };

  const handleProviderPress = (provider: Provider) => {
    console.log('Provider pressed:', provider.id);
  };

  const handleProductPress = (product: Product) => {
    rootNavigation.navigate('ProductDetails', {
      productId: product.id,
    } as never);
  };

  const handleProductLike = (product: Product) => {
    console.log('Like product:', product.id);
  };

  const handleRecommendedCommunityPress = (community: RecommendedCommunity) => {
    rootNavigation.navigate('Community' as never);
  };

  const markers = useMemo(() => [
    { id: 'activity', name: 'Activity', trend: 'increasing' as const, percentage: 70 },
    { id: 'connection', name: 'Connection', trend: 'decreasing' as const, percentage: 30 },
    { id: 'environment', name: 'Environment', trend: 'increasing' as const, percentage: 80 },
    { id: 'nutrition', name: 'Nutrition', trend: 'decreasing' as const, percentage: 40 },
    { id: 'purpose-vision', name: 'Purpose & vision', trend: 'increasing' as const, percentage: 60 },
    { id: 'self-esteem', name: 'Self-esteem', trend: 'increasing' as const, percentage: 50 },
    { id: 'sleep', name: 'Sleep', trend: 'increasing' as const, percentage: 70 },
    { id: 'smile', name: 'Smile', trend: 'decreasing' as const, percentage: 20 },
    { id: 'spirituality', name: 'Spirituality', trend: 'decreasing' as const, percentage: 40 },
    { id: 'stress', name: 'Stress', trend: 'increasing' as const, percentage: 80 },
  ], []);

  const biomarkerCards = useMemo(() => [
    {
      id: 'stress',
      title: 'STRESS : +30%',
      message: "You've improved a lot!",
      description: "Nice job taking care of your body!\nWhat about improving your state of mind?",
      submarkers: [
        { id: 'longevity', name: 'Longevity', percentage: 70 },
        { id: 'performance', name: 'Performance', percentage: 50 },
      ],
    },
    {
      id: 'nutrition',
      title: 'NUTRITION : +30%',
      message: "You've improved a lot!",
      description: "Nice job taking care of your body!\nWhat about improving your state of mind?",
      submarkers: [
        { id: 'longevity', name: 'Longevity', percentage: 60 },
        { id: 'performance', name: 'Performance', percentage: 40 },
      ],
    },
    {
      id: 'sleep',
      title: 'SLEEP : +30%',
      message: "You've improved a lot!",
      description: "Nice job taking care of your body!\nWhat about improving your state of mind?",
      submarkers: [
        { id: 'longevity', name: 'Longevity', percentage: 80 },
        { id: 'performance', name: 'Performance', percentage: 65 },
      ],
    },
    {
      id: 'connection',
      title: 'CONNECTION : +30%',
      message: "You've improved a lot!",
      description: "Nice job taking care of your body!\nWhat about improving your state of mind?",
      submarkers: [
        { id: 'longevity', name: 'Longevity', percentage: 55 },
        { id: 'performance', name: 'Performance', percentage: 45 },
      ],
    },
  ], []);

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        showBackButton={true}
        onBackPress={handleBackPress}
        showBellButton={true}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.topSection}>
            <View style={styles.headerContainer}>
            <Text style={styles.title}>Your Progress</Text>
            <ButtonGroup style={styles.periodSelector} direction="horizontal">
              <SecondaryButton
                label="Week"
                onPress={() => setSelectedPeriod('week')}
                size="medium"
                style={selectedPeriod === 'week' ? styles.periodButtonActive : undefined}
                labelStyle={selectedPeriod === 'week' ? styles.periodButtonTextActive : undefined}
              />
              <SecondaryButton
                label="Month"
                onPress={() => setSelectedPeriod('month')}
                size="medium"
                style={selectedPeriod === 'month' ? styles.periodButtonActive : undefined}
                labelStyle={selectedPeriod === 'month' ? styles.periodButtonTextActive : undefined}
              />
            </ButtonGroup>
          </View>

            <View style={styles.markersListContainer}>
              {markers.map((marker) => (
                <View key={marker.id} style={styles.markerItem}>
                  <View style={styles.markerHeader}>
                    <Text style={styles.markerName}>{marker.name}</Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Icon name="chevron-right" size={20} color="#001137" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.markerContent}>
                    <View style={styles.markerGraph}>
                      <View style={[styles.markerBar, { width: `${marker.percentage}%` }]} />
                    </View>
                    <View style={styles.markerTrend}>
                      <Icon 
                        name={marker.trend === 'increasing' ? 'trending-up' : 'trending-down'} 
                        size={20} 
                        color="#6E6A6A" 
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.shareButtonContainer}>
              <TouchableOpacity style={styles.shareButton} onPress={handleSharePress} activeOpacity={0.7}>
                <View style={styles.shareIconContainer}>
                  <Icon name="share" size={24} color="#001137" />
                </View>
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>Insights</Text>
            <View style={styles.insightsContent}>
              <Text style={styles.insightsHighlight}>
                Did you know that you ran a full marathon last week?
              </Text>
              <Text style={styles.insightsText}>
                That's great for your body, and because of that your movement markers are off the chart!
              </Text>
              <Text style={styles.insightsText}>
                This week what about doing some regenerative mobility training like yoga or pilates?
              </Text>
            </View>
            <View style={styles.insightsActions}>
              <SecondaryButton
                label="Share"
                icon="share"
                iconSize={24}
                onPress={handleSharePress}
                size="large"
                style={styles.insightsShareButton}
              />
              <PrimaryButton
                label="See marker"
                onPress={() => console.log('See marker')}
                size="large"
                style={styles.insightsSeeMarkerButton}
              />
            </View>
          </View>

          <View style={styles.biomarkersSection}>
            <Text style={styles.biomarkersTitle}>Biomarkers</Text>
            <Carousel
              data={biomarkerCards}
              renderItem={(card) => (
                <View key={card.id} style={styles.biomarkerCard}>
                  <Text style={styles.biomarkerCardTitle}>{card.title}</Text>
                  <Text style={styles.biomarkerCardMessage}>{card.message}</Text>
                  <Text style={styles.biomarkerCardDescription}>{card.description}</Text>
                  <View style={styles.biomarkerSubmarkers}>
                    {card.submarkers.map((submarker) => (
                      <View key={submarker.id} style={styles.submarkerItem}>
                        <View style={styles.submarkerBar}>
                          <View style={[styles.submarkerBarFill, { width: `${submarker.percentage}%` }]} />
                        </View>
                        <Text style={styles.submarkerName}>{submarker.name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              keyExtractor={(card) => card.id}
              itemWidth={307}
              gap={8}
              showPagination={true}
              paginationSize="Large"
            />
          </View>

          <NextEventsSection
            events={events}
            onEventPress={handleEventPress}
            onEventSave={handleEventSave}
          />

          <PopularProvidersSection
            providers={popularProviders}
            onProviderPress={handleProviderPress}
          />

          {recommendedProducts && recommendedProducts.length > 0 && (
            <View style={styles.productsSection}>
              <ProductsCarousel
                title="Products recommended for your sleep journey by Dr. Peter Valasquez"
                subtitle="Discover our options selected just for you"
                products={recommendedProducts}
                onProductPress={handleProductPress}
                onProductLike={handleProductLike}
              />
            </View>
          )}

          <RecommendedCommunitiesSection
            communities={recommendedCommunities}
            onCommunityPress={handleRecommendedCommunityPress}
          />

          <View style={styles.addWidgetsContainer}>
            <SecondaryButton
              label="Add new widgets"
              onPress={() => console.log('Add new widgets')}
              size="large"
              style={styles.addWidgetsButton}
            />
          </View>
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId="home" />
    </SafeAreaView>
  );
};

export default AvatarProgressScreen;
