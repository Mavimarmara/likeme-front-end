import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from '@/components/ui/inputs';
import { FloatingMenu } from '@/components/ui/menu';
import { Header } from '@/components/ui/layout';
import { BackgroundWithGradient } from '@/assets';
import { useLogout } from '@/hooks';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Week highlights data
const WEEK_HIGHLIGHTS = [
  {
    id: '1',
    title: 'Mental Health in the Workplace',
    price: '$29.90',
    discount: '15% OFF',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
  },
] as const;

// Curated by providers data
const CURATED_BY_PROVIDERS = [
  {
    id: '1',
    title: 'Your journey to a good night of sleep',
    provider: { name: 'Dr. Peter Velasquez', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100' },
    tag: { label: 'Marketplace', icon: 'local-offer' },
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
  },
  {
    id: '2',
    title: 'Sports that make you enjoy everyday',
    provider: { name: 'Dr. Jessica Days', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100' },
    tag: { label: 'Keep mooving', icon: null },
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  },
] as const;

// New for you data
const NEW_FOR_YOU = [
  {
    id: '1',
    title: 'Strategies to relax',
    price: '$130',
    badge: 'Best seller',
    likes: 10,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
  },
  {
    id: '2',
    title: 'How evolve to a deeper sleep',
    price: '$5.99',
    badge: 'Best rated',
    likes: 10,
    image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=400',
  },
] as const;

// All products data
const ALL_PRODUCTS = [
  {
    id: '1',
    title: 'Where balance begins in your gut',
    price: '$55.45',
    category: 'Programs',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200',
  },
  {
    id: '2',
    title: 'Tongue scrapper',
    price: 'R$90.74',
    category: 'Products',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1526404079165-74e4230b3109?w=200',
  },
  {
    id: '3',
    title: 'Omega 3 Supplement',
    price: 'R$150.99',
    category: 'Medicine',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200',
  },
  {
    id: '4',
    title: 'Melatonin Chocolate',
    price: 'R$10.50',
    category: 'Products',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1519869325930-2812931507c0?w=200',
  },
  {
    id: '5',
    title: 'Nike Run Night. 5k - 10k',
    price: 'R$248.90',
    category: 'Sports',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
  },
] as const;

const CATEGORIES = [
  { id: 'marker', label: 'Marker', hasDropdown: true },
  { id: 'all', label: 'All' },
  { id: 'products', label: 'Products' },
  { id: 'specialists', label: 'Specialists' },
] as const;

const ORDER_FILTERS = [
  { id: 'order', label: 'Order by', hasDropdown: true },
  { id: 'best-rated', label: 'Best rated' },
  { id: 'above-100', label: 'Above $100' },
] as const;

type MarketplaceScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Marketplace'>;
};

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string>('best-rated');

  const rootNavigation = navigation.getParent() ?? navigation;
  const { logout } = useLogout({ navigation });
  const handleLogout = logout;

  const handleProductPress = (product: {
    id: string;
    title: string;
    price: string;
    image: string;
    category?: string;
    tags?: string[];
    description?: string;
    provider?: { name: string; avatar: string };
    rating?: number;
  }) => {
    navigation.navigate('ProductDetails', {
      productId: product.id,
      product,
    });
  };

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

  const renderCustomHeader = () => (
    <View style={styles.customHeader}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearchPress={() => {}}
          showFilterButton={true}
        />
      </View>
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
              {category.hasDropdown && (
                <Icon name="arrow-drop-down" size={20} color={isSelected ? '#fff' : '#000'} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderWeekHighlights = () => {
    const highlight = WEEK_HIGHLIGHTS[0];
    const product = {
      id: highlight.id,
      title: highlight.title,
      price: highlight.price,
      image: highlight.image,
      tags: ['Programs', 'Stress'],
    };
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Week highlights</Text>
        <TouchableOpacity
          style={styles.weekHighlightCard}
          onPress={() => handleProductPress(product)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: highlight.image }} style={styles.weekHighlightImage} />
          <View style={styles.weekHighlightBadge}>
            <Text style={styles.weekHighlightBadgeText}>{highlight.discount}</Text>
          </View>
          <View style={styles.weekHighlightContent}>
            <Text style={styles.weekHighlightTitle}>{highlight.title}</Text>
            <Text style={styles.weekHighlightPrice}>{highlight.price}</Text>
            <TouchableOpacity style={styles.weekHighlightCartButton} activeOpacity={0.7}>
              <Icon name="shopping-cart" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.pagination}>
            <View style={[styles.paginationDot, styles.paginationDotActive]} />
            <View style={styles.paginationDot} />
            <View style={styles.paginationDot} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCuratedByProviders = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Curated by providers</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {CURATED_BY_PROVIDERS.map((item) => {
          const product = {
            id: item.id,
            title: item.title,
            price: '$29.90',
            image: item.image,
            provider: item.provider,
            tags: item.tag ? [item.tag.label] : [],
          };
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.curatedCard}
              onPress={() => handleProductPress(product)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.image }} style={styles.curatedImage} />
              {item.tag && (
                <View style={styles.curatedTag}>
                  {item.tag.icon && <Icon name={item.tag.icon} size={12} color="#2196F3" />}
                  <Text style={styles.curatedTagText}>{item.tag.label}</Text>
                </View>
              )}
              <View style={styles.curatedContent}>
                <Text style={styles.curatedTitle}>{item.title}</Text>
                <View style={styles.curatedProvider}>
                  <Image source={{ uri: item.provider.avatar }} style={styles.providerAvatar} />
                  <Text style={styles.providerName}>{item.provider.name}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.curatedArrowButton} activeOpacity={0.7}>
                <Icon name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderNewForYou = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>New for you</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {NEW_FOR_YOU.map((item) => {
          const product = {
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            tags: [item.badge],
          };
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.newForYouCard}
              onPress={() => handleProductPress(product)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.image }} style={styles.newForYouImage} />
              <View style={styles.newForYouBadge}>
                <Text style={styles.newForYouBadgeText}>{item.badge}</Text>
              </View>
              <View style={styles.newForYouFooter}>
                <Text style={styles.newForYouPrice}>{item.price}</Text>
                <View style={styles.newForYouLikes}>
                  <Icon name="favorite" size={16} color="#F44336" />
                  <Text style={styles.newForYouLikesText}>{item.likes}</Text>
                </View>
              </View>
              <View style={styles.newForYouContent}>
                <Text style={styles.newForYouTitle}>{item.title}</Text>
                <TouchableOpacity style={styles.newForYouArrowButton} activeOpacity={0.7}>
                  <Icon name="arrow-forward" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderAllProducts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>All products</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.orderFiltersList}
      >
        {ORDER_FILTERS.map((filter) => {
          const isSelected = filter.id === selectedOrder;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.orderFilterPill,
                isSelected && styles.orderFilterPillSelected,
              ]}
              onPress={() => setSelectedOrder(filter.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.orderFilterText,
                  isSelected && styles.orderFilterTextSelected,
                ]}
              >
                {filter.label}
              </Text>
              {filter.hasDropdown && (
                <Icon name="arrow-drop-down" size={20} color={isSelected ? '#fff' : '#000'} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.productsList}>
        {ALL_PRODUCTS.map((product) => {
          const productData = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            rating: product.rating,
          };
          return (
            <TouchableOpacity
              key={product.id}
              style={styles.productRow}
              onPress={() => handleProductPress(productData)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: product.image }} style={styles.productRowImage} />
              <View style={styles.productRowContent}>
                <View style={styles.productRowCategory}>
                  <Text style={styles.productRowCategoryText}>{product.category}</Text>
                </View>
                <Text style={styles.productRowTitle}>{product.title}</Text>
                <View style={styles.productRowFooter}>
                  <Text style={styles.productRowPrice}>{product.price}</Text>
                  <View style={styles.productRowRating}>
                    <Icon name="star" size={16} color="#FFB800" />
                    <Text style={styles.productRowRatingText}>{product.rating}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.productRowAddButton} activeOpacity={0.7}>
                <Icon name="add" size={24} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

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
        {renderCustomHeader()}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderWeekHighlights()}
          {renderCuratedByProviders()}
          {renderNewForYou()}
          {renderAllProducts()}
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId="marketplace" />
    </SafeAreaView>
  );
};

export default MarketplaceScreen;
