import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BlurCard } from '@/components/ui/cards';
import { formatPrice } from '@/utils';
import { styles } from './styles';

export interface Product {
  id: string;
  title: string;
  price: number | null | undefined;
  tag: string;
  image: string;
  likes: number;
}

type Props = {
  product: Product;
  onPress?: (product: Product) => void;
  onLike?: (product: Product) => void;
};

const ProductCard: React.FC<Props> = ({ product, onPress, onLike }) => {
  const topSection = (
    <View style={styles.tagBadge}>
      <Text style={styles.tagText}>{product.tag}</Text>
    </View>
  );

  const footerSection = (
    <View style={styles.bottomInfo}>
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
      <TouchableOpacity style={styles.likeButton} onPress={() => onLike?.(product)} activeOpacity={0.7}>
        <Icon name='favorite-border' size={20} color='#f6cffb' />
        <Text style={styles.likesCount}>{product.likes}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress?.(product)}
      disabled={!onPress}
      accessibilityRole='button'
    >
      <BlurCard
        backgroundImage={product.image}
        topSection={topSection}
        footerSection={footerSection}
        style={styles.imageContainer}
      />
      <View style={styles.footer}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.arrowButton}>
          <Icon name='chevron-right' size={24} color='#001137' />
        </View>
      </View>
    </Pressable>
  );
};

export default ProductCard;
