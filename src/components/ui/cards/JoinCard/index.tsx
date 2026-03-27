import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BlurCard from '../BlurCard';
import { BackgroundIconButton } from '@/assets/ui';
import { styles } from './styles';

export type JoinCardItem = {
  id: string;
  title: string;
  badge: string;
  image: string;
};

export type JoinCardProps<T extends JoinCardItem = JoinCardItem> = {
  items: readonly T[];
  onItemPress?: (item: T) => void;
};

export function JoinCard<T extends JoinCardItem>({ items, onItemPress }: JoinCardProps<T>) {
  if (!items || items.length === 0) return null;

  const renderCard = (item: T) => {
    const handlePress = () => onItemPress?.(item);
    const badgeLabel = item.badge.trim();
    const topSection = (
      <View style={styles.badgeContainer}>
        {badgeLabel.length > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeLabel}</Text>
          </View>
        ) : null}
      </View>
    );

    const footerSection = (
      <View style={styles.bottom}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <TouchableOpacity style={styles.seeMoreButton} activeOpacity={0.8} onPress={handlePress}>
          <ImageBackground
            source={BackgroundIconButton}
            style={styles.buttonBackground}
            imageStyle={styles.buttonImage}
          >
            <Icon name='chevron-right' size={30} color='#001137' />
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );

    return (
      <View key={item.id} style={styles.cardWrapper}>
        <BlurCard
          backgroundImage={item.image}
          topSection={topSection}
          footerSection={footerSection}
          onPress={handlePress}
          style={styles.card}
        />
      </View>
    );
  };

  if (items.length === 1) {
    return <View style={styles.container}>{renderCard(items[0])}</View>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {items.map(renderCard)}
    </ScrollView>
  );
}

export default JoinCard;
