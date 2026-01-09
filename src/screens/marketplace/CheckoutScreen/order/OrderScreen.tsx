import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { formatPrice } from '@/utils';
import { styles } from '../styles';
import type { AddressData } from '../address';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  tags?: string[];
  subtitle?: string;
  date?: string;
  rating?: number;
  category?: 'Programs' | 'Product' | 'Service' | 'Sport';
  deliveryForecast?: string;
}

interface OrderScreenProps {
  orderId: string;
  subtotal: number;
  shipping: number;
  addressData: AddressData;
  cartItems: CartItem[];
  onViewProgram?: (itemId: string) => void;
  onAddToCalendar?: (itemId: string) => void;
  onHomePress: () => void;
}

const OrderScreen: React.FC<OrderScreenProps> = ({
  orderId,
  subtotal,
  shipping,
  addressData,
  cartItems,
  onViewProgram,
  onAddToCalendar,
  onHomePress,
}) => {
  const total = subtotal + shipping;

  const formatRating = (rating: number | undefined | null): string => {
    if (rating === undefined || rating === null || isNaN(Number(rating))) {
      return '0.000';
    }
    return Number(rating).toFixed(3);
  };

  const formatDateDisplay = (dateString?: string, includeYear: boolean = false): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = includeYear 
        ? date.getFullYear() 
        : String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const getItemActionButton = (item: CartItem) => {
    if (item.category === 'Programs') {
      return (
        <TouchableOpacity
          style={styles.orderItemActionButton}
          onPress={() => onViewProgram?.(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.orderItemActionButtonText}>View program</Text>
        </TouchableOpacity>
      );
    }
    
    if (item.category === 'Service' || item.category === 'Sport') {
      return (
        <TouchableOpacity
          style={styles.orderItemActionButton}
          onPress={() => onAddToCalendar?.(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.orderItemActionButtonText}>Add to calendar</Text>
        </TouchableOpacity>
      );
    }
    
    return null;
  };

  const renderOrderItem = (item: CartItem) => (
    <View key={item.id} style={styles.orderItemCard}>
      <Image source={{ uri: item.image }} style={styles.orderItemImage} />
      
      <View style={styles.orderItemContent}>
        <View style={styles.orderItemHeader}>
          <View style={styles.orderItemTags}>
            {item.tags?.map((tag, index) => (
              <View key={index} style={styles.orderItemTag}>
                <Text style={styles.orderItemTagText}>{tag}</Text>
              </View>
            ))}
          </View>
          {item.rating !== undefined && item.rating !== null && (
            <View style={styles.orderItemRating}>
              <Text style={styles.orderItemRatingText}>
                {formatRating(item.rating)}
              </Text>
              <Icon name="star" size={16} color="#001137" />
            </View>
          )}
        </View>

        <Text style={styles.orderItemTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {item.date && (
          <Text style={styles.orderItemDate}>
            Date: {formatDateDisplay(item.date)}
          </Text>
        )}

        {item.deliveryForecast && (
          <Text style={styles.orderItemDeliveryForecast}>
            Delivery forecast{'\n'}{formatDateDisplay(item.deliveryForecast, true)}
          </Text>
        )}

        <View style={styles.orderItemFooter}>
          <Text style={styles.orderItemPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.orderItemQuantity}>QTD: {String(item.quantity).padStart(2, '0')}</Text>
        </View>

        {getItemActionButton(item)}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Order Summary Section */}
      <View style={styles.orderSummarySection}>
        <Text style={styles.orderSummaryTitle}>Order sumary</Text>
        <Text style={styles.orderId}>#{orderId}</Text>
        <View style={styles.orderSummaryDetails}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>{formatPrice(shipping)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.summaryTotalLabel]}>Total</Text>
            <Text style={[styles.summaryValue, styles.summaryTotalValue]}>
              {formatPrice(total)}
            </Text>
          </View>
        </View>
      </View>

      {/* Delivery Address Section */}
      <View style={styles.deliveryAddressCard}>
        <Text style={styles.deliveryAddressTitle}>Endereço de entrega</Text>
        <View style={styles.deliveryAddressContent}>
          <Text style={styles.deliveryAddressText}>{addressData.fullName}</Text>
          <Text style={styles.deliveryAddressText}>
            {addressData.addressLine1}
            {addressData.addressLine2 ? ` - ${addressData.addressLine2}` : ''}
          </Text>
          <Text style={styles.deliveryAddressText}>
            {addressData.neighborhood} - {addressData.city} - {addressData.state}
          </Text>
          <Text style={styles.deliveryAddressText}>{addressData.zipCode}</Text>
          <Text style={styles.deliveryAddressText}>{addressData.phone}</Text>
        </View>
      </View>

      {/* Your Products Section */}
      <Text style={styles.yourProductsTitle}>Your products</Text>
      <View style={styles.orderItemsList}>
        {cartItems.map(item => renderOrderItem(item))}
      </View>
    </ScrollView>
  );
};

export default OrderScreen;
