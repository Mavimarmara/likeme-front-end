import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Toggle, Header } from '@/components/ui';
import { SocialList, ProgramsList, LiveBannerData } from '@/components/sections/community';
import { Product } from '@/components/sections/product';
import { Background } from '@/components/ui/layout';
import type { Event } from '@/types';
import type { Program, ProgramDetail } from '@/types/program';
import type { CommunityCategory } from '@/types/community';
import type { SolutionId, FilterCategoryResult } from '@/components/ui/modals';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import { useUserFeed, useCommunities, useCategories, useSuggestedProducts, useMenuItems } from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { mapCommunityToProgram } from '@/utils';
import { useAnalyticsScreen } from '@/analytics';

type CommunityMode = 'Social' | 'Programs';

const getToggleOptions = (t: (key: string) => string): readonly [CommunityMode, CommunityMode] =>
  [t('community.social') as CommunityMode, t('community.programs') as CommunityMode] as const;

const mockProgramDetails: ProgramDetail = {
  id: '1',
  name: 'The best sleep for an offline life',
  description:
    'This protocol establishes guidelines to promote a healthy work environment, prevent psychological distress, and provide appropriate support to those in need.',
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
          options: ['Bad sleep Habits', 'Insomnia', 'Medical Recommendation', "I'd like to learn more about sleep"],
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
          options: ['Bad sleep Habits', 'Insomnia', 'Medical Recommendation', "I'd like to learn more about sleep"],
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

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'CommunityList'>;
type Props = { navigation: NavigationProp };

const CommunityScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'CommunityList', screenClass: 'CommunityScreen' });
  const { t } = useTranslation();
  const toggleOptions = useMemo(() => getToggleOptions(t), [t]);
  const rootNavigation = navigation.getParent()?.getParent?.() ?? navigation.getParent();
  const [selectedMode, setSelectedMode] = useState<CommunityMode>('Social');
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [selectedSolutionIds, setSelectedSolutionIds] = useState<SolutionId[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCartPress = () => {
    rootNavigation?.navigate('Cart' as never);
  };

  const {
    communities: rawCommunities,
    loading: _communitiesLoading,
    loadingMore: _communitiesLoadingMore,
    error: _communitiesError,
    hasMore: _communitiesHasMore,
    loadMore: _loadMoreCommunities,
    refresh: _refreshCommunities,
    liveBanner,
    events,
  } = useCommunities({
    enabled: true,
    pageSize: 10,
    params: {
      sortBy: 'createdAt',
      includeDeleted: false,
    },
    loadLiveChannels: true,
  });

  const { categories } = useCategories({ enabled: true });

  const programs = useMemo(() => {
    return rawCommunities.map((community) => mapCommunityToProgram(community));
  }, [rawCommunities]);

  useEffect(() => {
    if (selectedMode === 'Programs' && !selectedProgramId && programs.length > 0) {
      setSelectedProgramId(programs[0].id);
    }
  }, [selectedMode, programs, selectedProgramId]);

  const feedFilterParams = useMemo(
    () => ({
      ...(selectedCategoryId != null && selectedCategoryId !== '' ? { categoryId: selectedCategoryId } : {}),
      ...(selectedSolutionIds.length > 0 ? { solutionIds: selectedSolutionIds } : {}),
    }),
    [selectedCategoryId, selectedSolutionIds],
  );

  const {
    posts,
    loading,
    loadingMore,
    error,
    hasMore: _hasMore,
    loadMore,
    search,
  } = useUserFeed({
    enabled: selectedMode === 'Social',
    searchQuery,
    params: feedFilterParams,
  });

  const handleProductPress = (product: Product) => {
    rootNavigation?.navigate('ProductDetails', { productId: product.id } as never);
  };

  const handleProductLike = (product: Product) => {
    console.log('Curtir produto:', product.id);
  };

  const { products: suggestedProducts } = useSuggestedProducts({
    limit: 4,
    status: 'active',
    enabled: true,
    categoryId: selectedCategoryId,
  });

  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'community');

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

  const handleFilterCategoryApply = (result: FilterCategoryResult) => {
    setSelectedCategoryId(result.categoryId ?? undefined);
    setSelectedSolutionIds(result.solutionIds);
  };

  const handleClearFilterCategory = () => {
    setSelectedCategoryId(undefined);
    setSelectedSolutionIds([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header showBackButton={false} showCartButton={true} onCartPress={handleCartPress} />
      <View style={styles.content}>
        <View style={styles.toggleContainer}>
          <Toggle<CommunityMode> options={toggleOptions} selected={selectedMode} onSelect={handleModeSelect} />
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
            events={events}
            onEventPress={handleEventPress}
            onEventSave={handleEventSave}
            products={suggestedProducts}
            onProductPress={handleProductPress}
            onProductLike={handleProductLike}
            selectedProgramId={selectedProgramId}
            onProgramPress={handleProgramPress}
            categories={categories}
            onCategorySelect={handleCategorySelect}
            selectedCategoryId={selectedCategoryId}
            selectedSolutionIds={selectedSolutionIds}
            onFilterCategoryApply={handleFilterCategoryApply}
            onClearFilterCategory={handleClearFilterCategory}
          />
        ) : (
          <ProgramsList
            programs={programs}
            programDetails={selectedProgramId === '1' ? mockProgramDetails : undefined}
            onProgramPress={handleProgramPress}
            selectedProgramId={selectedProgramId}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CommunityScreen;
