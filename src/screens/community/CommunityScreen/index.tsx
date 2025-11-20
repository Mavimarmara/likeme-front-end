import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Image, StyleSheet, Text, FlatList, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Toggle, SocialList, ProgramsList, LiveBannerData, Post, Header } from '@/components/ui';
import type { Community, Program } from '@/components/ui';
import communityService, { ApiPostsResponse } from '@/services/communityService';
import { AuthService } from '@/services';
import { BackgroundWithGradient } from '@/assets';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/navigation/CommunityStackNavigator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@/constants';

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

type SuggestedProduct = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  tag: string;
  image: string;
  likes: number;
};

const SUGGESTED_PRODUCTS: SuggestedProduct[] = [
  {
    id: '1',
    title: 'Omega 3. Sleep suplement',
    subtitle: 'Products recommended for your sleep journey',
    price: 99.5,
    tag: 'Sleep better',
    image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800',
    likes: 10,
  },
  {
    id: '2',
    title: 'Smart lamp',
    subtitle: 'Create the perfect ambience to rest',
    price: 352,
    tag: 'On sale',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800',
    likes: 10,
  },
  {
    id: '3',
    title: 'Herbal tea kit',
    subtitle: 'Relaxing flavors curated by experts',
    price: 64,
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc5a?w=800',
    likes: 8,
  },
  {
    id: '4',
    title: 'Weighted blanket',
    subtitle: 'Improve sleep quality with comfort',
    price: 210,
    tag: 'Best seller',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
    likes: 18,
  },
];

const PAGE_SIZE = 10;

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'CommunityList'>;
type Props = { navigation: NavigationProp };

const CommunityScreen: React.FC<Props> = ({ navigation }) => {
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
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const { width: windowWidth } = useWindowDimensions();

  const productSlides = useMemo(() => {
    const slides: SuggestedProduct[][] = [];
    for (let i = 0; i < SUGGESTED_PRODUCTS.length; i += 2) {
      slides.push(SUGGESTED_PRODUCTS.slice(i, i + 2));
    }
    return slides;
  }, []);
  
  const hasLoadedInitially = useRef(false);
  const previousSearchQuery = useRef<string>('');
  const previousMode = useRef<CommunityMode>('Social');
  const isLoadingRef = useRef(false);
  const hasErrorRef = useRef(false);

  const loadPosts = useCallback(
    async (page: number, search?: string, append: boolean = false) => {
      if (isLoadingRef.current) {
        return;
      }

      try {
        isLoadingRef.current = true;
        hasErrorRef.current = false;
        
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const response: ApiPostsResponse = await communityService.getPublicPosts({
          page,
          limit: PAGE_SIZE,
          search: search || undefined,
        });

        if (append) {
          setPosts((prev) => [...prev, ...response.data.posts]);
        } else {
          setPosts(response.data.posts);
        }

        setCurrentPage(page);
        setHasMore(response.data.pagination.hasMore);
      } catch (err) {
        hasErrorRef.current = true;
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao carregar posts';
        setError(errorMessage);
        setHasMore(false);
        
        if (page === 1) {
          setPosts([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    if (selectedMode !== 'Social') {
      return;
    }

    if (isLoadingRef.current) {
      return;
    }

    const searchChanged = previousSearchQuery.current !== searchQuery;
    const modeChanged = previousMode.current !== selectedMode;
    
    const shouldLoad = !hasLoadedInitially.current || searchChanged || modeChanged;
    
    if (shouldLoad) {
      hasLoadedInitially.current = true;
      previousSearchQuery.current = searchQuery;
      previousMode.current = selectedMode;
      hasErrorRef.current = false;
      
      if (searchChanged || modeChanged) {
        setCurrentPage(1);
        setHasMore(true);
      }
      loadPosts(1, searchQuery);
    }
  }, [searchQuery, selectedMode]);

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
  };

  const handleSearchPress = useCallback(() => {
    if (selectedMode === 'Social') {
      setCurrentPage(1);
      setHasMore(true);
      previousSearchQuery.current = searchQuery;
      hasLoadedInitially.current = false;
      loadPosts(1, searchQuery);
    }
  }, [searchQuery, selectedMode, loadPosts]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && !loading && selectedMode === 'Social') {
      loadPosts(currentPage + 1, searchQuery, true);
    }
  }, [currentPage, hasMore, loadingMore, loading, searchQuery, selectedMode, loadPosts]);

  const handleFilterPress = () => {
    console.log('Abrir filtros');
  };

  const handleLogout = useCallback(async () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              // Navegar para a tela Unauthenticated no RootNavigator
              const rootNavigation = navigation.getParent() || navigation;
              rootNavigation.reset({
                index: 0,
                routes: [{ name: 'Unauthenticated' as never }],
              });
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          },
        },
      ]
    );
  }, [navigation]);

  const handleProductsMomentumEnd = useCallback(
    (event: any) => {
      const { contentOffset, layoutMeasurement } = event.nativeEvent;
      if (!layoutMeasurement?.width) {
        return;
      }
      const index = Math.round(contentOffset.x / layoutMeasurement.width);
      setActiveProductSlide(index);
    },
    []
  );

  const renderSuggestedProducts = () => {
    const slideWidth = Math.max(windowWidth - 48, 0);

    const formatPrice = (price: number) => `$${price.toFixed(2)}`;

    return (
      <View style={styles.suggestedSection}>
        <Text style={styles.suggestedOverline}>Suggestions from providers</Text>
        <Text style={styles.suggestedTitle}>
          Products recommended for your sleep journey by Dr. Peter Valasquez
        </Text>
        <Text style={styles.suggestedDescription}>
          Discover our options selected just for you
        </Text>

        <FlatList
          data={productSlides}
          keyExtractor={(_, index) => `product-slide-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleProductsMomentumEnd}
          renderItem={({ item }) => (
            <View style={[styles.productSlide, { width: slideWidth }]}>
              {item.map((product, index) => (
                <View
                  key={product.id}
                  style={[
                    styles.productCardWrapper,
                    index === item.length - 1 && styles.productCardWrapperLast,
                  ]}
                >
                  <View style={styles.productCard}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <View style={styles.productTag}>
                      <Text style={styles.productTagText}>{product.tag}</Text>
                    </View>
                    <View style={styles.productInfoRow}>
                      <Text style={styles.productPrice}>
                        {formatPrice(product.price)}
                      </Text>
                      <View style={styles.productLikes}>
                        <Icon name="favorite-border" size={16} color={COLORS.WHITE} />
                        <Text style={styles.productLikesText}>{product.likes}</Text>
                      </View>
                    </View>
                    <Text style={styles.productName}>{product.title}</Text>
                    <Text style={styles.productSubtitleText}>{product.subtitle}</Text>
                    <TouchableOpacity
                      style={styles.productActionButton}
                      activeOpacity={0.8}
                      onPress={() => console.log('Ver produto', product.id)}
                    >
                      <Icon name="arrow-forward" size={18} color={COLORS.TEXT} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {item.length === 1 && <View style={styles.productCardPlaceholder} />}
            </View>
          )}
        />

        <View style={styles.sliderIndicators}>
          {productSlides.map((_, index) => (
            <View
              key={`indicator-${index}`}
              style={[
                styles.sliderIndicator,
                activeProductSlide === index && styles.sliderIndicatorActive,
              ]}
            />
          ))}
        </View>
      </View>
    );
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
            onSearchPress={handleSearchPress}
            onLoadMore={handleLoadMore}
            onFilterPress={handleFilterPress}
            footerComponent={renderSuggestedProducts()}
          />
        ) : (
          <ProgramsList
            programs={mockPrograms}
            onProgramPress={handleProgramPress}
            selectedProgramId={selectedProgramId}
          />
        )}
        {selectedMode === 'Programs' && renderSuggestedProducts()}
      </View>
    </SafeAreaView>
  );
};

export default CommunityScreen;
