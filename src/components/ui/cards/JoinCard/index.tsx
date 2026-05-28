import { View, Text, ScrollView } from 'react-native';
import BlurCard from '../BlurCard';
import { IconButton } from '@/components/ui/buttons';
import { styles } from './styles';

export type JoinCardItem = {
  id: string;
  title: string;
  badges: string[];
  image: string;
};

export type JoinCardLayout = 'carousel' | 'list';

export type JoinCardProps<T extends JoinCardItem = JoinCardItem> = {
  items: readonly T[];
  onItemPress?: (item: T) => void;
  layout?: JoinCardLayout;
};

export function JoinCard<T extends JoinCardItem>({ items, onItemPress, layout = 'carousel' }: JoinCardProps<T>) {
  if (!items || items.length === 0) return null;

  const cardWrapperStyle = layout === 'list' ? styles.cardWrapperList : styles.cardWrapper;

  const renderCard = (item: T) => {
    const handlePress = () => onItemPress?.(item);
    const badges = item.badges.map((label) => label.trim()).filter(Boolean);

    const topSection = (
      <View style={styles.badgesWrap}>
        {badges.map((label, index) => (
          <View key={`${label}-${index}`} style={styles.badge}>
            <Text style={styles.badgeText}>{label}</Text>
          </View>
        ))}
      </View>
    );

    const footerSection = (
      <View style={styles.bottom}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <IconButton
          icon='chevron-right'
          iconColor='#001137'
          iconSize={28}
          onPress={handlePress}
          backgroundSize='large'
          containerStyle={styles.ctaIconButton}
        />
      </View>
    );

    return (
      <View key={item.id} style={cardWrapperStyle}>
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

  if (layout === 'list') {
    return <View style={styles.listContent}>{items.map(renderCard)}</View>;
  }

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
