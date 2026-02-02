import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FloatingMenu } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import {
  useCommunities,
  useSuggestedProducts,
  useMenuItems,
  useAnamnesisProgress,
  useAnamnesisScores,
} from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import {
  mapCommunityToRecommendedCommunity,
  mapCommunityToOtherCommunity,
  mapCommunityPostToPost,
  mapChannelsToEvents,
  sortByDateObject,
} from '@/utils';
import { communityService, storageService, anamnesisService, userService } from '@/services';
import type { Channel } from '@/types/community';
import type { CommunityFeedData } from '@/types/community';
import {
  NextEventsSection,
  RecommendedCommunitiesSection,
  OtherCommunitiesSection,
  PopularProvidersSection,
  YourCommunitiesSection,
  type RecommendedCommunity,
  type OtherCommunity,
  type Provider,
  type YourCommunity,
} from '@/components/sections/community';
import { ProductsCarousel, type Product } from '@/components/sections/product';
import { AnamnesisPromptCard } from '@/components/sections/anamnesis';
import { AvatarSection } from '@/components/sections/avatar';
import type { Event } from '@/types/event';
import type { Post } from '@/types';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const SummaryScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Summary', screenClass: 'SummaryScreen' });
  const { t } = useTranslation();
  const rootNavigation = navigation.getParent() ?? navigation;
  const [hasCompletedAnamnesis, setHasCompletedAnamnesis] = useState<boolean>(false);
  const [hasAnyAnamnesisAnswers, setHasAnyAnamnesisAnswers] = useState<boolean>(false);
  const { progress: anamnesisProgress } = useAnamnesisProgress();
  const { scores: anamnesisScores, refresh: refreshAnamnesisScores } = useAnamnesisScores();

  useFocusEffect(
    useCallback(() => {
      refreshAnamnesisScores();
    }, [refreshAnamnesisScores])
  );

  const handleCartPress = () => {
    rootNavigation.navigate('Cart' as never);
  };

  const handleStartAnamnesis = () => {
    rootNavigation.navigate('Anamnesis' as never);
  };

  const handleAvatarSeeMore = () => {
    rootNavigation.navigate('AvatarProgress' as never);
  };

  const handleShareAvatar = async () => {
    try {
      const mindPct = anamnesisScores?.mentalPercentage || 0;
      const bodyPct = anamnesisScores?.physicalPercentage || 0;
      const message = t('avatar.shareMessage', { mindPercentage: mindPct, bodyPercentage: bodyPct });
      await Share.share({
        message,
      });
    } catch (error) {
      // Usuário cancelou ou erro no compartilhamento
      console.log('Share cancelled or failed:', error);
    }
  };

  useEffect(() => {
    const checkAnamnesisStatus = async () => {
      try {
        const profileResponse = await userService.getProfile();
        const userId = profileResponse.success ? profileResponse.data?.id : null;

        let hasAnswers = false;
        if (userId) {
          const answersResponse = await anamnesisService.getUserAnswers({ userId });
          hasAnswers = answersResponse.success && (answersResponse.data?.length || 0) > 0;
          setHasAnyAnamnesisAnswers(hasAnswers);
        } else {
          setHasAnyAnamnesisAnswers(false);
        }

        const anamnesisCompletedAt = await storageService.getAnamnesisCompletedAt();
        // Se o backend não tem respostas, considerar não concluído e limpar o flag local
        // (ex.: respostas foram removidas no banco; usuário pode refazer a anamnese)
        if (!hasAnswers) {
          await storageService.setAnamnesisCompletedAt(null);
          setHasCompletedAnamnesis(false);
        } else if (anamnesisCompletedAt) {
          // Se tem flag de completado, validar se realmente todas as seções estão completas
          try {
            const completionStatus = await anamnesisService.getCompletionStatus();
            if (completionStatus.allSectionsComplete) {
              setHasCompletedAnamnesis(true);
            } else {
              // Tem respostas mas não completou todas as seções - limpar flag
              await storageService.setAnamnesisCompletedAt(null);
              setHasCompletedAnamnesis(false);
            }
          } catch (err) {
            console.error('Error checking completion status:', err);
            // Em caso de erro, manter o flag local
            setHasCompletedAnamnesis(true);
          }
        } else {
          setHasCompletedAnamnesis(false);
        }
      } catch (error) {
        console.error('Error checking anamnesis status:', error);
        setHasCompletedAnamnesis(false);
        setHasAnyAnamnesisAnswers(false);
      }
    };

    checkAnamnesisStatus();
  }, []);

  const {
    communities: rawCommunities,
    categories,
    loading: communitiesLoading,
  } = useCommunities({
    enabled: true,
    pageSize: 20,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
  });

  const firstCommunity = rawCommunities.length > 0 ? rawCommunities[0] : null;

  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  const [loadingCommunityPosts, setLoadingCommunityPosts] = useState(false);
  const [popularProviders, setPopularProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const { products: recommendedProducts } = useSuggestedProducts({
    limit: 4,
    status: 'active',
    enabled: true,
  });

  useEffect(() => {
    if (!firstCommunity) {
      setCommunityPosts([]);
      return;
    }

    const loadCommunityPosts = async () => {
      try {
        setLoadingCommunityPosts(true);
        const userFeedResponse = await communityService.getUserFeed({
          page: 1,
          limit: 20,
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
          setCommunityPosts([]);
          return;
        }

        const filteredCommunityPosts = (feedData.posts || []).filter((communityPost) => {
          return (
            communityPost.targetId === firstCommunity.communityId &&
            communityPost.targetType === 'community'
          );
        });

        const mappedPostsPromises = filteredCommunityPosts.map((communityPost) =>
          mapCommunityPostToPost(communityPost, feedData.files, feedData.users, feedData.comments)
        );

        const mappedPostsResults = await Promise.all(mappedPostsPromises);
        const mappedPosts: Post[] = mappedPostsResults.filter(
          (post): post is Post => post !== null
        );

        const sortedPosts = sortByDateObject(mappedPosts, 'createdAt', 'desc');

        setCommunityPosts(sortedPosts);
      } catch (error) {
        console.error('Error loading community posts:', error);
        setCommunityPosts([]);
      } finally {
        setLoadingCommunityPosts(false);
      }
    };

    loadCommunityPosts();
  }, [firstCommunity?.communityId]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await communityService.getChannels({ types: ['live', 'broadcast'] });
        if (response.success && response.data?.channels) {
          const mappedEvents = mapChannelsToEvents(response.data.channels);
          setEvents(mappedEvents);
        } else {
          setEvents([]);
        }
      } catch (error) {
        // Error handling
        setEvents([]);
      }
    };

    loadEvents();
  }, []);

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

  const yourCommunity = useMemo((): YourCommunity | null => {
    if (!firstCommunity) {
      return null;
    }

    const recentPosts = communityPosts.slice(0, 5);

    const newPostsCount = communityPosts.filter((post) => {
      const postDate = post.createdAt;
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return postDate > oneDayAgo;
    }).length;

    return {
      id: firstCommunity.communityId,
      title: firstCommunity.displayName,
      description: firstCommunity.description || '',
      membersCount: firstCommunity.membersCount || 0,
      newPostsCount,
      posts: recentPosts,
    };
  }, [firstCommunity, communityPosts]);

  const recommendedCommunities = useMemo(() => {
    return rawCommunities.slice(0, 2).map((community) => {
      const category = categories.length > 0 ? categories[0] : undefined;
      return mapCommunityToRecommendedCommunity(community, category);
    });
  }, [rawCommunities, categories]);

  const otherCommunities = useMemo(() => {
    return rawCommunities.map((community) => {
      const category = categories.length > 0 ? categories[0] : undefined;
      return mapCommunityToOtherCommunity(community, category);
    });
  }, [rawCommunities, categories]);

  const menuItems = useMenuItems(navigation);

  const handleEventPress = (event: Event) => {
    console.log('Evento pressionado:', event.id);
  };

  const handleEventSave = (event: Event) => {
    console.log('Salvar evento:', event.id);
  };

  const handleProductPress = (product: Product) => {
    rootNavigation.navigate('ProductDetails', {
      productId: product.id,
    } as never);
  };

  const handleProductLike = (product: Product) => {
    console.log('Curtir produto:', product.id);
  };

  const handleRecommendedCommunityPress = (community: RecommendedCommunity) => {
    console.log('Comunidade recomendada pressionada:', community.id);
    rootNavigation.navigate('Community' as never);
  };

  const handleOtherCommunityPress = (community: OtherCommunity) => {
    console.log('Outra comunidade pressionada:', community.id);
    rootNavigation.navigate('Community' as never);
  };

  const handleSearchChange = (text: string) => {
    console.log('Buscar comunidades:', text);
  };

  const handleSearchPress = () => {
    console.log('Pesquisar comunidades');
  };

  const handleFilterPress = () => {
    console.log('Abrir filtros de comunidades');
  };

  const handleProviderPress = (provider: Provider) => {
    console.log('Provider pressionado:', provider.id);
  };

  const handleYourCommunityPress = (community: YourCommunity) => {
    console.log('Comunidade pressionada:', community.id);
  };

  const handleYourCommunityPostPress = (post: Post) => {
    rootNavigation.navigate('Community' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header showBackButton={false} showCartButton={true} onCartPress={handleCartPress} />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Avatar sempre aparece se tem respostas ou se completou */}
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
          {/* Card de prompt só aparece se não completou */}
          {!hasCompletedAnamnesis && (
            <View style={styles.anamnesisPromptContainer}>
              <AnamnesisPromptCard onStartPress={handleStartAnamnesis} />
            </View>
          )}
          {yourCommunity && (
            <View style={styles.yourCommunitiesContainer}>
              <YourCommunitiesSection
                community={yourCommunity}
                onCommunityPress={handleYourCommunityPress}
                onPostPress={handleYourCommunityPostPress}
              />
            </View>
          )}
          {/* Avatar vazio só se não tem respostas e não completou */}
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
          {events.length > 0 && (
            <View style={styles.eventsContainer}>
              <NextEventsSection
                events={events}
                onEventPress={handleEventPress}
                onEventSave={handleEventSave}
              />
            </View>
          )}
          {popularProviders.length > 0 && (
            <View style={styles.providersContainer}>
              <PopularProvidersSection
                providers={popularProviders}
                onProviderPress={handleProviderPress}
              />
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
          <View style={styles.communitiesContainer}>
            <RecommendedCommunitiesSection
              communities={recommendedCommunities}
              onCommunityPress={handleRecommendedCommunityPress}
            />
          </View>
          <View style={styles.otherCommunitiesContainer}>
            <OtherCommunitiesSection
              communities={otherCommunities}
              onCommunityPress={handleOtherCommunityPress}
              onSearchChange={handleSearchChange}
              onSearchPress={handleSearchPress}
              onFilterPress={handleFilterPress}
            />
          </View>
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId="home" />
    </SafeAreaView>
  );
};

export default SummaryScreen;
