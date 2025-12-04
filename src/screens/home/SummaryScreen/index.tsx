import React, { useMemo } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingMenu } from '@/components/ui/menu';
import { Header } from '@/components/ui/layout';
import { BackgroundWithGradient } from '@/assets';
import { useLogout, useCommunities } from '@/hooks';
import { mapCommunityToRecommendedCommunity, mapCommunityToOtherCommunity } from '@/utils/community/mappers';
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

// Removido - agora usando dados reais da API

const YOUR_COMMUNITY: YourCommunity = {
  id: '1',
  title: 'Where the Mind Comes to Rest',
  description: 'A community for those seeking balance between body, mind, and night. Here, we explore rituals and science.',
  membersCount: 20,
  newPostsCount: 1,
  posts: [
    {
      id: '1',
      userId: '1',
      content: 'As a sleep specialist, I\'m constantly emphasizing the vital role of sleep in our...',
      title: 'The Alarming Link Between Chronic Insomnia and Brain...',
      userName: 'Peter Parker',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      commentsCount: 20,
      likes: 0,
      comments: [],
      createdAt: new Date(),
    },
    {
      id: '2',
      userId: '2',
      content: 'Whats is your favorite part of your night routine?',
      title: 'Whats is your favorite part of your night routine?',
      userName: 'Jane Doe',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      commentsCount: 15,
      likes: 0,
      comments: [],
      createdAt: new Date(),
    },
  ],
};

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

// Removido - agora usando dados reais da API

const SummaryScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = navigation.getParent() ?? navigation;
  const { logout } = useLogout({ navigation });
  const handleLogout = logout;

  // Buscar comunidades da API
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

  // Mapear comunidades para RecommendedCommunity (primeiras 2)
  const recommendedCommunities = useMemo(() => {
    return rawCommunities
      .slice(0, 2)
      .map((community) => {
        // Usar a primeira categoria disponível ou undefined
        const category = categories.length > 0 ? categories[0] : undefined;
        return mapCommunityToRecommendedCommunity(community, category);
      });
  }, [rawCommunities, categories]);

  // Mapear comunidades para OtherCommunity (restantes)
  const otherCommunities = useMemo(() => {
    return rawCommunities
      .map((community) => {
        // Usar a primeira categoria disponível ou undefined
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
    // Adicionar navegação para detalhes do evento se necessário
  };

  const handleEventSave = (event: Event) => {
    console.log('Salvar evento:', event.id);
    // Adicionar lógica para salvar evento
  };

  const handleProductPress = (product: Product) => {
    console.log('Ver produto:', product.id);
    // Adicionar navegação para detalhes do produto se necessário
  };

  const handleProductLike = (product: Product) => {
    console.log('Curtir produto:', product.id);
    // Adicionar lógica para curtir produto
  };

  const handleRecommendedCommunityPress = (community: RecommendedCommunity) => {
    console.log('Comunidade recomendada pressionada:', community.id);
    // Adicionar navegação para detalhes da comunidade se necessário
  };

  const handleOtherCommunityPress = (community: OtherCommunity) => {
    console.log('Outra comunidade pressionada:', community.id);
    // Adicionar navegação para detalhes da comunidade se necessário
  };

  const handleSearchChange = (text: string) => {
    console.log('Buscar comunidades:', text);
    // Adicionar lógica de busca
  };

  const handleSearchPress = () => {
    console.log('Pesquisar comunidades');
    // Adicionar lógica de pesquisa
  };

  const handleFilterPress = () => {
    console.log('Abrir filtros de comunidades');
    // Adicionar lógica para abrir filtros
  };

  const handleProviderPress = (provider: Provider) => {
    console.log('Provider pressionado:', provider.id);
    // Adicionar navegação para detalhes do provider se necessário
  };

  const handleYourCommunityPress = (community: YourCommunity) => {
    console.log('Comunidade pressionada:', community.id);
    // Adicionar navegação para detalhes da comunidade se necessário
  };

  const handleYourCommunityPostPress = (post: Post) => {
    console.log('Post da comunidade pressionado:', post.id);
    // Adicionar navegação para detalhes do post se necessário
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
          <View style={styles.yourCommunitiesContainer}>
            <YourCommunitiesSection
              community={YOUR_COMMUNITY}
              onCommunityPress={handleYourCommunityPress}
              onPostPress={handleYourCommunityPostPress}
            />
          </View>
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

