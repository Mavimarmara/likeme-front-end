import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { formatPrice } from '@/utils';
import { styles } from './styles';

interface WeekHighlightCardProps {
  title: string;
  image: string;
  price: number | null | undefined;
  onPress: () => void;
}

export const WeekHighlightCard: React.FC<WeekHighlightCardProps> = ({
  title,
  image,
  price,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.weekHighlightCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image 
        source={{ uri: image }} 
        style={styles.weekHighlightImage} 
      />
      <View style={styles.weekHighlightBadge}>
        <Text style={styles.weekHighlightBadgeText}>Featured</Text>
      </View>
      <View style={styles.weekHighlightContent}>
        <Text style={styles.weekHighlightTitle}>{title}</Text>
        <Text style={styles.weekHighlightPrice}>{formatPrice(price)}</Text>
      </View>
    </TouchableOpacity>
  );
};
