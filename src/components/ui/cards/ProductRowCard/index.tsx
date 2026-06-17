import React from 'react';
import { View, Text, Pressable, type ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IconButton } from '@/components/ui/buttons';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { COLORS } from '@/constants';
import { formatPriceLabel } from '@/utils/formatters/priceFormatter';
import { styles } from './styles';

export type ProductRowCardProps = {
  image: string;
  title: string;
  badges?: string[];
  price?: number | null;
  outOfStock?: boolean;
  outOfStockLabel?: string;
  onPress: () => void;
  /** Seta à direita chama o mesmo `onPress` do card (ex.: listagem marketplace/comunidade). */
  showTrailingChevron?: boolean;
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

const ProductRowCard: React.FC<ProductRowCardProps> = ({
  image,
  title,
  badges: badgesProp,
  price,
  outOfStock,
  outOfStockLabel = 'Sem estoque',
  onPress,
  showTrailingChevron = false,
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
  const badges = (badgesProp ?? []).map((label) => (typeof label === 'string' ? label.trim() : '')).filter(Boolean);
  const iconColor = COLORS.TEXT;
  const hasQuantityCallbacks = typeof onIncreaseQuantity === 'function' && typeof onDecreaseQuantity === 'function';
  const showQuantityRow = hasQuantityCallbacks && (quantity !== undefined || showDelete);
  const displayQuantity = quantity != null ? Number(quantity) : 0;
  const showDeleteButton = showDelete && onRemove;
  const showActionColumn = showDeleteButton || showQuantityRow || showTrailingChevron;
  const stackActionColumn = Boolean(showDeleteButton && showQuantityRow);
  const titleMaxLines = subtitle ? 1 : 2;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={`${title}${outOfStock ? `, ${outOfStockLabel}` : ''}`}
      accessibilityHint='Toque duas vezes para abrir o produto'
      testID={testID}
    >
      <View style={styles.imageColumnWrap}>
        <CachedImage source={imageSource} style={styles.imageColumn} recyclingKey={image} />
      </View>

      <View style={styles.contentColumn}>
        {badges.length > 0 ? (
          <View style={[styles.badgesRow, showActionColumn && styles.badgesRowOverAction]} pointerEvents='none'>
            {badges.map((label, index) => (
              <View key={`${label}-${index}`} style={styles.badge}>
                <Text style={styles.badgeText}>{label}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View style={[styles.titleRow, badges.length > 0 && styles.titleRowWithBadges]}>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={titleMaxLines} ellipsizeMode='tail'>
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

        <View style={styles.priceBlock}>
          {outOfStock ? (
            <Text style={styles.outOfStock}>{outOfStockLabel}</Text>
          ) : (
            <Text style={styles.price}>{formatPriceLabel(price)}</Text>
          )}
        </View>
      </View>

      {showActionColumn ? (
        <View style={[styles.actionColumn, stackActionColumn && styles.actionColumnStacked]}>
          {showDeleteButton ? (
            <Pressable
              style={({ pressed }) => [styles.deleteButton, pressed && { opacity: 0.7 }]}
              onPress={onRemove}
              accessibilityRole='button'
              accessibilityLabel='Remover do carrinho'
              testID={deleteButtonTestID}
            >
              <Icon name='delete' size={24} color={iconColor} />
            </Pressable>
          ) : null}

          {showQuantityRow ? (
            <View style={styles.quantityRow}>
              <Pressable
                style={({ pressed }) => [styles.quantityButton, pressed && { opacity: 0.7 }]}
                onPress={onDecreaseQuantity}
                accessibilityRole='button'
                accessibilityLabel='Diminuir quantidade'
                testID={decreaseQuantityTestID}
              >
                <Icon name='remove-circle-outline' size={24} color={iconColor} />
              </Pressable>
              <Text style={styles.quantityText} accessibilityLabel={`Quantidade ${displayQuantity}`}>
                {String(displayQuantity).padStart(2, '0')}
              </Text>
              <Pressable
                style={({ pressed }) => [styles.quantityButton, pressed && { opacity: 0.7 }]}
                onPress={onIncreaseQuantity}
                accessibilityRole='button'
                accessibilityLabel='Aumentar quantidade'
                testID={increaseQuantityTestID}
              >
                <Icon name='add-circle-outline' size={24} color={iconColor} />
              </Pressable>
            </View>
          ) : showTrailingChevron ? (
            <IconButton
              icon='chevron-right'
              iconColor={COLORS.TEXT}
              iconSize={28}
              backgroundSize='large'
              backgroundTintColor={COLORS.SECONDARY.PURE}
              onPress={onPress}
            />
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
};

export default React.memo(ProductRowCard);
