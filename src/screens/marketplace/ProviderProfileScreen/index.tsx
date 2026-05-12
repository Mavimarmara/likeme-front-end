import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, Image } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeroImage, ScreenWithHeader } from '@/components/ui/layout';
import { ToggleTabs } from '@/components/ui/tabs';
import { IconButton, SecondaryButton } from '@/components/ui/buttons';
import { EmptyState } from '@/components/ui/feedback';
import type { ButtonCarouselOption } from '@/components/ui/carousel';
import { JoinCard, type JoinCardItem } from '@/components/ui/cards';
import { AdsList } from '@/components/sections/marketplace';
import { Product } from '@/components/sections/product';
import {
  useAdvertiser,
  useAdvertisers,
  useProviderAds,
  useCommunities,
  useFeatureFlag,
  useMenuItems,
  useSuggestedProducts,
  SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
} from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import type { RootStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';
import { styles as communityShopListStyles } from '@/components/sections/community/ShoppingList/styles';
import { communityService, advertiserService } from '@/services';
import type { Advertiser, AdvertiserProfile } from '@/types/ad';
import { COLORS, FEATURE_FLAGS } from '@/constants';
import { DEFAULT_MARKETPLACE_SORT_ORDER, type MarketplaceSortOrderId } from '@/constants/marketplaceSortOrder';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { logger } from '@/utils/logger';
import { buildAdvertiserContactButtons, type AdvertiserContactButton } from '@/utils/advertiser/contactButtons';
import { formatAdvertiserDocumentsLine } from '@/utils/advertiser/documents';
import { getMarketplaceSortOptions } from '@/utils/marketplace/sortOptions';
import { sortShopProductsByMarketplaceOrder } from '@/utils/marketplace/sorting';

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

const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'ProviderProfile', screenClass: 'ProviderProfileScreen' });
  const { t } = useTranslation();
  const { isEnabled: isChatEnabled } = useFeatureFlag(FEATURE_FLAGS.CHAT_ENABLED);
  const { providerId, provider: providerFromParams } = route.params;
  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'marketplace');
  const [activeTab, setActiveTab] = useState<'about' | 'communities'>('about');
  const [_isFavorite, _setIsFavorite] = useState(false);
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(new Set());
  const [productsPage, setProductsPage] = useState(1);
  const [profiles, setProfiles] = useState<AdvertiserProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [communityShopSortOrder, setCommunityShopSortOrder] =
    useState<MarketplaceSortOrderId>(DEFAULT_MARKETPLACE_SORT_ORDER);

  const toggleSection = useCallback((profileId: string) => {
    setExpandedSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(profileId)) next.delete(profileId);
      else next.add(profileId);
      return next;
    });
  }, []);

  const {
    ads: providerAds,
    loading: loadingAds,
    hasMore: hasMoreAds,
    loadAds: loadProviderAds,
  } = useProviderAds({
    advertiserId: providerId || undefined,
    page: productsPage,
    limit: 20,
  });

  React.useEffect(() => {
    setProductsPage(1);
  }, [providerId]);

  React.useEffect(() => {
    if (providerId) loadProviderAds();
  }, [providerId, productsPage, loadProviderAds]);

  React.useEffect(() => {
    const loadProfiles = async () => {
      if (!providerId) return;
      setLoadingProfiles(true);
      try {
        const response = await advertiserService.getAdvertiserProfiles(providerId, 'pt-BR');
        if (response.success && response.data?.profiles) {
          setProfiles(response.data.profiles);
        } else {
          setProfiles([]);
        }
      } catch (error) {
        logger.error('[ProviderProfileScreen] Erro ao carregar perfis do anunciante', error);
        setProfiles([]);
      } finally {
        setLoadingProfiles(false);
      }
    };

    loadProfiles();
  }, [providerId]);

  const { advertiser, loading: loadingProvider } = useAdvertiser({
    advertiserId: providerId || undefined,
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

  const contactButtons = useMemo(() => buildAdvertiserContactButtons(advertiser?.contacts), [advertiser?.contacts]);

  const positioningProfile = useMemo(
    () => profiles.find((profile) => profile.key === 'profile.positioning'),
    [profiles],
  );

  const heroTitle = providerData?.description || undefined;
  const documentsLine = useMemo(() => formatAdvertiserDocumentsLine(advertiser?.documents), [advertiser?.documents]);

  const visibleProfiles = useMemo(
    () =>
      profiles.filter(
        (profile) =>
          profile.key !== 'profile.positioning' &&
          profile.key !== 'profile.categories' &&
          profile.key !== 'profile.mainImage',
      ),
    [profiles],
  );

  const hasProfileSections = visibleProfiles.length > 0;

  React.useEffect(() => {
    if (visibleProfiles.length > 0) {
      setExpandedSectionIds(new Set([visibleProfiles[0].id]));
    } else {
      setExpandedSectionIds(new Set());
    }
  }, [visibleProfiles]);

  const rootNavigation = navigation.getParent() ?? navigation;

  const loadCommunityShop = activeTab === 'communities';
  const providerCommunityId = advertiser?.communityId?.trim() ?? '';

  const { advertisers: communityShopAdvertisers } = useAdvertisers({
    communityId: loadCommunityShop && providerCommunityId ? providerCommunityId : undefined,
  });

  const communityShopProfessionals = useMemo(() => {
    const filtered = communityShopAdvertisers.filter((a) => a.id !== providerId);
    const seen = new Set<string>();
    return filtered.filter((a) => {
      if (!a.id || seen.has(a.id)) {
        return false;
      }
      seen.add(a.id);
      return true;
    });
  }, [communityShopAdvertisers, providerId]);

  const { products: communityShopProducts } = useSuggestedProducts({
    ...SUGGESTED_PRODUCTS_HOME_ACTIVITIES_DEFAULTS,
    enabled: loadCommunityShop,
  });
  const { products: communityShopServices } = useSuggestedProducts({
    limit: 20,
    status: 'active',
    enabled: loadCommunityShop,
    type: 'service',
  });
  const { products: communityShopPrograms } = useSuggestedProducts({
    limit: 20,
    status: 'active',
    enabled: loadCommunityShop,
    type: PRODUCT_CATALOG_TYPE.PROGRAM,
  });

  const mergeCommunityShopTags = useCallback((primaryTag: string, product: Product): string[] => {
    const combinedTags = [primaryTag, ...(product.tags ?? []), product.tag].filter(Boolean);
    return combinedTags.filter((tag, index) => combinedTags.indexOf(tag) === index);
  }, []);

  const communityShopCatalogFlat = useMemo(() => {
    if (!loadCommunityShop) {
      return [];
    }
    const productsTagged = (communityShopProducts ?? []).map((p) => ({
      ...p,
      tag: t('filterCategory.solutions.products'),
      tags: mergeCommunityShopTags(t('filterCategory.solutions.products'), p),
    }));
    const servicesTagged = (communityShopServices ?? []).map((p) => ({
      ...p,
      tag: t('filterCategory.solutions.services'),
      tags: mergeCommunityShopTags(t('filterCategory.solutions.services'), p),
    }));
    const programsTagged = (communityShopPrograms ?? []).map((p) => ({
      ...p,
      tag: t('filterCategory.solutions.programs'),
      tags: mergeCommunityShopTags(t('filterCategory.solutions.programs'), p),
    }));
    const merged = [...productsTagged, ...servicesTagged, ...programsTagged];
    const seenIds = new Set<string>();
    return merged.filter((item) => {
      if (!item.id || seenIds.has(item.id)) {
        return false;
      }
      seenIds.add(item.id);
      return true;
    });
  }, [
    loadCommunityShop,
    communityShopProducts,
    communityShopServices,
    communityShopPrograms,
    mergeCommunityShopTags,
    t,
  ]);

  const communityShopCatalogSorted = useMemo(
    () => sortShopProductsByMarketplaceOrder(communityShopCatalogFlat, communityShopSortOrder),
    [communityShopCatalogFlat, communityShopSortOrder],
  );

  const communityShopOrderOptions: ButtonCarouselOption<string>[] = useMemo(() => getMarketplaceSortOptions(t), [t]);

  const handleCommunityShopProductPress = useCallback(
    (product: Product) => {
      rootNavigation.navigate('ProductDetails', { productId: product.id } as never);
    },
    [rootNavigation],
  );

  const handleCommunityShopProfessionalPress = useCallback(
    (professional: Advertiser) => {
      rootNavigation.navigate('ProviderProfile', { providerId: professional.id } as never);
    },
    [rootNavigation],
  );

  const { communities: rawCommunities, categories } = useCommunities({
    enabled: activeTab === 'communities',
    pageSize: 10,
  });

  const joinCommunities = useMemo((): JoinCardItem[] => {
    const targetCommunityId = advertiser?.communityId?.trim();
    if (!targetCommunityId) {
      return [];
    }

    const filteredCommunities = rawCommunities.filter((community) => community.communityId === targetCommunityId);

    return filteredCommunities.map((community) => {
      const category = categories.length > 0 ? categories[0] : undefined;
      return {
        id: community.communityId,
        title: community.displayName,
        badge: category?.name ?? 'Community',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      };
    });
  }, [rawCommunities, categories, advertiser]);

  const handleJoinCommunity = useCallback(
    async (community: JoinCardItem) => {
      try {
        await communityService.joinCommunity(community.id);
        rootNavigation.navigate('Community' as never);
      } catch {
        Alert.alert(t('common.error'), t('home.joinCommunityError'));
      }
    },
    [rootNavigation, t],
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleTalkToProvider = () => {
    if (!providerData) return;
    if (!isChatEnabled) {
      Alert.alert('Chat indisponivel', 'Esta funcionalidade esta desativada no momento.');
      return;
    }

    (rootNavigation as any).navigate('Chat', {
      screen: 'ChatConversation',
      params: {
        targetAdvertiserId: providerId,
        channelName: providerData.name,
        channelAvatar: providerData.avatar,
        initialMessage: t('marketplace.chatInitialMessage'),
      },
    });
  };

  const handleContactPress = (contactButton: AdvertiserContactButton) => {
    Linking.openURL(contactButton.url).catch((error: Error) => {
      logger.error('[ProviderProfileScreen] Erro ao abrir contato do provider', {
        providerId,
        contactType: contactButton.contact.type,
        cause: error,
      });
    });
  };

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{ showBackButton: true, onBackPress: handleBackPress }}
      contentContainerStyle={styles.container}
    >
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
          <HeroImage imageUri={providerData.avatar} badges={[t('marketplace.specialistLabel')]}>
            <View style={styles.heroContent}>
              <View style={styles.heroTextGroup}>
                {heroTitle ? <Text style={styles.heroTitle}>{heroTitle}</Text> : null}
                <Text style={styles.heroName}>{providerData.name}</Text>
                {documentsLine ? <Text style={styles.heroDocuments}>{documentsLine}</Text> : null}
              </View>
            </View>
          </HeroImage>
          <View style={styles.content}>
            <View style={styles.tabsContainer}>
              <ToggleTabs
                tabs={[
                  { id: 'about', label: t('marketplace.about') },
                  { id: 'communities', label: t('marketplace.myCommunities') },
                ]}
                selectedId={activeTab}
                onSelect={(id) => setActiveTab(id as 'about' | 'communities')}
              />
            </View>
            {activeTab === 'about' && contactButtons.length > 0 ? (
              <View style={styles.contactButtonsRow}>
                {contactButtons.map((contactButton, index) => {
                  const ContactIcon = contactButton.IconComponent;
                  return (
                    <IconButton
                      key={`${contactButton.contact.type}-${contactButton.contact.value}-${index}`}
                      onPress={() => handleContactPress(contactButton)}
                      {...(ContactIcon
                        ? { iconElement: <ContactIcon width={contactButton.size} height={contactButton.size} /> }
                        : { icon: contactButton.materialIcon ?? 'link', iconSize: contactButton.size })}
                      variant='dark'
                      backgroundSize='medium'
                      containerStyle={styles.contactIconButtonContainer}
                    />
                  );
                })}
              </View>
            ) : null}

            {activeTab === 'about' && (
              <>
                <View style={styles.aboutSection}>
                  {positioningProfile && (
                    <View style={styles.highlightContainer}>
                      <Text style={styles.highlightQuote}>{`“${positioningProfile.value}”`}</Text>
                      <Text style={styles.highlightSubtitle}>Conheça meu impacto dentro dos pilares Like:Me</Text>
                    </View>
                  )}
                  {loadingProfiles && <Text style={styles.descriptionText}>{t('common.loading')}</Text>}
                  {!loadingProfiles && !hasProfileSections && providerData.description && (
                    <Text style={styles.descriptionText}>{providerData.description}</Text>
                  )}
                  {!loadingProfiles &&
                    visibleProfiles.map((profile) => {
                      const isExpanded = expandedSectionIds.has(profile.id);
                      const sectionTitle = profile.title || profile.key || '';
                      return (
                        <View key={profile.id} style={styles.profileSection}>
                          <TouchableOpacity
                            style={styles.sectionHeader}
                            onPress={() => toggleSection(profile.id)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
                            <Icon
                              name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                              size={24}
                              color='#001137'
                            />
                          </TouchableOpacity>
                          {isExpanded && <Text style={styles.descriptionText}>{profile.value}</Text>}
                        </View>
                      );
                    })}
                </View>

                <AdsList
                  navigation={navigation}
                  ads={providerAds}
                  loading={loadingAds}
                  hasMore={hasMoreAds}
                  onLoadMore={() => setProductsPage((p) => p + 1)}
                  title={t('marketplace.allProducts')}
                />

                {isChatEnabled && (
                  <View style={styles.talkButtonContainer}>
                    <SecondaryButton
                      label={t('marketplace.talkToProvider', { provider: providerData.name })}
                      onPress={handleTalkToProvider}
                      icon='arrow-forward'
                      iconPosition='right'
                      style={styles.talkButton}
                    />
                  </View>
                )}
              </>
            )}

            {activeTab === 'communities' && (
              <View style={styles.communityPreviewContainer}>
                <Text style={styles.communitiesSectionTitle}>{t('marketplace.curatedSpecialty')}</Text>
                <JoinCard items={joinCommunities} onItemPress={handleJoinCommunity} />
                {communityShopCatalogSorted.length > 0 ? (
                  <AdsList
                    products={communityShopCatalogSorted}
                    onProductPress={(item) => handleCommunityShopProductPress(item as Product)}
                    orderOptions={communityShopOrderOptions}
                    selectedOrder={communityShopSortOrder}
                    onOrderSelect={(id) => setCommunityShopSortOrder(id as MarketplaceSortOrderId)}
                  />
                ) : null}
                {communityShopProfessionals.length > 0 ? (
                  <View style={communityShopListStyles.list}>
                    {communityShopProfessionals.map((prof) => (
                      <View key={prof.id} style={communityShopListStyles.professionalCardWrapper}>
                        <View style={communityShopListStyles.professionalCardContent}>
                          {prof.logo ? (
                            <Image
                              source={{ uri: prof.logo }}
                              style={communityShopListStyles.professionalAvatar}
                              resizeMode='cover'
                            />
                          ) : (
                            <View style={communityShopListStyles.professionalAvatarPlaceholder}>
                              <Icon name='person' size={32} color={COLORS.NEUTRAL.LOW.MEDIUM} />
                            </View>
                          )}
                          <View style={communityShopListStyles.professionalInfo}>
                            <Text style={communityShopListStyles.professionalName} numberOfLines={1}>
                              {prof.name ?? ''}
                            </Text>
                            {prof.description ? (
                              <Text style={communityShopListStyles.professionalProfession} numberOfLines={1}>
                                Especialista
                              </Text>
                            ) : null}
                          </View>
                          <SecondaryButton
                            label={t('community.viewProfile')}
                            onPress={() => handleCommunityShopProfessionalPress(prof)}
                            size='medium'
                            style={communityShopListStyles.professionalViewProfileButton}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                ) : null}
                {communityShopCatalogSorted.length === 0 &&
                communityShopProfessionals.length === 0 &&
                loadCommunityShop ? (
                  <View style={communityShopListStyles.emptySection}>
                    <EmptyState
                      title={t('marketplace.noAdsFound')}
                      description={t('marketplace.noAdsFoundDescription')}
                      iconName='storefront'
                    />
                  </View>
                ) : null}
                {isChatEnabled && (
                  <View style={styles.talkButtonContainer}>
                    <SecondaryButton
                      label={t('marketplace.talkToProvider', { provider: providerData.name })}
                      onPress={handleTalkToProvider}
                      icon='arrow-forward'
                      iconPosition='right'
                      style={styles.talkButton}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </ScreenWithHeader>
  );
};

export default ProviderProfileScreen;
