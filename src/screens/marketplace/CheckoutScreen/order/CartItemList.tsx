import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from '@/hooks/i18n';
import { styles as cartStyles } from '../../CartScreen/styles';

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
}

interface CartItemListProps {
  items: CartItem[];
  onRemoveItem?: (id: string) => void;
  onIncreaseQuantity?: (id: string) => void;
  onDecreaseQuantity?: (id: string) => void;
  formatPrice: (price: number) => string;
  formatRating: (rating: number) => string;
}

const CartItemList: React.FC<CartItemListProps> = ({
  items,
  onRemoveItem,
  onIncreaseQuantity,
  onDecreaseQuantity,
  formatPrice,
  formatRating,
}) => {
  const { t } = useTranslation();
  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={cartStyles.cartItemCard}>
      {/* Imagem posicionada à esquerda */}
      <Image source={{ uri: item.image }} style={cartStyles.itemImage} />

      {/* Tags e botão delete - PRIMEIRO (acima do título) */}
      <View style={cartStyles.itemTagsRow}>
        <View style={cartStyles.tagsContainer}>
          {item.tags &&
            item.tags.map((tag, index) => (
              <View key={index} style={cartStyles.tagBadge}>
                <Text
                  style={[
                    cartStyles.tagText,
                    index === 0 && cartStyles.tagTextOrange,
                    index === 1 && cartStyles.tagTextGreen,
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
        </View>
        {onRemoveItem && (
          <TouchableOpacity
            style={cartStyles.deleteButton}
            onPress={() => onRemoveItem(item.id)}
            activeOpacity={0.7}
          >
            <Icon name="delete" size={24} color="#001137" />
          </TouchableOpacity>
        )}
      </View>

      {/* Conteúdo principal - título, subtitle/date e rating */}
      <View style={cartStyles.itemHeaderContainer}>
        <View style={cartStyles.itemInfo}>
          <Text style={cartStyles.itemTitle} numberOfLines={2} ellipsizeMode="tail">
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={cartStyles.itemSubtitle} numberOfLines={1} ellipsizeMode="tail">
              {item.subtitle}
            </Text>
          )}
          {!item.subtitle && item.date && (
            <Text style={cartStyles.itemDate}>{t('cart.date')}: {item.date}</Text>
          )}
          {item.subtitle && item.date && <Text style={cartStyles.itemDate}>{t('cart.date')}: {item.date}</Text>}
        </View>
        {item.rating !== undefined && item.rating !== null && (
          <View style={cartStyles.ratingContainer}>
            <Text style={cartStyles.ratingText}>{formatRating(item.rating)}</Text>
            <Icon name="star" size={18} color="#001137" />
          </View>
        )}
      </View>

      {/* Preço e controles de quantidade */}
      <View style={cartStyles.itemFooter}>
        <Text style={cartStyles.itemPrice}>{formatPrice(item.price)}</Text>
        {onIncreaseQuantity && onDecreaseQuantity && (
          <View style={cartStyles.quantityControls}>
            <TouchableOpacity
              style={cartStyles.quantityButton}
              onPress={() => onDecreaseQuantity(item.id)}
              activeOpacity={0.7}
            >
              <Icon name="remove-circle-outline" size={24} color="#001137" />
            </TouchableOpacity>
            <Text style={cartStyles.quantityText}>{String(item.quantity).padStart(2, '0')}</Text>
            <TouchableOpacity
              style={cartStyles.quantityButton}
              onPress={() => onIncreaseQuantity(item.id)}
              activeOpacity={0.7}
            >
              <Icon name="add-circle-outline" size={24} color="#001137" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return <View style={cartStyles.cartItemsList}>{items.map((item) => renderCartItem(item))}</View>;
};

export default CartItemList;
