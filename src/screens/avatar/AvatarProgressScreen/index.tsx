import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, ImageBackground, StatusBar, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background, ProgressHeaderLogo } from '@/components/ui/layout';
import { FloatingMenu } from '@/components/ui/menu';
import { PrimaryButton, SecondaryButton, ButtonGroup, IconButton } from '@/components/ui/buttons';
import { PeriodSelector } from '@/components/ui/inputs';
import { CTACard } from '@/components/ui/cards';
import ProgressBar from '@/components/ui/feedback/ProgressBar';
import { BackgroundIconButton } from '@/assets';
import { useMenuItems, useCommunities, useSuggestedProducts, useAnamnesisScores } from '@/hooks';
import { mapChannelsToEvents } from '@/utils';
import { communityService, anamnesisService, userService } from '@/services';
import type { UserMarker } from '@/types/anamnesis';
import { getMarkerColor, getMarkerGradient, hasMarkerGradient, MARKER_NAMES } from '@/constants/markers';
import { COLORS } from '@/constants';
import { useTranslation } from '@/hooks/i18n';
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
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const AvatarProgressScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'AvatarProgress', screenClass: 'AvatarProgressScreen' });
  const { t } = useTranslation();
  const rootNavigation = navigation.getParent() ?? navigation;
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [events, setEvents] = useState<Event[]>([]);
  const [popularProviders, setPopularProviders] = useState<Provider[]>([]);
  const [markers, setMarkers] = useState<UserMarker[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingMarkers, setLoadingMarkers] = useState(true);
  const [markerRowWidth, setMarkerRowWidth] = useState(0);
  const menuItems = useMenuItems(navigation);

  const TREND_ICON_WIDTH = 34;

  const onMarkerRowLayout = useCallback((e: { nativeEvent: { layout: { width: number } } }) => {
    const { width } = e.nativeEvent.layout;
    setMarkerRowWidth(width);
  }, []);
  const { scores: anamnesisScores } = useAnamnesisScores();

  const { products: recommendedProducts } = useSuggestedProducts({
    limit: 3,
    status: 'active',
    enabled: true,
  });

  const { communities: rawCommunities, categories } = useCommunities({
    enabled: true,
    pageSize: 2,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
  });

  const recommendedCommunities = useMemo(() => {
    return rawCommunities.slice(0, 2).map((community) => {
      const category = categories.length > 0 ? categories[0] : undefined;
      return {
        id: community.communityId,
        title: community.displayName,
        badge: category?.name || t('home.community'),
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

        const isSuccess =
          userFeedResponse.success === true ||
          userFeedResponse.status === 'ok' ||
          userFeedResponse.data?.status === 'ok';

        let feedData:
          | {
              communityUsers?: Array<{
                userId: string;
                roles?: string[];
                communityMembership?: string;
              }>;
              users?: Array<{ userId: string; displayName?: string; avatarFileId?: string }>;
              files?: Array<{ fileId: string; fileUrl?: string }>;
            }
          | undefined;
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
          if (
            roles.includes('community-moderator') ||
            roles.includes('community-admin') ||
            roles.includes('owner') ||
            relation.communityMembership === 'owner'
          ) {
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

  const handleSharePress = async () => {
    try {
      const mindPct = anamnesisScores?.mentalPercentage ?? 0;
      const bodyPct = anamnesisScores?.physicalPercentage ?? 0;
      const message = t('avatar.shareMessage', { mindPercentage: mindPct, bodyPercentage: bodyPct });
      await Share.share({ message });
    } catch (error) {
    }
  };

  const handleSeeMarker = (marker?: UserMarker) => {
    const markerToShow = marker || (markers.length > 0 ? markers[0] : null);
    if (markerToShow) {
      navigation.navigate('MarkerDetails', {
        marker: markerToShow,
      });
    }
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

  useEffect(() => {
    const loadMarkers = async () => {
      try {
        setLoadingMarkers(true);
        const profileResponse = await userService.getProfile();
        const userId = profileResponse.success ? profileResponse.data?.id : null;

        if (!userId) {
          setMarkers([]);
          return;
        }

        const markersResponse = await anamnesisService.getUserMarkers({ userId });

        if (markersResponse.success && markersResponse.data) {
          setMarkers(markersResponse.data);
        } else {
          const fallbackIds = ['activity', 'connection', 'environment', 'nutrition', 'purpose-vision', 'self-esteem', 'sleep', 'smile', 'spirituality', 'stress'] as const;
          setMarkers(
            fallbackIds.map((id) => ({
              id,
              name: t(`avatar.marker_${id.replace(/-/g, '_')}`),
              trend: 'stable' as const,
              percentage: 0,
            })),
          );
        }
      } catch (error) {
        console.error('Error loading markers:', error);
        const fallbackIds = ['activity', 'connection', 'environment', 'nutrition', 'purpose-vision', 'self-esteem', 'sleep', 'smile', 'spirituality', 'stress'] as const;
        setMarkers(
          fallbackIds.map((id) => ({
            id,
            name: t(`avatar.marker_${id.replace(/-/g, '_')}`),
            trend: 'stable' as const,
            percentage: 0,
          })),
        );
      } finally {
        setLoadingMarkers(false);
      }
    };

    loadMarkers();
  }, []);

  const biomarkerCards = useMemo(() => {
    const increasingMarkers = markers.filter((marker) => marker.trend === 'increasing');

    if (increasingMarkers.length === 0) {
      return markers.map((marker) => {
        const markerName = MARKER_NAMES[marker.id] || marker.name;
        const improvementPercentage = marker.percentage > 0 ? Math.round(marker.percentage / 10) : 0;

        return {
          id: marker.id,
          markerId: marker.id,
          percentage: marker.percentage,
          title: `${markerName.toUpperCase()} : +${improvementPercentage}%`,
          message: t('avatar.youveImproved'),
          description: `${t('avatar.niceJobBody')}\n${t('avatar.improveMind')}`,
        };
      });
    }

    return increasingMarkers.map((marker) => {
      const markerName = MARKER_NAMES[marker.id] || marker.name;
      const improvementPercentage = marker.percentage > 0 ? Math.round(marker.percentage / 10) : 0;

      return {
        id: marker.id,
        markerId: marker.id,
        percentage: marker.percentage,
        title: `${markerName.toUpperCase()} : +${improvementPercentage}%`,
        message: t('avatar.youveImproved'),
        description: `${t('avatar.niceJobBody')}\n${t('avatar.improveMind')}`,
      };
    });
  }, [markers, t]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND} />
      <Header
        showBackButton={true}
        onBackPress={handleBackPress}
        customLogo={<ProgressHeaderLogo />}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.topSection}>
            <View style={styles.headerContainer}>
              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={(period) => setSelectedPeriod(period as 'week' | 'month')}
                options={['week', 'month']}
              />
            </View>

            <View style={styles.markersListContainer}>
              {loadingMarkers ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: COLORS.TEXT_LIGHT }}>{t('avatar.loadingMarkers')}</Text>
                </View>
              ) : markers.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: COLORS.TEXT_LIGHT }}>{t('avatar.noMarkersFound')}</Text>
                  <Text style={{ color: COLORS.TEXT_LIGHT, fontSize: 12, marginTop: 8 }}>
                    {t('avatar.checkAnamnesisMessage')}
                  </Text>
                </View>
              ) : (
                markers.map((marker) => {
                  return (
                    <View key={marker.id} style={styles.markerItem}>
                      <TouchableOpacity
                        style={styles.markerHeader}
                        onPress={() => handleSeeMarker(marker)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.markerName}>{marker.name}</Text>
                        <Icon name="chevron-right" size={20} color={COLORS.TEXT} />
                      </TouchableOpacity>
                      <View style={styles.markerContent} onLayout={onMarkerRowLayout}>
                        <View
                          style={[
                            styles.markerProgressContainer,
                            markerRowWidth > 0 && { flex: undefined },
                          ]}
                        >
                          <ProgressBar
                            current={Math.max(marker.percentage, 1)}
                            total={100}
                            color={getMarkerColor(marker.id)}
                            gradientColors={
                              hasMarkerGradient(marker.id)
                                ? getMarkerGradient(marker.id) || undefined
                                : undefined
                            }
                            height={30}
                            showRemaining={false}
                            containerWidth={
                              markerRowWidth > 0
                                ? Math.max(
                                    8,
                                    (markerRowWidth - TREND_ICON_WIDTH) *
                                      (Math.max(marker.percentage, 1) / 100),
                                  )
                                : undefined
                            }
                          />
                        </View>
                        <View style={styles.markerTrend}>
                          <Icon
                            name={
                              marker.trend === 'increasing'
                                ? 'trending-up'
                                : marker.trend === 'decreasing'
                                  ? 'trending-down'
                                  : 'remove'
                            }
                            size={20}
                            color={COLORS.TEXT_LIGHT}
                          />
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            <View style={styles.shareButtonContainer}>
              <IconButton
                icon="share"
                onPress={handleSharePress}
                label={t('avatar.share')}
                backgroundTintColor={COLORS.SECONDARY.PURE}
              />
            </View>
          </View>

          <CTACard
            title={t('avatar.insights')}
            highlightText={t('avatar.didYouRunMarathon')}
            description={[
              t('avatar.greatForBody'),
              t('avatar.regenerativeTraining'),
            ]}
            primaryButtonLabel={t('avatar.seeMarker')}
            primaryButtonOnPress={() => handleSeeMarker(markers[0])}
            secondaryButtonLabel={t('avatar.share')}
            secondaryButtonOnPress={handleSharePress}
            secondaryButtonIcon="share"
            backgroundColor={COLORS.SECONDARY.PURE}
          />

          {biomarkerCards.length > 0 && (
            <View style={styles.biomarkersSection}>
              <Text style={styles.biomarkersTitle}>{t('avatar.biomarkers')}</Text>
              <Carousel
                data={biomarkerCards}
                renderItem={(card) => (
                  <View key={card.id} style={styles.biomarkerCard}>
                    <Text style={styles.biomarkerCardTitle}>{card.title}</Text>
                    <Text style={styles.biomarkerCardMessage}>{card.message}</Text>
                    <Text style={styles.biomarkerCardDescription}>{card.description}</Text>
                    <View style={styles.biomarkerProgressContainer}>
                      <ProgressBar
                        current={Math.max(card.percentage, 1)}
                        total={100}
                        color={getMarkerColor(card.markerId)}
                        gradientColors={
                          hasMarkerGradient(card.markerId)
                            ? getMarkerGradient(card.markerId) || undefined
                            : undefined
                        }
                        height={30}
                        showRemaining={false}
                      />
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
          )}

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
                title={t('home.productsRecommended')}
                subtitle={t('home.discoverProducts')}
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
              label={t('avatar.addWidgets')}
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
