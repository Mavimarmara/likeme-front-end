import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice } from '@/utils';
import { catalogTypeTranslatedBadgeLabels } from '@/types/product';
import { styles } from '../styles';
import type { AddressData } from '../address/AddressForm';
import type { CartItem } from '@/types/cart';

interface OrderScreenProps {
  orderId: string;
  subtotal: number;
  shipping: number;
  /** Quando false, oculta linha/endereço de entrega (carrinho só com programs/services). */
  showShipping?: boolean;
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
  showShipping = true,
  addressData,
  cartItems,
  onViewProgram,
  onAddToCalendar,
  onHomePress,
}) => {
  const { t } = useTranslation();
  const total = subtotal + (showShipping ? shipping : 0);

  const formatDateDisplay = (dateString?: string, includeYear = false): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = includeYear ? date.getFullYear() : String(date.getFullYear()).slice(-2);
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
          <Text style={styles.orderItemActionButtonText}>{t('checkout.viewProgram')}</Text>
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
          <Text style={styles.orderItemActionButtonText}>{t('checkout.addToCalendar')}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderOrderItem = (item: CartItem) => {
    const tagLabels = catalogTypeTranslatedBadgeLabels(item.type, t);
    return (
      <View key={item.id} style={styles.orderItemCard}>
        <CachedImage source={{ uri: item.image }} style={styles.orderItemImage} />

        <View style={styles.orderItemContent}>
          <View style={styles.orderItemHeader}>
            <View style={styles.orderItemTags}>
              {tagLabels.map((label, index) => (
                <View key={`${label}-${index}`} style={styles.orderItemTag}>
                  <Text style={styles.orderItemTagText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.orderItemTitle} numberOfLines={2}>
            {item.title}
          </Text>

          {item.date && (
            <Text style={styles.orderItemDate}>
              {t('cart.date')}: {formatDateDisplay(item.date)}
            </Text>
          )}

          {item.deliveryForecast && (
            <Text style={styles.orderItemDeliveryForecast}>
              {t('checkout.deliveryForecast')}
              {'\n'}
              {formatDateDisplay(item.deliveryForecast, true)}
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
  };

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.orderCreatedMessage}>
        {t('checkout.orderCreated', { defaultValue: 'Pedido criado com sucesso!' })}
      </Text>

      <View style={styles.orderSummarySection}>
        <Text style={styles.orderSummaryTitle}>{t('checkout.orderSummary')}</Text>
        <Text style={styles.orderId}>#{orderId}</Text>
        <View style={styles.orderSummaryDetails}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
            <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
          </View>
          {showShipping && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('cart.shipping')}</Text>
              <Text style={styles.summaryValue}>{formatPrice(shipping)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.summaryTotalLabel]}>{t('cart.total')}</Text>
            <Text style={[styles.summaryValue, styles.summaryTotalValue]}>{formatPrice(total)}</Text>
          </View>
        </View>
      </View>

      {showShipping && (
        <View style={styles.deliveryAddressCard}>
          <Text style={styles.deliveryAddressTitle}>{t('checkout.deliveryAddress')}</Text>
          <View style={styles.deliveryAddressContent}>
            <Text style={styles.deliveryAddressText}>{addressData.fullName}</Text>
            <Text style={styles.deliveryAddressText}>
              {addressData.addressLine1}
              {addressData.streetNumber ? `, ${addressData.streetNumber}` : ''}
              {addressData.addressLine2 ? ` - ${addressData.addressLine2}` : ''}
            </Text>
            <Text style={styles.deliveryAddressText}>
              {addressData.neighborhood} - {addressData.city} - {addressData.state}
            </Text>
            <Text style={styles.deliveryAddressText}>{addressData.zipCode}</Text>
            <Text style={styles.deliveryAddressText}>{addressData.phone}</Text>
          </View>
        </View>
      )}

      {/* Your Products Section */}
      <Text style={styles.yourProductsTitle}>{t('cart.yourProducts')}</Text>
      <View style={styles.orderItemsList}>{cartItems.map((item) => renderOrderItem(item))}</View>
    </ScrollView>
  );
};

export default OrderScreen;
