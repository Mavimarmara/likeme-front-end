import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, HeroImage } from '@/components/ui/layout';
import { ToggleTabs } from '@/components/ui/tabs';
import { SecondaryButton } from '@/components/ui/buttons';
import { JoinCommunityCard, type JoinCommunity } from '@/components/sections/community';
import { ProductsList } from '@/components/sections/marketplace';
import { useAdvertiser, useProviderAds, useCommunities } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import type { ProviderChat } from '@/types/community';
import type { RootStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';
import { communityService } from '@/services';

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
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isAcademicExpanded, setIsAcademicExpanded] = useState(true);
  const [productsPage, setProductsPage] = useState(1);

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

  const { communities: rawCommunities, categories } = useCommunities({
    enabled: activeTab === 'communities',
    pageSize: 10,
  });

  const joinCommunities = useMemo((): JoinCommunity[] => {
    return rawCommunities.map((community) => {
      const category = categories.length > 0 ? categories[0] : undefined;
      return {
        id: community.communityId,
        title: community.displayName,
        badge: category?.name ?? 'Community',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      };
    });
  }, [rawCommunities, categories]);

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
                  {providerData.description ? (
                    <Text style={styles.descriptionText}>{providerData.description}</Text>
                  ) : null}
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
    </SafeAreaView>
  );
};

export default ProviderProfileScreen;
