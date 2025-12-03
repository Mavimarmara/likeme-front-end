import React, { useMemo } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { FloatingMenu } from '@/components/ui/menu';
import { 
  NextEventsSection,
  RecommendedCommunitiesSection,
  OtherCommunitiesSection,
  type RecommendedCommunity,
  type OtherCommunity,
} from '@/components/ui/community';
import { ProductsCarousel, type Product } from '@/components/ui/carousel';
import type { Event } from '@/types/event';
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

const RECOMMENDED_COMMUNITIES: RecommendedCommunity[] = [
  {
    id: '1',
    title: 'Sports to make you smile every day',
    badge: 'To reduce stress',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
  },
  {
    id: '2',
    title: 'The Dreamy Nights Community',
    badge: 'To improve sleep',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  },
];

const OTHER_COMMUNITIES: OtherCommunity[] = [
  {
    id: '1',
    title: 'Where balance begins\nin your gut',
    badge: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=400',
    rating: 5,
    price: '$65.54',
  },
  {
    id: '2',
    title: 'Steady heart,\nsteady mind',
    badge: 'Keep mooving',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400',
    rating: 5,
    price: '$56.99',
  },
  {
    id: '3',
    title: 'Know your rhythm,\nown your flow',
    badge: 'Oral Health',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    rating: 5,
    price: '$20.00',
  },
  {
    id: '4',
    title: 'Mornings made\nfor clarity',
    badge: 'To reduce stress',
    image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc5a?w=400',
    rating: 5,
    price: '$36.50',
  },
  {
    id: '5',
    title: 'Hormones in harmony',
    badge: 'To reduce stress',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    rating: 5,
    price: '$100.00',
  },
];

const SummaryScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = navigation.getParent() ?? navigation;

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.eventsContainer}>
          <NextEventsSection
            events={mockEvents}
            onEventPress={handleEventPress}
            onEventSave={handleEventSave}
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
            communities={RECOMMENDED_COMMUNITIES}
            onCommunityPress={handleRecommendedCommunityPress}
          />
        </View>
        <View style={styles.otherCommunitiesContainer}>
          <OtherCommunitiesSection
            communities={OTHER_COMMUNITIES}
            onCommunityPress={handleOtherCommunityPress}
            onSearchChange={handleSearchChange}
          />
        </View>
      </ScrollView>
      <FloatingMenu items={menuItems} selectedId="home" />
    </SafeAreaView>
  );
};

export default SummaryScreen;

