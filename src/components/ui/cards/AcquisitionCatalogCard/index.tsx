import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { IconButton } from '@/components/ui/buttons';
import { COLORS, IMAGE_PRIORITY_HIGH } from '@/constants';
import { styles } from './styles';

export type AcquisitionCatalogCardProps = {
  title: string;
  image: string;
  badges?: string[];
  onPress: () => void;
  testID?: string;
};

export const AcquisitionCatalogCard: React.FC<AcquisitionCatalogCardProps> = ({
  title,
  image,
  badges = [],
  onPress,
  testID,
}) => {
  const visibleBadges = badges.map((label) => label.trim()).filter(Boolean);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole='button'
      accessibilityLabel={title}
      testID={testID}
    >
      <CachedImage source={{ uri: image }} style={styles.image} priority={IMAGE_PRIORITY_HIGH} />
      <View style={styles.overlay} />
      {visibleBadges.length > 0 ? (
        <View style={styles.badgesRow}>
          {visibleBadges.map((label) => (
            <View key={label} style={styles.badge}>
              <Text style={styles.badgeText} numberOfLines={1}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      <View style={styles.footer}>
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>
        <IconButton
          icon='chevron-right'
          iconColor={COLORS.TEXT}
          iconSize={24}
          backgroundSize='large'
          onPress={onPress}
        />
      </View>
    </Pressable>
  );
};
