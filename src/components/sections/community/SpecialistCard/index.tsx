import React from 'react';
import { View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@/constants';
import { styles } from './styles';

export type SpecialistCardProps = {
  name: string;
  subtitle?: string;
  rating?: number;
  tags?: string[];
  avatarUri?: string | null;
};

const SpecialistCard: React.FC<SpecialistCardProps> = ({
  name,
  subtitle = 'Especialista',
  rating,
  tags = [],
  avatarUri,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name='person' size={32} color={COLORS.NEUTRAL.LOW.MEDIUM} />
          </View>
        )}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            {rating != null && (
              <View style={styles.rating}>
                <Icon name='star' size={16} color={COLORS.HIGHLIGHT.DARK} />
                <Text style={styles.ratingText}>{rating}</Text>
              </View>
            )}
          </View>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {tags.length > 0 && (
            <View style={styles.tags}>
              {tags.slice(0, 4).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default SpecialistCard;
