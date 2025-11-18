import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Toggle, SocialList, ProgramsList, LiveBannerData, Post } from '@/components/ui';
import type { Community, Program } from '@/components/ui';
import postsService, { PaginatedPostsResponse } from '@/services/postsService';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/navigation/CommunityStackNavigator';

type CommunityMode = 'Social' | 'Programs';

const TOGGLE_OPTIONS: readonly [CommunityMode, CommunityMode] = ['Social', 'Programs'] as const;

const mockLiveBanner: LiveBannerData = {
  id: '1',
  title: 'What are the main causes of daily stress? With Dr. John Peter',
  host: 'Dr. John Peter',
  status: 'Live Now',
  startTime: '08:15 pm',
  endTime: '10:00 pm',
  thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
};

const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Comunidade de Bem-Estar',
    description: 'Uma comunidade dedicada ao bem-estar físico e mental',
    membersCount: 1250,
  },
  {
    id: '2',
    name: 'Fitness & Saúde',
    description: 'Compartilhe suas rotinas de exercícios e dicas de saúde',
    membersCount: 890,
  },
  {
    id: '3',
    name: 'Mindfulness',
    description: 'Práticas de meditação e atenção plena',
    membersCount: 650,
  },
];

const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'Programa de 30 Dias',
    description: 'Um programa completo de transformação em 30 dias',
    duration: '30 dias',
    participantsCount: 450,
  },
  {
    id: '2',
    name: 'Desafio Semanal',
    description: 'Desafios semanais para melhorar sua qualidade de vida',
    duration: '7 dias',
    participantsCount: 320,
  },
  {
    id: '3',
    name: 'Programa Anual',
    description: 'Acompanhamento completo durante todo o ano',
    duration: '365 dias',
    participantsCount: 180,
  },
];

const PAGE_SIZE = 10;

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'CommunityList'>;

const CommunityScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMode, setSelectedMode] = useState<CommunityMode>('Social');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>();
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const hasLoadedInitially = useRef(false);
  const previousSearchQuery = useRef<string>('');
  const previousMode = useRef<CommunityMode>('Social');

  const loadPosts = useCallback(
    async (page: number, search?: string, append: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response: PaginatedPostsResponse = await postsService.getPosts({
          page,
          pageSize: PAGE_SIZE,
          search: search || undefined,
        });

        if (append) {
          setPosts((prev) => [...prev, ...response.data]);
        } else {
          setPosts(response.data);
        }

        setCurrentPage(page);
        setHasMore(response.pagination.hasMore);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar posts';
        setError(errorMessage);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    if (selectedMode !== 'Social') {
      return;
    }

    const searchChanged = previousSearchQuery.current !== searchQuery;
    const modeChanged = previousMode.current !== selectedMode;
    
    if (!hasLoadedInitially.current || searchChanged || modeChanged) {
      hasLoadedInitially.current = true;
      previousSearchQuery.current = searchQuery;
      previousMode.current = selectedMode;
      
      if (searchChanged || modeChanged) {
        setCurrentPage(1);
        setHasMore(true);
      }
      loadPosts(1, searchQuery);
    }
  }, [searchQuery, selectedMode, loadPosts]);

  const handleCommunityPress = (community: Community) => {
    setSelectedCommunityId(community.id);
  };

  const handleProgramPress = (program: Program) => {
    setSelectedProgramId(program.id);
  };

  const handleModeSelect = (mode: CommunityMode) => {
    setSelectedMode(mode);
  };

  const handleLivePress = (live: LiveBannerData) => {
    console.log('Navegar para live:', live.id);
  };

  const handlePostPress = (post: Post) => {
    navigation.navigate('PostDetails', { post });
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading && selectedMode === 'Social') {
      loadPosts(currentPage + 1, searchQuery, true);
    }
  }, [currentPage, hasMore, loadingMore, loading, searchQuery, selectedMode, loadPosts]);

  const handleFilterPress = () => {
    console.log('Abrir filtros');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Toggle<CommunityMode>
          options={TOGGLE_OPTIONS}
          selected={selectedMode}
          onSelect={handleModeSelect}
        />
        
        {selectedMode === 'Social' ? (
          <SocialList
            communities={mockCommunities}
            onCommunityPress={handleCommunityPress}
            selectedCommunityId={selectedCommunityId}
            liveBanner={mockLiveBanner}
            onLivePress={handleLivePress}
            posts={posts}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            searchQuery={searchQuery}
            onPostPress={handlePostPress}
            onSearchChange={handleSearchChange}
            onLoadMore={handleLoadMore}
            onFilterPress={handleFilterPress}
          />
        ) : (
          <ProgramsList
            programs={mockPrograms}
            onProgramPress={handleProgramPress}
            selectedProgramId={selectedProgramId}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CommunityScreen;
