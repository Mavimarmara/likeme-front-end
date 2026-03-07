import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { IconButton } from '@/components/ui/buttons';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type ProductItemCardProps = {
  image: string;
  title: string;
  category?: string;
  price?: number;
  outOfStock?: boolean;
  outOfStockLabel?: string;
  onPress: () => void;
  onAddPress?: () => void;
  showAddButton?: boolean;
  formatPrice: (value: number) => string;
  fallbackImage?: ImageSourcePropType;
};

const DEFAULT_PLACEHOLDER_URI = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  image,
  title,
  category,
  price,
  outOfStock,
  outOfStockLabel = 'Sem estoque',
  onPress,
  onAddPress,
  showAddButton = true,
  formatPrice,
  fallbackImage,
}) => {
  const imageSource = image ? { uri: image } : fallbackImage ?? { uri: DEFAULT_PLACEHOLDER_URI };
  const handleAddPress = useCallback(() => onAddPress?.(), [onAddPress]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole='button'
      accessibilityLabel={`${title}${outOfStock ? `, ${outOfStockLabel}` : ''}`}
      accessibilityHint='Toque duas vezes para abrir o produto'
    >
      <Image source={imageSource} style={styles.image} resizeMode='cover' />
      <View style={styles.content}>
        <View style={styles.topRow}>
          {category ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{category}</Text>
            </View>
          ) : (
            <View />
          )}
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.textBlock}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View>
              {outOfStock ? (
                <Text style={styles.outOfStock}>{outOfStockLabel}</Text>
              ) : (
                price !== undefined && <Text style={styles.price}>{formatPrice(price)}</Text>
              )}
            </View>
          </View>
          {showAddButton && onAddPress && (
            <IconButton
              icon='add'
              iconColor={COLORS.TEXT}
              iconSize={24}
              backgroundSize='large'
              onPress={handleAddPress}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ProductItemCard);
