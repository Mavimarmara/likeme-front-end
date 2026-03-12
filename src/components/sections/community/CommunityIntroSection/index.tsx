import React from 'react';
import { View, Text, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { IconSilhouette } from '@/components/ui/layout';
import { styles } from './styles';

export type CommunityIntroSectionProps = {
  title: string;
  description: string;
  imageUri?: string | null;
  onSeeMore?: () => void;
  seeMoreLabel?: string;
  seeLessLabel?: string;
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400';

const CommunityIntroSection: React.FC<CommunityIntroSectionProps> = ({
  title,
  description,
  imageUri,
  onSeeMore,
  seeMoreLabel = 'Ver mais',
  seeLessLabel = 'Ver menos',
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const source: ImageSourcePropType = imageUri ? { uri: imageUri } : { uri: DEFAULT_IMAGE };

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
    } else {
      setExpanded(true);
      onSeeMore?.();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.avatarWrapper}>
          <IconSilhouette source={source} size='large' style={styles.avatar} />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
      <View style={styles.descriptionRow}>
        <Text style={styles.description} numberOfLines={expanded ? undefined : 2}>
          {description}
        </Text>
        <TouchableOpacity onPress={handleToggle} activeOpacity={0.8} style={styles.seeMoreTouchable}>
          <Text style={styles.seeMoreText}>{expanded ? seeLessLabel : seeMoreLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommunityIntroSection;
