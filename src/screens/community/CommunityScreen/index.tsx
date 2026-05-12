import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, ScrollView, Text, NativeSyntheticEvent, NativeScrollEvent, Switch, Alert } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  SocialList,
  ShoppingList,
  EventBanner,
  CommunityDescriptionSection,
  type CommunityDescriptionSpecialist,
} from '@/components/sections/community';
import { styles as socialListStyles } from '@/components/sections/community/SocialList/styles';
import { Product } from '@/components/sections/product';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { GradientBackground, HeroImage, ScreenWithHeader } from '@/components/ui/layout';
import type { Event, FeedEvent } from '@/types/event';
import { SPACING, COMMUNITY_FEED_POSTS_PAGE_SIZE } from '@/constants';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import {
  useUserFeed,
  useCommunities,
  useCommunity,
  useSuggestedProducts,
  SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
  useAdvertisers,
  useMenuItems,
  useEventJoin,
} from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logTabSelect } from '@/analytics';
import { eventService, storageService } from '@/services';
import { logger } from '@/utils/logger';
import { resolveCommunityHeroImageUri } from '@/utils/community/mappers';
import type { Advertiser } from '@/types/ad';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import Toggle from '@/components/ui/buttons/Toggle';
import { Checkbox } from '@/components/ui/inputs';
import { EventWebViewSession } from '@/components/infrastructure/webview/EventWebViewSession';

type CommunityMode = 'Feed' | 'Solutions';

type CommunityInfoTabId = 'posts' | 'about' | 'agreements';

const getToggleOptions = (t: (key: string) => string): readonly [CommunityMode, CommunityMode] =>
  [t('community.social') as CommunityMode, t('community.solutions') as CommunityMode] as const;

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'CommunityList'>;
type Props = { navigation: NavigationProp };

/** Imagem padrão do hero quando a comunidade não tem avatar. */
const DEFAULT_COMMUNITY_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400';

/** Distância do fim do conteúdo para disparar próxima página do feed (evita depender só de onMomentumScrollEnd). */
const FEED_END_THRESHOLD_PX = 120;

const CommunityScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'CommunityList', screenClass: 'CommunityScreen' });
  const { t } = useTranslation();
  const toggleOptions = useMemo(() => getToggleOptions(t), [t]);
  const rootNavigation = navigation.getParent()?.getParent?.() ?? navigation.getParent();
  const [selectedMode, setSelectedMode] = useState<CommunityMode>('Feed');
  const [activeInfoTab, setActiveInfoTab] = useState<CommunityInfoTabId>('posts');
  const [welcomeDismissed, setWelcomeDismissed] = useState(true);
  const [shoppingTipDismissed, setShoppingTipDismissed] = useState(true);
  const [isCommunityFavorite, setIsCommunityFavorite] = useState(false);

  useEffect(() => {
    storageService.getCommunityWelcomeDismissed().then(setWelcomeDismissed);
  }, []);

  useEffect(() => {
    storageService.getCommunityShoppingTipDismissed().then(setShoppingTipDismissed);
  }, []);

  const handleWelcomeClose = useCallback(() => {
    setWelcomeDismissed(true);
    storageService.setCommunityWelcomeDismissed(true);
  }, []);

  const handleShoppingTipClose = useCallback(() => {
    setShoppingTipDismissed(true);
    storageService.setCommunityShoppingTipDismissed(true);
  }, []);

  const {
    communities: rawCommunities,
    categories,
    loading: _communitiesLoading,
    loadingMore: _communitiesLoadingMore,
    error: _communitiesError,
    hasMore: _communitiesHasMore,
    loadMore: _loadMoreCommunities,
    refresh: _refreshCommunities,
    events,
    feedEvents,
    communityFiles,
  } = useCommunities({
    enabled: true,
    pageSize: 10,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
    loadEvents: true,
  });

  const selectedCommunityId = rawCommunities[0]?.communityId;

  const [reminderEventIds, setReminderEventIds] = useState<Set<string>>(() => new Set());

  const upcomingCommunityEvents = useMemo(() => {
    const leadMs = 120_000;
    const minStart = Date.now() + leadMs;
    return events
      .filter((e) => {
        if (e.status !== 'scheduled' || !e.startsAt) return false;
        const t = new Date(e.startsAt).getTime();
        return Number.isFinite(t) && t >= minStart;
      })
      .slice(0, 10);
  }, [events]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ids = await eventService.listScheduledCommunityEventReminderIds();
      if (!cancelled) {
        setReminderEventIds(new Set(ids));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCommunityId, events]);

  const { termsAccepted: communityTermsAccepted, toggleTermsAccepted: toggleCommunityTermsAccepted } = useCommunity({
    communityId: selectedCommunityId,
  });

  useEffect(() => {
    if (!selectedCommunityId) {
      setIsCommunityFavorite(false);
      return;
    }
    let cancelled = false;
    storageService.isCommunityFavorite(selectedCommunityId).then((fav) => {
      if (!cancelled) setIsCommunityFavorite(fav);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedCommunityId]);

  const { advertisers: advertisersList } = useAdvertisers({ communityId: selectedCommunityId });
  const advertiser = advertisersList[0] ?? null;
  const communityProviderName = advertiser?.name?.trim() ?? null;

  const { eventBanner, eventJoinUrl, closeEventSession, handleEventBannerPress } = useEventJoin({
    loadEvents: true,
    events,
    communityAvatarUrl: rawCommunities[0]?.avatarUrl,
    communityProviderName,
  });

  const feedFilterParams = useMemo(() => ({}), []);

  const { posts, loading, loadingMore, error, loadMore } = useUserFeed({
    enabled: selectedMode === 'Feed',
    searchQuery: '',
    pageSize: COMMUNITY_FEED_POSTS_PAGE_SIZE,
    params: feedFilterParams,
  });

  const handleProductPress = (product: Product) => {
    rootNavigation?.navigate('ProductDetails', { productId: product.id } as never);
  };

  const handleProductLike = (product: Product) => {
    logger.debug('[CommunityScreen] product like (stub)', { productId: product.id });
  };

  const handleProfessionalPress = (advertiser: Advertiser) => {
    rootNavigation?.navigate('ProviderProfile', { providerId: advertiser.id } as never);
  };

  const { products: suggestedProducts } = useSuggestedProducts({
    ...SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
    enabled: true,
  });
  const { products: suggestedServices } = useSuggestedProducts({
    limit: 20,
    status: 'active',
    enabled: selectedMode === 'Solutions',
    type: 'service',
  });
  const { products: suggestedPrograms } = useSuggestedProducts({
    limit: 20,
    status: 'active',
    enabled: selectedMode === 'Solutions',
    type: PRODUCT_CATALOG_TYPE.PROGRAM,
  });

  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'community');

  const handleModeSelect = (mode: CommunityMode) => {
    setSelectedMode(mode);
  };

  const handleEventPress = (event: FeedEvent) => {
    logger.debug('[CommunityScreen] event press (stub)', { eventId: event.id });
  };

  const handleEventSave = (event: FeedEvent) => {
    logger.debug('[CommunityScreen] event save (stub)', { eventId: event.id });
  };

  const handleLoadMore = useCallback(() => {
    if (selectedMode === 'Feed') {
      loadMore();
    }
  }, [selectedMode, loadMore]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (selectedMode !== 'Feed' || activeInfoTab !== 'posts') return;
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
      if (distanceFromBottom <= FEED_END_THRESHOLD_PX) {
        handleLoadMore();
      }
    },
    [selectedMode, activeInfoTab, handleLoadMore],
  );

  const communityHeroBadges = useMemo(() => {
    const firstTwo = categories?.slice(0, 2) ?? [];
    return firstTwo.map((c) => c.name).filter(Boolean);
  }, [categories]);

  const primaryCommunity = rawCommunities[0];

  const communityHeroImageUri = useMemo(
    () => resolveCommunityHeroImageUri(primaryCommunity, communityFiles, DEFAULT_COMMUNITY_IMAGE),
    [primaryCommunity, communityFiles],
  );

  const communityInfoTabOptions: ButtonCarouselOption<CommunityInfoTabId>[] = useMemo(
    () => [
      { id: 'posts', label: t('community.tabPosts') },
      { id: 'about', label: t('community.tabAbout') },
      { id: 'agreements', label: t('community.tabAgreements') },
    ],
    [t],
  );

  const aboutBody = useMemo(() => rawCommunities[0]?.description?.trim() ?? '', [rawCommunities]);

  const agreementLines = useMemo(() => {
    const body = t('community.agreementsBody');
    return body.split('\n').filter((line) => line.trim().length > 0);
  }, [t]);

  const specialistData: CommunityDescriptionSpecialist | null = useMemo(() => {
    if (!advertiser) return null;
    const advertiserName = advertiser.name?.trim();
    if (!advertiserName) return null;
    return {
      name: advertiserName,
      subtitle: t('community.specialistLabel'),
      rating: 5,
      tags: [],
      avatarUri: advertiser.logo ?? undefined,
    };
  }, [advertiser, t]);

  const feedInformationSlot = useMemo(
    () => (
      <>
        <View style={styles.tabsContainerInCard}>
          <Text style={styles.sectionTitle}>{t('community.informationTitle')}</Text>
          <ButtonCarousel
            options={communityInfoTabOptions}
            selectedId={activeInfoTab}
            onSelect={(tabId) => {
              logTabSelect({ screen_name: 'community_list', tab_id: tabId });
              setActiveInfoTab(tabId);
            }}
          />
        </View>
        {activeInfoTab === 'about' ? (
          <View style={styles.tabContent}>
            {aboutBody.length > 0 ? (
              <Text style={styles.aboutBodyText}>{aboutBody}</Text>
            ) : (
              <Text style={styles.aboutBodyText}>{t('community.aboutEmpty')}</Text>
            )}
          </View>
        ) : null}
        {activeInfoTab === 'agreements' ? (
          <View style={styles.tabContent}>
            <View style={styles.descriptionContainer}>
              {agreementLines.map((line, index) => (
                <View key={index} style={styles.descriptionItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.descriptionText}>{line.trim()}</Text>
                </View>
              ))}
            </View>
            <View style={styles.agreementsCheckboxRow}>
              <Checkbox
                label={t('community.agreementsParticipationTermsCheckbox')}
                checked={communityTermsAccepted === true}
                onPress={toggleCommunityTermsAccepted}
                disabled={communityTermsAccepted === null}
                containerStyle={styles.agreementsTermsCheckboxContainer}
                labelStyle={styles.agreementsTermsCheckboxLabel}
              />
            </View>
          </View>
        ) : null}
      </>
    ),
    [
      t,
      communityInfoTabOptions,
      activeInfoTab,
      aboutBody,
      agreementLines,
      communityTermsAccepted,
      toggleCommunityTermsAccepted,
    ],
  );

  const handleCommunityFavoritePress = useCallback(() => {
    if (!selectedCommunityId) return;
    const next = !isCommunityFavorite;
    setIsCommunityFavorite(next);
    storageService.setCommunityFavorite(selectedCommunityId, next).catch((error) => {
      logger.error('Falha ao persistir favorito da comunidade', {
        communityId: selectedCommunityId,
        favorite: next,
        cause: error,
      });
      setIsCommunityFavorite(!next);
    });
  }, [selectedCommunityId, isCommunityFavorite]);

  const handleScheduledCommunityEventReminderToggle = useCallback(
    async (event: Event, enabled: boolean) => {
      if (!selectedCommunityId || !event.startsAt) {
        return;
      }
      try {
        if (enabled) {
          const res = await eventService.registerScheduledCommunityEventReminder({
            eventId: event.id,
            title: event.title,
            startsAt: event.startsAt,
            communityId: selectedCommunityId,
          });
          if (res.data?.registered === false && res.data?.reason === 'already_sent') {
            Alert.alert(t('community.eventReminder.sectionTitle'), t('community.eventReminder.alreadySentMessage'));
            return;
          }
          setReminderEventIds((prev) => new Set(prev).add(event.id));
        } else {
          await eventService.unregisterScheduledCommunityEventReminder(event.id);
          setReminderEventIds((prev) => {
            const next = new Set(prev);
            next.delete(event.id);
            return next;
          });
        }
      } catch (error) {
        logger.error('[CommunityScreen] lembrete de evento', { eventId: event.id, enabled, cause: error });
        Alert.alert(
          t('errors.error'),
          enabled ? t('community.eventReminder.registerError') : t('community.eventReminder.unregisterError'),
        );
      }
    },
    [selectedCommunityId, t],
  );

  return (
    <View style={styles.screenRoot}>
      {eventJoinUrl ? <EventWebViewSession url={eventJoinUrl} onClose={closeEventSession} /> : null}
      <ScreenWithHeader
        navigation={rootNavigation}
        headerProps={{
          showBackButton: true,
          showMenuWithAvatar: false,
          onBackPress: () => navigation?.goBack?.(),
          showRating: true,
          favoriteActive: isCommunityFavorite,
          onRatingPress: handleCommunityFavoritePress,
        }}
        contentContainerStyle={styles.container}
      >
        <View pointerEvents='none' style={styles.gradientBackground}>
          <GradientBackground />
        </View>
        <ScrollView
          style={[{ flex: 1 }, { zIndex: 1 }]}
          contentContainerStyle={{ paddingBottom: SPACING.XL }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={100}
        >
          {primaryCommunity?.displayName != null && (
            <HeroImage
              imageUri={communityHeroImageUri}
              name={primaryCommunity.displayName}
              badges={communityHeroBadges}
              footer={
                primaryCommunity.description ? (
                  <View style={styles.heroFooter}>
                    <Text style={styles.heroDescription}>{primaryCommunity.description}</Text>
                  </View>
                ) : undefined
              }
            />
          )}
          <View>
            <View style={styles.toggleRow}>
              <View style={styles.toggleContainer}>
                <Toggle<CommunityMode> options={toggleOptions} selected={selectedMode} onSelect={handleModeSelect} />
              </View>
            </View>
            {selectedMode === 'Feed' ? (
              <>
                {eventBanner ? (
                  <View style={socialListStyles.eventBannerContainer}>
                    <EventBanner event={eventBanner} onPress={handleEventBannerPress} />
                  </View>
                ) : null}
                {upcomingCommunityEvents.length > 0 ? (
                  <View style={styles.eventRemindersSection}>
                    <Text style={styles.eventRemindersTitle}>{t('community.eventReminder.sectionTitle')}</Text>
                    {upcomingCommunityEvents.map((ev, index) => (
                      <View key={ev.id} style={[styles.eventReminderRow, index === 0 && styles.eventReminderRowFirst]}>
                        <View style={styles.eventReminderTextCol}>
                          <Text style={styles.eventReminderEventTitle} numberOfLines={2}>
                            {ev.title}
                          </Text>
                          <Text style={styles.eventReminderToggleLabel}>
                            {t('community.eventReminder.toggleLabel')}
                          </Text>
                        </View>
                        <Switch
                          accessibilityLabel={t('community.eventReminder.toggleLabel')}
                          value={reminderEventIds.has(ev.id)}
                          onValueChange={(on) => {
                            void handleScheduledCommunityEventReminderToggle(ev, on);
                          }}
                          trackColor={{ false: '#d9d9d9', true: '#c4e8c8' }}
                          thumbColor={reminderEventIds.has(ev.id) ? '#2e7d32' : '#f4f3f4'}
                        />
                      </View>
                    ))}
                  </View>
                ) : null}
                <CommunityDescriptionSection
                  variant='feed'
                  specialist={specialistData}
                  welcomeDismissed={welcomeDismissed}
                  onWelcomeClose={handleWelcomeClose}
                />
                <SocialList
                  posts={posts}
                  loading={loading}
                  loadingMore={loadingMore}
                  error={error}
                  onLoadMore={handleLoadMore}
                  events={feedEvents}
                  onEventPress={handleEventPress}
                  onEventSave={handleEventSave}
                  products={suggestedProducts}
                  onProductPress={handleProductPress}
                  onProductLike={handleProductLike}
                  embedInParentScroll
                  betweenSpecialistAndPosts={feedInformationSlot}
                  renderPostsFeed={activeInfoTab === 'posts'}
                  renderFeedRecommendations={activeInfoTab === 'posts' || activeInfoTab === 'about'}
                />
              </>
            ) : (
              <>
                <CommunityDescriptionSection
                  variant='solutions'
                  specialist={specialistData}
                  shoppingTipDismissed={shoppingTipDismissed}
                  onShoppingTipClose={handleShoppingTipClose}
                />
                <ShoppingList
                  products={suggestedProducts}
                  services={suggestedServices}
                  programs={suggestedPrograms}
                  professionals={advertisersList}
                  onProductPress={handleProductPress}
                  onProductLike={handleProductLike}
                  onProfessionalPress={handleProfessionalPress}
                  embedInParentScroll
                />
              </>
            )}
          </View>
        </ScrollView>
      </ScreenWithHeader>
    </View>
  );
};

export default CommunityScreen;
