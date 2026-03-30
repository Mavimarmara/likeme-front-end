import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IconButton } from '@/components/ui/buttons';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type ProductItemCardProps = {
  image: string;
  title: string;
  badges?: string[];
  price?: number;
  outOfStock?: boolean;
  outOfStockLabel?: string;
  onPress: () => void;
  onAddPress?: () => void;
  showAddButton?: boolean;
  formatPrice: (value: number) => string;
  fallbackImage?: ImageSourcePropType;
  subtitle?: string;
  rating?: number;
  formatRating?: (value: number) => string;
  showDelete?: boolean;
  onRemove?: () => void;
  quantity?: number;
  onIncreaseQuantity?: () => void;
  onDecreaseQuantity?: () => void;
  testID?: string;
  deleteButtonTestID?: string;
  increaseQuantityTestID?: string;
  decreaseQuantityTestID?: string;
};

const DEFAULT_PLACEHOLDER_URI = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  image,
  title,
  badges: badgesProp,
  price,
  outOfStock,
  outOfStockLabel = 'Sem estoque',
  onPress,
  onAddPress,
  showAddButton = true,
  formatPrice,
  fallbackImage,
  subtitle,
  rating,
  formatRating,
  showDelete = false,
  onRemove,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  testID,
  deleteButtonTestID,
  increaseQuantityTestID,
  decreaseQuantityTestID,
}) => {
  const imageSource = image ? { uri: image } : fallbackImage ?? { uri: DEFAULT_PLACEHOLDER_URI };
  const handleAddPress = useCallback(() => onAddPress?.(), [onAddPress]);
  const badges = (badgesProp ?? []).map((label) => (typeof label === 'string' ? label.trim() : '')).filter(Boolean);
  const iconColor = COLORS.TEXT;
  const hasQuantityCallbacks = typeof onIncreaseQuantity === 'function' && typeof onDecreaseQuantity === 'function';
  const showQuantityRow = hasQuantityCallbacks && (quantity !== undefined || showDelete);
  const displayQuantity = quantity != null ? Number(quantity) : 0;

  const content = (
    <>
      <Image source={imageSource} style={styles.image} resizeMode='cover' />
      <View style={styles.content}>
        <View style={styles.topRow}>
          {badges.length > 0 ? (
            <View style={styles.badgesWrap}>
              {badges.map((label, index) => (
                <View key={`${label}-${index}`} style={styles.badge}>
                  <Text style={styles.badgeText}>{label}</Text>
                </View>
              ))}
            </View>
          ) : null}
          <View style={styles.topRowRight}>
            {showDelete && onRemove && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={onRemove}
                activeOpacity={0.7}
                accessibilityRole='button'
                accessibilityLabel='Remover do carrinho'
                testID={deleteButtonTestID}
              >
                <Icon name='delete' size={24} color={iconColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.middleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={subtitle ? 2 : 1} ellipsizeMode='tail'>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode='tail'>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {rating !== undefined && rating !== null && formatRating && (
            <View style={styles.ratingWrap} accessibilityLabel={`Avaliação ${formatRating(rating)}`}>
              <Text style={styles.ratingText}>{formatRating(rating)}</Text>
              <Icon name='star' size={18} color={iconColor} />
            </View>
          )}
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.priceBlock}>
            {outOfStock ? (
              <Text style={styles.outOfStock}>{outOfStockLabel}</Text>
            ) : (
              price !== undefined && <Text style={styles.price}>{formatPrice(price)}</Text>
            )}
          </View>
          {showQuantityRow ? (
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={onDecreaseQuantity}
                activeOpacity={0.7}
                accessibilityRole='button'
                accessibilityLabel='Diminuir quantidade'
                testID={decreaseQuantityTestID}
              >
                <Icon name='remove-circle-outline' size={24} color={iconColor} />
              </TouchableOpacity>
              <Text style={styles.quantityText} accessibilityLabel={`Quantidade ${displayQuantity}`}>
                {String(displayQuantity).padStart(2, '0')}
              </Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={onIncreaseQuantity}
                activeOpacity={0.7}
                accessibilityRole='button'
                accessibilityLabel='Aumentar quantidade'
                testID={increaseQuantityTestID}
              >
                <Icon name='add-circle-outline' size={24} color={iconColor} />
              </TouchableOpacity>
            </View>
          ) : (
            showAddButton &&
            onAddPress && (
              <IconButton
                icon='add'
                iconColor={COLORS.TEXT}
                iconSize={24}
                backgroundSize='large'
                onPress={handleAddPress}
              />
            )
          )}
        </View>
      </View>
    </>
  );

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole='button'
      accessibilityLabel={`${title}${outOfStock ? `, ${outOfStockLabel}` : ''}`}
      accessibilityHint='Toque duas vezes para abrir o produto'
      testID={testID}
    >
      {content}
    </TouchableOpacity>
  );
};

export default React.memo(ProductItemCard);
