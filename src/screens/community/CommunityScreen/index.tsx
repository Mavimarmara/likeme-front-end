import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore - useNavigation pode não estar tipado corretamente
import { useNavigation } from '@react-navigation/native';
import { Toggle, SocialList, Community, ProgramsList, Program, LiveBannerData, Post } from '@/components/ui';
import postsService, { PaginatedPostsResponse } from '@/services/postsService';
import { styles } from './styles';

type CommunityMode = 'Social' | 'Programs';

const TOGGLE_OPTIONS: readonly [CommunityMode, CommunityMode] = ['Social', 'Programs'] as const;

// Dados mock de Live - substituir por dados reais da API
const mockLiveBanner: LiveBannerData = {
  id: '1',
  title: 'What are the main causes of daily stress? With Dr. John Peter',
  host: 'Dr. John Peter',
  status: 'Live Now',
  startTime: '08:15 pm',
  endTime: '10:00 pm',
  thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', // URL de exemplo
};

// Dados mock - substituir por dados reais da API
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

const CommunityScreen: React.FC = () => {
  // @ts-ignore
  const navigation = useNavigation();
  const [selectedMode, setSelectedMode] = useState<CommunityMode>('Social');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>();
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>();

  // Estados para posts
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar posts
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
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // Carregar posts quando a busca mudar ou quando mudar para modo Social
  useEffect(() => {
    if (selectedMode === 'Social') {
      loadPosts(1, searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedMode]);

  const handleCommunityPress = (community: Community) => {
    setSelectedCommunityId(community.id);
    // Aqui você pode adicionar lógica para exibir detalhes da comunidade
  };

  const handleProgramPress = (program: Program) => {
    setSelectedProgramId(program.id);
    // Aqui você pode adicionar lógica para exibir detalhes do programa
  };

  const handleModeSelect = (mode: CommunityMode) => {
    setSelectedMode(mode);
  };

  const handleLivePress = (live: LiveBannerData) => {
    // Aqui você pode adicionar lógica para navegar para a live
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
    // Aqui você pode adicionar lógica para abrir filtros
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
