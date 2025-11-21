import React, { useState, useCallback, useMemo } from 'react';
import { View, Image, StyleSheet, Text, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Toggle, SocialList, ProgramsList, LiveBannerData, Header } from '@/components/ui';
import type { Program } from '@/components/ui';
import type { Post, Event } from '@/types';
import { BackgroundWithGradient } from '@/assets';
import { styles } from './styles';
import type { CommunityStackParamList } from '@/types/navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@/constants';
import { useUserFeed, useLogout } from '@/hooks';

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

type NavigationProp = StackNavigationProp<CommunityStackParamList, 'CommunityList'>;
type Props = { navigation: NavigationProp };

const CommunityScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedMode, setSelectedMode] = useState<CommunityMode>('Social');
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProductSlide, setActiveProductSlide] = useState(0);
  const { width: windowWidth } = useWindowDimensions();

  const { logout } = useLogout({ navigation });
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
  });

  const productSlides = useMemo(() => {
    const slides: SuggestedProduct[][] = [];
    for (let i = 0; i < SUGGESTED_PRODUCTS.length; i += 2) {
      slides.push(SUGGESTED_PRODUCTS.slice(i, i + 2));
    }
    return slides;
  }, []);

  const handleProgramPress = (program: Program) => {
    setSelectedProgramId(program.id);
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

  const handleFilterPress = () => {
    console.log('Abrir filtros');
  };

  const handleLogout = logout;

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
            liveBanner={mockLiveBanner}
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
            footerComponent={renderSuggestedProducts()}
            events={mockEvents}
            onEventPress={handleEventPress}
            onEventSave={handleEventSave}
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
