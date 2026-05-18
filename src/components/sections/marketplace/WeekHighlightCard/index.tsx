import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { IMAGE_PRIORITY_HIGH } from '@/constants';
import { formatPriceLabel } from '@/utils/formatters/priceFormatter';
import { styles } from './styles';

interface WeekHighlightCardProps {
  title: string;
  image: string;
  price: number | null | undefined;
  onPress: () => void;
  /** Texto exibido no badge (ex.: nome da categoria do produto) */
  badge?: string;
}

export const WeekHighlightCard: React.FC<WeekHighlightCardProps> = ({ title, image, price, onPress, badge }) => {
  return (
    <TouchableOpacity style={styles.weekHighlightCard} onPress={onPress} activeOpacity={0.9}>
      <CachedImage source={{ uri: image }} style={styles.weekHighlightImage} priority={IMAGE_PRIORITY_HIGH} />
      {badge != null && badge !== '' ? (
        <View style={styles.weekHighlightBadge}>
          <Text style={styles.weekHighlightBadgeText}>{badge}</Text>
        </View>
      ) : null}
      <View style={styles.weekHighlightContent}>
        <Text style={styles.weekHighlightTitle}>{title}</Text>
        <Text style={styles.weekHighlightPrice}>{formatPriceLabel(price)}</Text>
      </View>
    </TouchableOpacity>
  );
};
