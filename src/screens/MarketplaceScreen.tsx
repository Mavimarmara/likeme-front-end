import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import { Card, Chip, Searchbar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MarketplaceScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: 'apps' },
    { id: 'supplements', name: 'Suplementos', icon: 'medication' },
    { id: 'equipment', name: 'Equipamentos', icon: 'fitness-center' },
    { id: 'books', name: 'Livros', icon: 'menu-book' },
    { id: 'courses', name: 'Cursos', icon: 'school' },
  ];

  const products = [
    {
      id: 1,
      title: 'Whey Protein Premium',
      category: 'supplements',
      price: 89.90,
      originalPrice: 119.90,
      rating: 4.8,
      reviews: 156,
      image: '🥤',
      description: 'Proteína de alta qualidade para atletas',
      discount: 25,
      inStock: true,
    },
    {
      id: 2,
      title: 'Esteira Elétrica Pro',
      category: 'equipment',
      price: 1299.90,
      originalPrice: 1599.90,
      rating: 4.6,
      reviews: 89,
      image: '🏃‍♂️',
      description: 'Esteira elétrica com inclinação automática',
      discount: 19,
      inStock: true,
    },
    {
      id: 3,
      title: 'Livro: Nutrição Esportiva',
      category: 'books',
      price: 45.90,
      originalPrice: 65.90,
      rating: 4.9,
      reviews: 234,
      image: '📚',
      description: 'Guia completo de nutrição para atletas',
      discount: 30,
      inStock: true,
    },
    {
      id: 4,
      title: 'Curso Online: Meditação',
      category: 'courses',
      price: 199.90,
      originalPrice: 299.90,
      rating: 4.7,
      reviews: 67,
      image: '🧘‍♀️',
      description: 'Curso completo de meditação e mindfulness',
      discount: 33,
      inStock: false,
    },
    {
      id: 5,
      title: 'Multivitamínico Completo',
      category: 'supplements',
      price: 59.90,
      originalPrice: 79.90,
      rating: 4.5,
      reviews: 312,
      image: '💊',
      description: 'Complexo vitamínico para saúde geral',
      discount: 25,
      inStock: true,
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const renderProduct = ({ item }: { item: any }) => (
    <Card style={[styles.productCard, !item.inStock && styles.outOfStockCard]}>
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>{item.image}</Text>
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}
        {!item.inStock && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Esgotado</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews} avaliações)</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>{formatPrice(item.price)}</Text>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
          )}
        </View>

        <Button
          mode="contained"
          onPress={() => {
            // Add to cart
          }}
          style={styles.addToCartButton}
          disabled={!item.inStock}
        >
          {item.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
        </Button>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <Text style={styles.subtitle}>Produtos para sua saúde e bem-estar</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar produtos..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Icon 
              name={category.icon} 
              size={20} 
              color={selectedCategory === category.id ? '#fff' : '#4CAF50'} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productsList}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Button */}
      <View style={styles.cartContainer}>
        <TouchableOpacity style={styles.cartButton}>
          <Icon name="shopping-cart" size={24} color="#fff" />
          <Text style={styles.cartText}>Ver Carrinho (3)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  productsList: {
    padding: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  outOfStockCard: {
    opacity: 0.6,
  },
  productImage: {
    height: 120,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productEmoji: {
    fontSize: 48,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F44336',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#666',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
  },
  cartContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  cartButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 4,
  },
  cartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default MarketplaceScreen;
