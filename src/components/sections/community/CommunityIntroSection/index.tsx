import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export type CommunityIntroSectionProps = {
  title: string;
  description: string;
  imageUri?: string | null;
  onSeeMore?: () => void;
  seeMoreLabel?: string;
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400';

const CommunityIntroSection: React.FC<CommunityIntroSectionProps> = ({
  title,
  description,
  imageUri,
  onSeeMore,
  seeMoreLabel = 'Ver mais',
}) => {
  const source = imageUri ? { uri: imageUri } : { uri: DEFAULT_IMAGE };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image source={source} style={styles.avatar} />
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>
      {onSeeMore && (
        <TouchableOpacity onPress={onSeeMore} activeOpacity={0.8} style={styles.seeMoreTouchable}>
          <Text style={styles.seeMoreText}>{seeMoreLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommunityIntroSection;
