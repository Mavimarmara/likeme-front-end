import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeroImage, ScreenWithHeader } from '@/components/ui/layout';
import { ToggleTabs } from '@/components/ui/tabs';
import { SecondaryButton } from '@/components/ui/buttons';
import { JoinCommunityCard, type JoinCommunity } from '@/components/sections/community';
import { AdsList } from '@/components/sections/marketplace';
import { useAdvertiser, useProviderAds, useCommunities } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import type { RootStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';
import { communityService, advertiserService } from '@/services';
import type { AdvertiserProfile } from '@/types/ad';

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
  const { providerId, provider: providerFromParams } = route.params;
  const [activeTab, setActiveTab] = useState<'about' | 'communities'>('about');
  const [_isFavorite, _setIsFavorite] = useState(false);
  const [expandedSectionIds, setExpandedSectionIds] = useState<Set<string>>(new Set());
  const [productsPage, setProductsPage] = useState(1);
  const [profiles, setProfiles] = useState<AdvertiserProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

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
        console.error('Error loading advertiser profiles:', error);
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

  const positioningProfile = useMemo(
    () => profiles.find((profile) => profile.key === 'profile.positioning'),
    [profiles],
  );

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

  const { communities: rawCommunities, categories } = useCommunities({
    enabled: activeTab === 'communities',
    pageSize: 10,
  });

  const joinCommunities = useMemo((): JoinCommunity[] => {
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
    async (community: JoinCommunity) => {
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
    (rootNavigation as any).navigate('Chat', {
      screen: 'Chat',
      params: {
        targetAdvertiserId: providerId,
        channelName: providerData.name,
        channelAvatar: providerData.avatar,
        initialMessage: t('marketplace.chatInitialMessage'),
      },
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
          <HeroImage
            imageUri={providerData.avatar}
            name={providerData.name}
            title={providerData.title || undefined}
            badges={providerData.specialties}
          />
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

                <View style={styles.talkButtonContainer}>
                  <SecondaryButton
                    label={t('marketplace.talkToProvider', { provider: providerData.name })}
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
                <Text style={styles.communitiesSectionTitle}>{t('marketplace.curatedSpecialty')}</Text>
                <JoinCommunityCard communities={joinCommunities} onCommunityPress={handleJoinCommunity} />
                <View style={styles.talkButtonContainer}>
                  <SecondaryButton
                    label={t('marketplace.talkToProvider', { provider: providerData.name })}
                    onPress={handleTalkToProvider}
                    icon='arrow-forward'
                    iconPosition='right'
                    style={styles.talkButton}
                  />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </ScreenWithHeader>
  );
};

export default ProviderProfileScreen;
