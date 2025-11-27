import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from '@/components/ui/inputs';
import { FloatingMenu } from '@/components/ui/menu';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

const HERO_STATS = [
  { id: 'rating', value: '4.9', label: 'Avaliação média' },
  { id: 'products', value: '120+', label: 'Produtos premium' },
  { id: 'delivery', value: '24h', label: 'Entrega rápida' },
] as const;

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'sleep', label: 'Sono' },
  { id: 'nutrition', label: 'Nutrição' },
  { id: 'mind', label: 'Mindfulness' },
  { id: 'body', label: 'Corpo' },
  { id: 'accessories', label: 'Acessórios' },
] as const;

const TRENDING_PRODUCTS = [
  {
    id: '1',
    title: 'Kit Sono Profundo',
    price: 'R$ 249,00',
    rating: 4.8,
    reviews: 86,
    category: 'sleep',
    badge: 'Mais amado',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
  },
  {
    id: '2',
    title: 'Blend Calm & Focus',
    price: 'R$ 189,90',
    rating: 4.6,
    reviews: 54,
    category: 'mind',
    badge: 'Curadoria médica',
    image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=400',
  },
  {
    id: '3',
    title: 'Journal Habit Tracker',
    price: 'R$ 89,00',
    rating: 4.9,
    reviews: 142,
    category: 'mind',
    badge: 'Novo',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
  },
  {
    id: '4',
    title: 'Tapete de Alinhamento',
    price: 'R$ 329,00',
    rating: 4.7,
    reviews: 63,
    category: 'body',
    badge: 'Coleção limitada',
    image: 'https://images.unsplash.com/photo-1526404079165-74e4230b3109?w=400',
  },
] as const;

const CURATED_BUNDLES = [
  {
    id: 'bundle-1',
    title: 'Protocolo Energia & Foco',
    description: 'Suplementos + planner guiado',
    price: 'R$ 389,00',
  },
  {
    id: 'bundle-2',
    title: 'Sono Restaurador 30 dias',
    description: 'Aromaterapia + app + terapia da luz',
    price: 'R$ 529,00',
  },
  {
    id: 'bundle-3',
    title: 'Mindfulness Starter',
    description: 'Workshops + journal + playlist exclusiva',
    price: 'R$ 299,00',
  },
] as const;

type MarketplaceScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Marketplace'>;
};

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return TRENDING_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.title.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity style={styles.sectionAction}>
        <Text style={styles.sectionActionText}>Ver todos</Text>
        <Icon name="chevron-right" size={18} color="#001137" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Marketplace</Text>
          </View>
          <Text style={styles.heroTitle}>Curadoria para o seu bem-estar diário</Text>
          <Text style={styles.heroSubtitle}>
            Produtos selecionados por especialistas para acompanhar cada fase da sua jornada.
          </Text>

          <View style={styles.heroStatsRow}>
            {HERO_STATS.map((stat) => (
              <View key={stat.id} style={styles.heroStatCard}>
                <Text style={styles.heroStatValue}>{stat.value}</Text>
                <Text style={styles.heroStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.searchWrapper}>
          <SearchBar
            placeholder="Buscar suplementos, terapias, acessórios..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearchPress={() => {}}
          />
        </View>

        <View style={styles.filtersHint}>
          <Icon name="auto-awesome" size={16} color="#001137" />
          <Text style={styles.filtersHintText}>Dica: combine filtros e descubra protocolos completos.</Text>
        </View>

        {renderSectionHeader('Categorias')}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {CATEGORIES.map((category) => {
            const isSelected = category.id === selectedCategory;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.featuredCard}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredEyebrow}>Protocolo recomendado</Text>
            <Text style={styles.featuredTitle}>Sono profundo + energização matinal</Text>
            <Text style={styles.featuredDescription}>
              Combine terapia da luz, suplementos adaptógenos e rotinas de respiração guiada.
            </Text>
            <View style={styles.featuredHighlights}>
              <View style={styles.featuredHighlightItem}>
                <Icon name="bolt" size={18} color="#f7a400" />
                <Text style={styles.featuredHighlightText}>Resultados em 15 dias</Text>
              </View>
              <View style={styles.featuredHighlightItem}>
                <Icon name="verified" size={18} color="#4CAF50" />
                <Text style={styles.featuredHighlightText}>Médicos parceiros</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.featuredButton} activeOpacity={0.8}>
              <Text style={styles.featuredButtonText}>Conhecer protocolo</Text>
              <Icon name="chevron-right" size={18} color="#001137" />
            </TouchableOpacity>
          </View>
          <View style={styles.featuredImageWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
              }}
              style={styles.featuredImage}
            />
          </View>
        </View>

        {renderSectionHeader('Destaques para você')}
        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity key={product.id} style={styles.productCard} activeOpacity={0.8}>
              <View style={styles.productImageHolder}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                />
                <View style={styles.productBadge}>
                  <Text style={styles.productBadgeText}>{product.badge}</Text>
                </View>
              </View>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
              <View style={styles.productRatingRow}>
                <Icon name="star" size={16} color="#FFB800" />
                <Text style={styles.productRatingText}>
                  {product.rating} ({product.reviews})
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {renderSectionHeader('Combos & protocolos')}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bundleList}
        >
          {CURATED_BUNDLES.map((bundle) => (
            <View key={bundle.id} style={styles.bundleCard}>
              <View style={styles.bundleBadge}>
                <Text style={styles.bundleBadgeText}>Curado para você</Text>
              </View>
              <Text style={styles.bundleTitle}>{bundle.title}</Text>
              <Text style={styles.bundleDescription}>{bundle.description}</Text>
              <View style={styles.bundleFooter}>
                <Text style={styles.bundlePrice}>{bundle.price}</Text>
                <TouchableOpacity style={styles.bundleButton} activeOpacity={0.8}>
                  <Text style={styles.bundleButtonText}>Detalhes</Text>
                  <Icon name="north-east" size={16} color="#001137" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.newsletterCard}>
          <Text style={styles.newsletterTitle}>Receba novidades antes de todo mundo</Text>
          <Text style={styles.newsletterSubtitle}>
            Ofertas limitadas, protocolos exclusivos e conteúdo educativo direto no seu e-mail.
          </Text>
          <TouchableOpacity style={styles.newsletterButton} activeOpacity={0.8}>
            <Text style={styles.newsletterButtonText}>Ativar alertas personalizados</Text>
            <Icon name="arrow-forward" size={18} color="#001137" />
          </TouchableOpacity>
      </View>
      </ScrollView>
      <FloatingMenu items={menuItems} selectedId="marketplace" />
    </SafeAreaView>
  );
};

export default MarketplaceScreen;
