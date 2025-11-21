import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

export interface Plan {
  id: string;
  title: string;
  price: number;
  tag: string;
  tagColor?: 'orange' | 'green' | 'default';
  image: string;
  likes: number;
  currency?: 'BRL' | 'USD';
}

type Props = {
  plan: Plan;
  onPress?: (plan: Plan) => void;
  onLike?: (plan: Plan) => void;
};

const PlanCard: React.FC<Props> = ({ plan, onPress, onLike }) => {
  const formatPrice = (price: number, currency: 'BRL' | 'USD' = 'BRL') => {
    if (currency === 'BRL') {
      return `R$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const getTagColor = () => {
    switch (plan.tagColor) {
      case 'orange':
        return '#f6dea9';
      case 'green':
        return '#d8e4d6';
      default:
        return '#d8e4d6';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: plan.image }}
          style={styles.image}
        />
        <View style={styles.imageOverlay} />
        <View style={styles.contentOverlay}>
          <View style={[styles.tagBadge, { backgroundColor: 'rgba(0, 17, 55, 0.64)' }]}>
            <Text style={[styles.tagText, { color: getTagColor() }]}>
              {plan.tag}
            </Text>
          </View>
          <View style={styles.bottomInfo}>
            <Text style={styles.price}>
              {formatPrice(plan.price, plan.currency)}
            </Text>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => onLike?.(plan)}
              activeOpacity={0.7}
            >
              <Icon name="favorite-border" size={20} color="#f6cffb" />
              <Text style={styles.likesCount}>{plan.likes}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.title} numberOfLines={2}>
          {plan.title}
        </Text>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => onPress?.(plan)}
          activeOpacity={0.7}
        >
          <Icon name="chevron-right" size={24} color="#001137" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlanCard;

