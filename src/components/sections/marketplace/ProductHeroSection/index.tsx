import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeroImage } from '@/components/ui/layout';
import { formatPrice } from '@/utils';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800';

interface ProductHeroSectionProps {
  title: string;
  image: string;
  price: number | null | undefined;
  tags: string[];
  isOutOfStock: boolean;
  onAddToCart: () => void;
}

export const ProductHeroSection: React.FC<ProductHeroSectionProps> = ({
  title,
  image,
  price,
  tags,
  isOutOfStock,
  onAddToCart,
}) => {
  const { t } = useTranslation();
  const cardContent = (
    <View style={styles.heroProductCard}>
      <View style={styles.heroCardTags}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.heroCardTag}>
            <Text style={styles.heroCardTagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.heroCardTitle}>{title}</Text>
      <View style={styles.heroCardPriceRow}>
        <Text style={styles.heroCardPrice}>{formatPrice(price)}</Text>
        {!isOutOfStock && (
          <TouchableOpacity style={styles.heroCardCartButton} onPress={onAddToCart} activeOpacity={0.7}>
            <Icon name='shopping-cart' size={20} color='#001137' />
          </TouchableOpacity>
        )}
      </View>
      {isOutOfStock && (
        <View style={styles.outOfStockBadge}>
          <Text style={styles.outOfStockText}>{t('marketplace.outOfStock')}</Text>
        </View>
      )}
    </View>
  );

  return <HeroImage imageUri={image || DEFAULT_PRODUCT_IMAGE} heightRatio={0.5} cardContent={cardContent} />;
};
