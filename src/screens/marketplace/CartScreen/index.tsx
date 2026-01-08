import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { LogoMini } from '@/assets';
import { Background } from '@/components/ui/layout';
import { BackgroundIconButton } from '@/assets';
import { ImageBackground } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/constants';
import type { RootStackParamList } from '@/types/navigation';
import storageService from '@/services/auth/storageService';
import productService from '@/services/product/productService';
import { formatPrice } from '@/utils/formatters';
import { Alert } from 'react-native';
import { SecondaryButton } from '@/components/ui/buttons';
import { styles } from './styles';

interface CartItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  date?: string;
  price: number;
  quantity: number;
  rating: number;
  tags: string[];
  category: 'Programs' | 'Product' | 'Service' | 'Sport';
  subCategory: string;
}

type CartScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Cart'>;
};

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [zipCode, setZipCode] = useState('00000-000');
  const [shipping, setShipping] = useState(0.00);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
    
    // Listener para quando a tela recebe foco (para atualizar quando voltar de outra tela)
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartItems();
    });

    return unsubscribe;
  }, [navigation]);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await storageService.getCartItems();
      
      // Validar produtos: verificar se ainda existem e têm saldo
      const validatedItems: CartItem[] = [];
      const removedItems: string[] = [];
      
      for (const item of items) {
        try {
          const productResponse = await productService.getProductById(item.id);
          
          if (!productResponse.success || !productResponse.data) {
            // Produto não existe mais
            removedItems.push(item.title || item.id);
            continue;
          }
          
          const product = productResponse.data;
          const availableQuantity = product.quantity ?? 0;
          const requestedQuantity = Number(item.quantity) || 1;
          
          if (availableQuantity < requestedQuantity) {
            // Produto não tem saldo suficiente
            if (availableQuantity === 0) {
              removedItems.push(item.title || item.id);
              continue;
            }
            // Ajustar quantidade para o saldo disponível
            item.quantity = availableQuantity;
          }
          
          // Garante que price e quantity são números
          validatedItems.push({
            ...item,
            price: Number(product.price) || Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            rating: Number(item.rating) || 0,
          } as CartItem);
        } catch (error) {
          // Erro ao buscar produto - remover do carrinho
          console.error(`Error validating product ${item.id}:`, error);
          removedItems.push(item.title || item.id);
        }
      }
      
      // Atualizar carrinho com itens validados
      if (validatedItems.length !== items.length || removedItems.length > 0) {
        await storageService.setCartItems(validatedItems);
        
        if (removedItems.length > 0) {
          Alert.alert(
            'Carrinho atualizado',
            `Os seguintes produtos foram removidos do carrinho por não estarem mais disponíveis:\n\n${removedItems.join('\n')}`
          );
        }
      }
      
      setCartItems(validatedItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCartItems = async (items: CartItem[]) => {
    try {
      await storageService.setCartItems(items);
      setCartItems(items);
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleIncreaseQuantity = async (id: string) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        const currentQuantity = Number(item.quantity) || 1;
        return { ...item, quantity: currentQuantity + 1 };
      }
      return item;
    });
    await saveCartItems(updatedItems);
  };

  const handleDecreaseQuantity = async (id: string) => {
    const updatedItems = cartItems
      .map(item => {
        if (item.id === id) {
          const currentQuantity = Number(item.quantity) || 1;
          if (currentQuantity > 1) {
            return { ...item, quantity: currentQuantity - 1 };
          }
          return null; // Marca para remover
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null && (Number(item.quantity) || 0) > 0);
    await saveCartItems(updatedItems);
  };

  const handleRemoveItem = async (id: string) => {
    await storageService.removeCartItem(id);
    await loadCartItems();
  };

  const handleApplyShipping = () => {
    // Lógica para calcular frete
    setShipping(0.00);
  };

  const handleBuy = () => {
    navigation.navigate('Checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shipping;
  };


  const formatRating = (rating: number | undefined | null) => {
    if (rating === undefined || rating === null || isNaN(Number(rating))) {
      return '0.000';
    }
    return Number(rating).toFixed(3);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={handleBackPress}
        activeOpacity={0.7}
        testID="back-button"
      >
        <ImageBackground
          source={BackgroundIconButton}
          style={styles.iconButtonBackground}
          imageStyle={styles.iconButtonImage}
        >
          <Icon name="arrow-back" size={20} color="#001137" />
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.logoContainer}>
        <LogoMini width={87} height={16} />
      </View>
      <View style={styles.placeholderButton} />
    </View>
  );

  const renderWarningBanner = () => (
    <View style={styles.warningBanner}>
      <Text style={styles.warningText}>
        The items in your shopping cart are not reserved until you complete your purchase.
      </Text>
    </View>
  );

  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={styles.cartItemCard}>
      {/* Imagem posicionada à esquerda */}
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      {/* Tags e botão delete - PRIMEIRO (acima do título) */}
      <View style={styles.itemTagsRow}>
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View 
              key={index} 
              style={styles.tagBadge}
            >
              <Text style={[
                styles.tagText,
                index === 0 && styles.tagTextOrange,
                index === 1 && styles.tagTextGreen
              ]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleRemoveItem(item.id)}
          activeOpacity={0.7}
          testID={`delete-item-${item.id}`}
        >
          <Icon name="delete" size={24} color="#001137" />
        </TouchableOpacity>
      </View>
      
      {/* Conteúdo principal - título, subtitle/date e rating */}
      <View style={styles.itemHeaderContainer}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode="tail">
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.itemSubtitle} numberOfLines={1} ellipsizeMode="tail">
              {item.subtitle}
            </Text>
          )}
          {!item.subtitle && item.date && (
            <Text style={styles.itemDate}>Date: {item.date}</Text>
          )}
          {item.subtitle && item.date && (
            <Text style={styles.itemDate}>Date: {item.date}</Text>
          )}
        </View>
        {item.rating !== undefined && item.rating !== null && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{formatRating(item.rating)}</Text>
            <Icon name="star" size={18} color="#001137" />
          </View>
        )}
      </View>
      
      {/* Preço e controles de quantidade */}
      <View style={styles.itemFooter}>
        <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleDecreaseQuantity(item.id)}
            activeOpacity={0.7}
            testID={`decrease-quantity-${item.id}`}
          >
            <Icon name="remove-circle-outline" size={24} color="#001137" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>
            {String(item.quantity).padStart(2, '0')}
          </Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleIncreaseQuantity(item.id)}
            activeOpacity={0.7}
            testID={`increase-quantity-${item.id}`}
          >
            <Icon name="add-circle-outline" size={24} color="#001137" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderShippingSection = () => (
    <View style={styles.shippingSection}>
      <Text style={styles.shippingTitle}>Calculate shipping</Text>
      <View style={styles.shippingInputRow}>
        <TextInput
          style={styles.zipCodeInput}
          value={zipCode}
          onChangeText={setZipCode}
          placeholder="00000-000"
          placeholderTextColor="#6e6a6a"
        />
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyShipping}
          activeOpacity={0.8}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.dontKnowZipButton} activeOpacity={0.7}>
        <Text style={styles.dontKnowZipText}>I don't know the zip code</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderSummary = () => {
    const subtotal = calculateSubtotal();
    const total = calculateTotal();

    return (
      <View style={styles.orderSummary}>
        <View style={styles.separator} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>{formatPrice(shipping)}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Background />
      {renderHeader()}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Your cart</Text>
        {renderWarningBanner()}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading cart...</Text>
          </View>
        ) : cartItems.length > 0 ? (
          <>
            <Text style={styles.productsTitle}>Your products</Text>
            <View style={styles.cartItemsList}>
              {cartItems.map(item => renderCartItem(item))}
            </View>
            {renderShippingSection()}
            {renderOrderSummary()}
            <SecondaryButton
              label="Buy"
              onPress={handleBuy}
              style={styles.buyButton}
            />
          </>
        ) : (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Marketplace')}
              activeOpacity={0.8}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CartScreen;

