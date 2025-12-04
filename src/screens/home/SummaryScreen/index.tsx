import React, { useMemo, useState, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingMenu } from '@/components/ui/menu';
import { Header } from '@/components/ui/layout';
import { BackgroundWithGradient } from '@/assets';
import { useLogout, useCommunities } from '@/hooks';
import { mapCommunityToRecommendedCommunity, mapCommunityToOtherCommunity, mapCommunityPostToPost } from '@/utils/community/mappers';
import { communityService } from '@/services';
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
} from '@/components/ui/community';
import { ProductsCarousel, type Product } from '@/components/ui/carousel';
import type { Event } from '@/types/event';
import type { Post } from '@/types';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Home Mobility Challenge',
    date: '04 June',
    time: '08:30 am',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    participants: [
      { id: '1', name: 'A', color: 'Green' },
      { id: '2', name: 'B', color: 'Blue' },
      { id: '3', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    ],
    participantsCount: 8,
  },
  {
    id: '2',
    title: 'Trail Run - United State',
    date: '05 June',
    time: '06:30 am',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    participants: [
      { id: '1', name: 'A', color: 'Green' },
      { id: '2', name: 'B', color: 'Pink' },
      { id: '3', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    ],
    participantsCount: 25,
  },
  {
    id: '3',
    title: 'Yoga Session - Morning Flow',
    date: '06 June',
    time: '07:00 am',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    participants: [
      { id: '1', name: 'A', color: 'Blue' },
      { id: '2', name: 'B', color: 'Light Pink' },
      { id: '3', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    ],
    participantsCount: 15,
  },
];

const RECOMMENDED_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Omega 3. Sleep suplement',
    price: 99.5,
    tag: 'Sleep better',
    image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800',
    likes: 10,
  },
  {
    id: '2',
    title: 'Smart lamp',
    price: 352,
    tag: 'On sale',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800',
    likes: 10,
  },
  {
    id: '3',
    title: 'Weigh Blanket',
    price: 55.2,
    tag: 'Sleep better',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
    likes: 10,
  },
  {
    id: '4',
    title: 'Herbal tea kit',
    price: 64,
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc5a?w=800',
    likes: 8,
  },
];


const POPULAR_PROVIDERS: Provider[] = [
  {
    id: '1',
    name: 'Dr. Peter Valasquez',
    avatar: 'https://www.figma.com/api/mcp/asset/dd9ac2c0-fc98-4b47-ba4a-56e643324cd5',
  },
  {
    id: '2',
    name: 'Dr. Jane Cruz',
    avatar: 'https://www.figma.com/api/mcp/asset/9017a127-1ef5-4885-aa01-e2194957dba5',
  },
  {
    id: '3',
    name: 'Dr. Adriana Pereira',
    avatar: 'https://www.figma.com/api/mcp/asset/9b700b53-ebcb-4899-ac38-0bb12b5ef8d3',
  },
  {
    id: '4',
    name: 'Dr. John Peter',
    avatar: 'https://www.figma.com/api/mcp/asset/4541fe6b-cf8d-48fc-95a5-112f4a3b5bf6',
  },
  {
    id: '5',
    name: 'Dr. John Simons',
    avatar: 'https://www.figma.com/api/mcp/asset/f2552740-e3d3-4909-bfff-7406d8f927fb',
  },
];

const SummaryScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = navigation.getParent() ?? navigation;
  const { logout } = useLogout({ navigation });
  const handleLogout = logout;

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

        const isSuccess = userFeedResponse.success === true || 
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
          return communityPost.targetId === firstCommunity.communityId && 
                 communityPost.targetType === 'community';
        });

        const mappedPostsPromises = filteredCommunityPosts.map((communityPost) =>
          mapCommunityPostToPost(
            communityPost, 
            feedData.files, 
            feedData.users, 
            feedData.comments
          )
        );
        
        const mappedPostsResults = await Promise.all(mappedPostsPromises);
        const mappedPosts: Post[] = mappedPostsResults.filter((post): post is Post => post !== null);

        const sortedPosts = [...mappedPosts].sort((a, b) => {
          return b.createdAt.getTime() - a.createdAt.getTime();
        });

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
    return rawCommunities
      .slice(0, 2)
      .map((community) => {
        const category = categories.length > 0 ? categories[0] : undefined;
        return mapCommunityToRecommendedCommunity(community, category);
      });
  }, [rawCommunities, categories]);

  const otherCommunities = useMemo(() => {
    return rawCommunities
      .map((community) => {
        const category = categories.length > 0 ? categories[0] : undefined;
        return mapCommunityToOtherCommunity(community, category);
      });
  }, [rawCommunities, categories]);

  const menuItems = useMemo(
    () => [
      {
        id: 'activities',
        icon: 'fitness-center',
        label: 'Atividades',
        fullLabel: 'Atividades',
        onPress: () => rootNavigation.navigate('Activities' as never),
      },
      {
        id: 'marketplace',
        icon: 'store',
        label: 'Marketplace',
        fullLabel: 'Marketplace',
        onPress: () => rootNavigation.navigate('Marketplace' as never),
      },
      {
        id: 'community',
        icon: 'group',
        label: 'Comunidade',
        fullLabel: 'Comunidade',
        onPress: () => rootNavigation.navigate('Community' as never),
      },
      {
        id: 'profile',
        icon: 'person',
        label: 'Perfil',
        fullLabel: 'Perfil',
        onPress: () => rootNavigation.navigate('Profile' as never),
      },
    ],
    [rootNavigation]
  );

  const handleEventPress = (event: Event) => {
    console.log('Evento pressionado:', event.id);
  };

  const handleEventSave = (event: Event) => {
    console.log('Salvar evento:', event.id);
  };

  const handleProductPress = (product: Product) => {
    console.log('Ver produto:', product.id);
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
      <Image
        source={BackgroundWithGradient}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <Header 
        showBackButton={false} 
        showLogoutButton={true}
        onLogoutPress={handleLogout}
      />
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {yourCommunity && (
            <View style={styles.yourCommunitiesContainer}>
              <YourCommunitiesSection
                community={yourCommunity}
                onCommunityPress={handleYourCommunityPress}
                onPostPress={handleYourCommunityPostPress}
              />
            </View>
          )}
          <View style={styles.eventsContainer}>
            <NextEventsSection
              events={mockEvents}
              onEventPress={handleEventPress}
              onEventSave={handleEventSave}
            />
          </View>
          <View style={styles.providersContainer}>
            <PopularProvidersSection
              providers={POPULAR_PROVIDERS}
              onProviderPress={handleProviderPress}
            />
          </View>
          <View style={styles.productsContainer}>
            <ProductsCarousel
              title="Products recommended for your sleep journey by Dr. Peter Valasquez"
              subtitle="Discover our options selected just for you"
              products={RECOMMENDED_PRODUCTS}
              onProductPress={handleProductPress}
              onProductLike={handleProductLike}
            />
          </View>
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

