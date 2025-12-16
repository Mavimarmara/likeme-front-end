import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Toggle, SocialList, ProgramsList, LiveBannerData, Header, ProductsCarousel, Product, PlansCarousel, Plan, ProviderChat } from '@/components/ui';
import { FloatingMenu } from '@/components/ui/menu';
import type { Post, Event } from '@/types';
import type { Program, ProgramDetail } from '@/types/program';
import type { CommunityCategory } from '@/types/community';
import { BackgroundWithGradient } from '@/assets';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import { useUserFeed, useCommunities } from '@/hooks';
import { mapFiltersToFeedParams } from '@/utils/community/filterMapper';
import { mapCommunityToProgram } from '@/utils/community/mappers';
import { communityService } from '@/services';
import type { CommunityFeedData } from '@/types/community';

type CommunityMode = 'Social' | 'Programs';

const TOGGLE_OPTIONS: readonly [CommunityMode, CommunityMode] = ['Social', 'Programs'] as const;


const mockProgramDetails: ProgramDetail = {
  id: '1',
  name: 'The best sleep for an offline life',
  description: 'This protocol establishes guidelines to promote a healthy work environment, prevent psychological distress, and provide appropriate support to those in need.',
  duration: '30 dias',
  participantsCount: 450,
  modules: [
    {
      id: '1',
      title: 'Module 1',
      isCompleted: true,
      content: [
        {
          id: '1.1',
          type: 'video',
          title: '1.1 Content',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          duration: '3 minutes vídeo',
        },
      ],
      activities: [
        {
          id: '1.2',
          type: 'survey',
          title: '1.2 Activity',
          question: 'What motivated you to purchase this protocol?',
          options: [
            'Bad sleep Habits',
            'Insomnia',
            'Medical Recommendation',
            "I'd like to learn more about sleep",
          ],
          isSubmitted: true,
        },
      ],
    },
    {
      id: '2',
      title: 'Module 2',
      isCompleted: true,
    },
    {
      id: '3',
      title: 'Module 3',
      isCompleted: false,
      content: [
        {
          id: '3.1',
          type: 'video',
          title: '1.1 Content',
          thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          duration: '3 minutes vídeo',
        },
      ],
      activities: [
        {
          id: '3.2',
          type: 'survey',
          title: '1.2 Activity',
          question: 'What motivated you to purchase this protocol?',
          options: [
            'Bad sleep Habits',
            'Insomnia',
            'Medical Recommendation',
            "I'd like to learn more about sleep",
          ],
          isSubmitted: false,
        },
      ],
    },
    {
      id: '4',
      title: 'Module 4',
      isCompleted: false,
    },
    {
      id: '5',
      title: 'Module 5',
      isCompleted: false,
    },
    {
      id: '6',
      title: 'Module 6',
      isCompleted: false,
    },
  ],
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

const SUGGESTED_PRODUCTS: Product[] = [
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

const SUGGESTED_PLANS: Plan[] = [
  {
    id: '1',
    title: 'Strategies to relax in your day to day',
    price: 130.99,
    tag: 'Curated for you',
    tagColor: 'orange',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    likes: 10,
    currency: 'BRL',
  },
  {
    id: '2',
    title: 'How to evolve to a deep sleep',
    price: 5.99,
    tag: 'Marker based',
    tagColor: 'green',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    likes: 10,
    currency: 'BRL',
  },
  {
    id: '3',
    title: 'Lorem ipsum dolor sit amet, consectetur',
    price: 0,
    tag: '',
    tagColor: 'default',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
    likes: 10,
    currency: 'BRL',
  },
];

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'CommunityList'>;
type Props = { navigation: NavigationProp };

import type { FilterType } from '@/components/ui/modals/FilterModal';

const CommunityScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = navigation.getParent()?.getParent?.() ?? navigation.getParent();
  const [selectedMode, setSelectedMode] = useState<CommunityMode>('Social');
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<FilterType>({});

  const handleCartPress = () => {
    rootNavigation?.navigate('Cart' as never);
  };

  const {
    communities: rawCommunities,
    categories,
    loading: communitiesLoading,
    loadingMore: communitiesLoadingMore,
    error: communitiesError,
    hasMore: communitiesHasMore,
    loadMore: loadMoreCommunities,
    refresh: refreshCommunities,
  } = useCommunities({
    enabled: true,
    pageSize: 10,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
  });

  const programs = useMemo(() => {
    return rawCommunities.map((community) => mapCommunityToProgram(community));
  }, [rawCommunities]);

  useEffect(() => {
    if (selectedMode === 'Programs' && !selectedProgramId && programs.length > 0) {
      setSelectedProgramId(programs[0].id);
    }
  }, [selectedMode, programs, selectedProgramId]);

  const feedFilterParams = useMemo(
    () => mapFiltersToFeedParams(selectedFilters),
    [selectedFilters]
  );

  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    search,
  } = useUserFeed({
    enabled: selectedMode === 'Social',
    searchQuery,
    params: feedFilterParams,
  });

  const handleProductPress = (product: Product) => {
    console.log('Ver produto:', product.id);
  };

  const handleProductLike = (product: Product) => {
    console.log('Curtir produto:', product.id);
  };

  const handlePlanPress = (plan: Plan) => {
    console.log('Ver plano:', plan.id);
  };

  const handlePlanLike = (plan: Plan) => {
    console.log('Curtir plano:', plan.id);
  };

  const [providerChat, setProviderChat] = useState<ProviderChat | undefined>(undefined);
  const [liveBanner, setLiveBanner] = useState<LiveBannerData | undefined>(undefined);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        const [liveAndBroadcastChannelsResponse, communityChannelsResponse] = await Promise.all([
          communityService.getChannels({ types: ['live', 'broadcast'] }),
          communityService.getChannels({ types: 'community' }),
        ]);

        if (liveAndBroadcastChannelsResponse.success && liveAndBroadcastChannelsResponse.data?.channels) {
          const liveAndBroadcastChannels = liveAndBroadcastChannelsResponse.data.channels;
          if (liveAndBroadcastChannels.length > 0) {
            const firstChannel = liveAndBroadcastChannels[0];
            const metadata = firstChannel.metadata || {};
            const thumbnail = (metadata.thumbnailUrl as string) || 
              (firstChannel.avatarFileId ? undefined : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400');
            
            setLiveBanner({
              id: firstChannel.channelId,
              title: (metadata.title as string) || firstChannel.displayName || 'Live Session',
              host: (metadata.host as string) || 'Host',
              status: 'Live Now' as const,
              startTime: (metadata.startTime as string) || '08:00 pm',
              endTime: (metadata.endTime as string) || '10:00 pm',
              thumbnail,
            });
          } else {
            setLiveBanner(undefined);
          }
        } else {
          setLiveBanner(undefined);
        }

        if (communityChannelsResponse.success && communityChannelsResponse.data?.channels) {
          const communityChannels = communityChannelsResponse.data.channels;
          if (communityChannels.length > 0) {
            const firstCommunityChannel = communityChannels[0];
            const metadata = firstCommunityChannel.metadata || {};
            const avatarUrl = (metadata.avatarUrl as string) || undefined;
            
            setProviderChat({
              id: firstCommunityChannel.channelId,
              providerName: firstCommunityChannel.displayName || (metadata.displayName as string) || 'Provider',
              providerAvatar: avatarUrl,
              lastMessage: (metadata.lastMessage as string) || 'Hello! How can I help you today?',
              timestamp: (metadata.timestamp as string) || 'Now',
              unreadCount: (metadata.unreadCount as number) || 0,
            });
          } else {
            setProviderChat(undefined);
          }
        } else {
          setProviderChat(undefined);
        }
      } catch (error) {
        console.error('Error loading channels:', error);
        setLiveBanner(undefined);
        setProviderChat(undefined);
      }
    };

    loadChannels();
  }, []);


  const menuItems = useMemo(
    () => [
      {
        id: 'activities',
        icon: 'fitness-center',
        label: 'Atividades',
        fullLabel: 'Atividades',
        onPress: () => rootNavigation?.navigate('Activities' as never),
      },
      {
        id: 'marketplace',
        icon: 'store',
        label: 'Marketplace',
        fullLabel: 'Marketplace',
        onPress: () => rootNavigation?.navigate('Marketplace' as never),
      },
      {
        id: 'community',
        icon: 'group',
        label: 'Comunidade',
        fullLabel: 'Comunidade',
        onPress: () => rootNavigation?.navigate('Community' as never),
      },
      {
        id: 'profile',
        icon: 'person',
        label: 'Perfil',
        fullLabel: 'Perfil',
        onPress: () => rootNavigation?.navigate('Profile' as never),
      },
    ],
    [rootNavigation]
  );

  const MARKER_ID = '__MARKER__';

  const handleProgramPress = (program: Program | null) => {
    if (program === null) {
      setSelectedProgramId(undefined);
    } else {
      setSelectedProgramId(program.id);
      setSelectedCategoryId(undefined);
    }
  };

  const handleCategorySelect = (category: CommunityCategory | null) => {
    if (category === null) {
      setSelectedCategoryId(undefined);
    } else {
      setSelectedCategoryId(category.categoryId);
      setSelectedProgramId(undefined);
    }
  };

  const handleModeSelect = (mode: CommunityMode) => {
    setSelectedMode(mode);
  };

  const handleLivePress = (live: LiveBannerData) => {
    console.log('Navegar para live:', live.id);
  };

  const handleEventPress = (event: Event) => {
    console.log('Navegar para evento:', event.id);
  };

  const handleEventSave = (event: Event) => {
    console.log('Salvar evento:', event.id);
  };

  const handleProviderChatPress = (chat: ProviderChat) => {
    navigation.navigate('ChatScreen', { chat });
  };


  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleSearchPress = useCallback(() => {
    if (selectedMode === 'Social') {
      search(searchQuery);
    }
  }, [searchQuery, selectedMode, search]);

  const handleLoadMore = useCallback(() => {
    if (selectedMode === 'Social') {
      loadMore();
    }
  }, [selectedMode, loadMore]);

  const handleFilterPress = () => {
    console.log('Abrir filtros');
  };

  const handleFilterSave = (filters: FilterType) => {
    setSelectedFilters(filters);
    console.log('Filtros salvos:', filters);
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
        showCartButton={true}
        onCartPress={handleCartPress}
      />
      <View style={styles.content}>
        <View style={styles.toggleContainer}>
          <Toggle<CommunityMode>
            options={TOGGLE_OPTIONS}
            selected={selectedMode}
            onSelect={handleModeSelect}
          />
        </View>
        
        {selectedMode === 'Social' ? (
          <SocialList
            programs={programs}
            liveBanner={liveBanner}
            onLivePress={handleLivePress}
            posts={posts}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSearchPress={handleSearchPress}
            onLoadMore={handleLoadMore}
            onFilterPress={handleFilterPress}
            onFilterSave={handleFilterSave}
            selectedFilters={selectedFilters}
            events={mockEvents}
            onEventPress={handleEventPress}
            onEventSave={handleEventSave}
            providerChat={providerChat}
            onProviderChatPress={handleProviderChatPress}
            products={SUGGESTED_PRODUCTS}
            onProductPress={handleProductPress}
            onProductLike={handleProductLike}
            plans={SUGGESTED_PLANS}
            onPlanPress={handlePlanPress}
            onPlanLike={handlePlanLike}
            selectedProgramId={selectedProgramId}
            onProgramPress={handleProgramPress}
            categories={categories}
            onCategorySelect={handleCategorySelect}
            selectedCategoryId={selectedCategoryId}
          />
        ) : (
          <ProgramsList
            programs={programs}
            programDetails={
              selectedProgramId === '1' ? mockProgramDetails : undefined
            }
            onProgramPress={handleProgramPress}
            selectedProgramId={selectedProgramId}
          />
        )}
      </View>
      <FloatingMenu items={menuItems} selectedId="community" />
    </SafeAreaView>
  );
};

export default CommunityScreen;
