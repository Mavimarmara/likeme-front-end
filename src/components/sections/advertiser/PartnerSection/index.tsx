import React from 'react';
import { Image, Text, View, type ImageStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SecondaryButton } from '@/components/ui/buttons';
import { styles } from './styles';

type PartnerSectionProps = {
  name: string;
  avatar?: string;
  rating?: number;
  specialistLabel: string;
  profileButtonLabel: string;
  onPressProfile: () => void;
  showButton?: boolean;
};

export function PartnerSection({
  name,
  avatar,
  rating,
  specialistLabel,
  profileButtonLabel,
  onPressProfile,
  showButton = true,
}: PartnerSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar as ImageStyle} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{specialistLabel}</Text>
        </View>
        {rating != null && (
          <View style={styles.rating}>
            <Icon name='star' size={24} color='#FFB800' />
            <Text style={styles.ratingText}>{String(rating)}</Text>
          </View>
        )}
      </View>
      {showButton && (
        <SecondaryButton
          label={profileButtonLabel}
          onPress={onPressProfile}
          style={styles.profileButton}
          size='large'
        />
      )}
    </View>
  );
}
