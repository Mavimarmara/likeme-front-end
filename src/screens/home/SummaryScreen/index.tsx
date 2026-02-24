import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Alert, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { useFocusEffect } from '@react-navigation/native';
import { FloatingMenu } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { useCommunities, useSuggestedProducts, useMenuItems, useNotifications } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
// import {
//   mapCommunityToOtherCommunity,
//   mapCommunityPostToPost,
//   mapChannelsToEvents,
//   sortByDateObject,
// } from '@/utils';
import { communityService, storageService } from '@/services';
import {
  // NextEventsSection,
  // OtherCommunitiesSection,
  PopularProvidersSection,
  // YourCommunitiesSection,
  JoinCommunityCard,
  // type OtherCommunity,
  type Provider,
  // type YourCommunity,
  type JoinCommunity,
} from '@/components/sections/community';
import { ProductsCarousel, type Product } from '@/components/sections/product';
// TODO: Temporariamente desabilitados
// import { AnamnesisPromptCard } from '@/components/sections/anamnesis';
// import { AvatarSection } from '@/components/sections/avatar';
import type { CommunityFeedData } from '@/types/community';
// import type { Event } from '@/types/event';
// import type { Post } from '@/types';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const SummaryScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Summary', screenClass: 'SummaryScreen' });
  useNotifications();
  const { t } = useTranslation();
  const rootNavigation = navigation.getParent() ?? navigation;
  const [userAvatarUri, setUserAvatarUri] = useState<string | null>(null);
  // TODO: Temporariamente desabilitados
  // const [hasCompletedAnamnesis, setHasCompletedAnamnesis] = useState<boolean>(false);
  // const [hasAnyAnamnesisAnswers, setHasAnyAnamnesisAnswers] = useState<boolean>(false);
  // const { progress: _anamnesisProgress } = useAnamnesisProgress();
  // const { scores: anamnesisScores, refresh: refreshAnamnesisScores } = useAnamnesisScores();

  // useFocusEffect(
  //   useCallback(() => {
  //     refreshAnamnesisScores();
  //   }, [refreshAnamnesisScores]),
  // );

  useEffect(() => {
    const loadUser = async () => {
      const user = await storageService.getUser();
      setUserAvatarUri(user?.picture ?? null);
    };
    loadUser();
  }, []);

  const handleCartPress = () => {
    rootNavigation.navigate('Cart' as never);
  };

  const handleMenuPress = () => {
    rootNavigation.navigate('Profile' as never);
  };

  // TODO: Temporariamente desabilitados
  // const handleStartAnamnesis = () => {
  //   rootNavigation.navigate('Anamnesis' as never);
  // };
  // const handleAvatarSeeMore = () => {
  //   rootNavigation.navigate('AvatarProgress' as never);
  // };
  // const handleShareAvatar = async () => {
  //   try {
  //     const mindPct = anamnesisScores?.mentalPercentage || 0;
  //     const bodyPct = anamnesisScores?.physicalPercentage || 0;
  //     const message = t('avatar.shareMessage', {
  //       mindPercentage: mindPct,
  //       bodyPercentage: bodyPct,
  //     });
  //     await Share.share({ message });
  //   } catch (error) {
  //     console.log('Share cancelled or failed:', error);
  //   }
  // };

  // TODO: Temporariamente desabilitado
  // useEffect(() => {
  //   const checkAnamnesisStatus = async () => { ... };
  //   checkAnamnesisStatus();
  // }, []);

  const {
    communities: rawCommunities,
    categories,
    loading: _communitiesLoading,
  } = useCommunities({
    enabled: true,
    pageSize: 20,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
  });

  // const firstCommunity = rawCommunities.length > 0 ? rawCommunities[0] : null;

  // TODO: Temporariamente desabilitado (YourCommunitiesSection)
  // const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  // const [_loadingCommunityPosts, setLoadingCommunityPosts] = useState(false);
  const [popularProviders, setPopularProviders] = useState<Provider[]>([]);
  const [_loadingProviders, setLoadingProviders] = useState(false);
  // const [events, setEvents] = useState<Event[]>([]);

  const { products: recommendedProducts } = useSuggestedProducts({
    limit: 4,
    status: 'active',
    enabled: true,
  });

  // TODO: Temporariamente desabilitado
  // useEffect(() => {
  //   const loadEvents = async () => { ... };
  //   loadEvents();
  // }, []);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoadingProviders(true);

        const userFeedResponse = await communityService.getUserFeed({
          page: 1,
          limit: 50,
        });

        const isSuccess =
          userFeedResponse.success === true ||
          userFeedResponse.status === 'ok' ||
          userFeedResponse.data?.status === 'ok';

        let feedData: CommunityFeedData | undefined;
        if (userFeedResponse.data?.data) {
          feedData = userFeedResponse.data.data;
        } else if (userFeedResponse.data && 'posts' in userFeedResponse.data) {
          feedData = userFeedResponse.data as CommunityFeedData;
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
            } as Provider;
          })
          .filter((p): p is Provider => p !== null);

        setPopularProviders(providers);
      } catch (error) {
        console.error('Error loading providers:', error);
        setPopularProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    };

    if (rawCommunities.length > 0) {
      loadProviders();
    }
  }, [rawCommunities.length]);

  // TODO: Temporariamente desabilitado
  // const yourCommunity = useMemo((): YourCommunity | null => { ... }, [firstCommunity, communityPosts]);

  const joinCommunities = useMemo((): JoinCommunity[] => {
    return rawCommunities.map((community) => {
      const category = categories.length > 0 ? categories[0] : undefined;
      return {
        id: community.communityId,
        title: community.displayName,
        badge: category?.name || 'Community',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      };
    });
  }, [rawCommunities, categories]);

  // TODO: Temporariamente desabilitado
  // const otherCommunities = useMemo(() => {
  //   return rawCommunities.map((community) => {
  //     const category = categories.length > 0 ? categories[0] : undefined;
  //     return mapCommunityToOtherCommunity(community, category);
  //   });
  // }, [rawCommunities, categories]);

  const menuItems = useMenuItems(navigation);

  // TODO: Temporariamente desabilitados
  // const handleEventPress = (event: Event) => {};
  // const handleEventSave = (event: Event) => {};
  // const handleOtherCommunityPress = (community: OtherCommunity) => {};
  // const handleSearchChange = (text: string) => {};
  // const handleSearchPress = () => {};
  // const handleFilterPress = () => {};

  const handleProductPress = (product: Product) => {
    rootNavigation.navigate('ProductDetails', {
      productId: product.id,
    } as never);
  };

  const handleProductLike = (product: Product) => {
    console.log('Curtir produto:', product.id);
  };

  const handleProviderPress = (provider: Provider) => {
    console.log('Provider pressionado:', provider.id);
  };

  const handleJoinCommunity = useCallback(
    async (community: JoinCommunity) => {
      try {
        await communityService.joinCommunity(community.id);
        rootNavigation.navigate('Community' as never);
      } catch (error) {
        Alert.alert(t('common.error'), t('home.joinCommunityError'));
      }
    },
    [rootNavigation, t],
  );

  // TODO: Temporariamente desabilitados
  // const handleYourCommunityPress = (community: YourCommunity) => {};
  // const handleYourCommunityPostPress = (post: Post) => {};

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header
        showBackButton={false}
        showMenuWithAvatar
        onMenuPress={handleMenuPress}
        userAvatarUri={userAvatarUri}
        showCartButton={true}
        onCartPress={handleCartPress}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {joinCommunities.length > 0 && (
            <View style={styles.joinCommunityContainer}>
              <JoinCommunityCard communities={joinCommunities} onCommunityPress={handleJoinCommunity} />
            </View>
          )}
          {/* TODO: Temporariamente desabilitado
          {yourCommunity && (
            <View style={styles.yourCommunitiesContainer}>
              <YourCommunitiesSection
                community={yourCommunity}
                onCommunityPress={handleYourCommunityPress}
                onPostPress={handleYourCommunityPostPress}
              />
            </View>
          )}
          */}
          {/* TODO: Avatar e Anamnese temporariamente desabilitados
          {(hasAnyAnamnesisAnswers || hasCompletedAnamnesis) && (
            <View style={styles.avatarContainer}>
              <AvatarSection
                hasAnswers={hasAnyAnamnesisAnswers || hasCompletedAnamnesis}
                mindPercentage={anamnesisScores?.mentalPercentage || 0}
                bodyPercentage={anamnesisScores?.physicalPercentage || 0}
                onSharePress={handleShareAvatar}
                onSeeMorePress={handleAvatarSeeMore}
              />
            </View>
          )}
          {!hasCompletedAnamnesis && (
            <View style={styles.anamnesisPromptContainer}>
              <AnamnesisPromptCard onStartPress={handleStartAnamnesis} />
            </View>
          )}
          {!hasAnyAnamnesisAnswers && !hasCompletedAnamnesis && (
            <View style={styles.avatarContainer}>
              <AvatarSection
                hasAnswers={false}
                mindPercentage={0}
                bodyPercentage={0}
                onSeeMorePress={handleAvatarSeeMore}
              />
            </View>
          )}
          */}
          {/* TODO: Temporariamente desabilitados
          {events.length > 0 && (
            <View style={styles.eventsContainer}>
              <NextEventsSection events={events} onEventPress={handleEventPress} onEventSave={handleEventSave} />
            </View>
          )}
          */}
          {popularProviders.length > 0 && (
            <View style={styles.providersContainer}>
              <PopularProvidersSection providers={popularProviders} onProviderPress={handleProviderPress} />
            </View>
          )}
          {recommendedProducts.length > 0 && (
            <View style={styles.productsContainer}>
              <ProductsCarousel
                title={t('home.productsRecommended')}
                subtitle={t('home.discoverProducts')}
                products={recommendedProducts}
                onProductPress={handleProductPress}
                onProductLike={handleProductLike}
              />
            </View>
          )}
          {/* TODO: Temporariamente desabilitado
          <View style={styles.otherCommunitiesContainer}>
            <OtherCommunitiesSection
              communities={otherCommunities}
              onCommunityPress={handleOtherCommunityPress}
              onSearchChange={handleSearchChange}
              onSearchPress={handleSearchPress}
              onFilterPress={handleFilterPress}
            />
          </View>
          */}
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId='home' />
    </SafeAreaView>
  );
};

export default SummaryScreen;
