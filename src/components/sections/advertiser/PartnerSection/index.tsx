import React from 'react';
import { Text, View, type ImageStyle } from 'react-native';
import { SecondaryButton } from '@/components/ui/buttons';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { styles } from './styles';

type PartnerSectionProps = {
  name: string;
  avatar?: string;
  specialistLabel: string;
  profileButtonLabel?: string;
  onPressProfile?: () => void;
};

export function PartnerSection({
  name,
  avatar,
  specialistLabel,
  profileButtonLabel,
  onPressProfile,
}: PartnerSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {avatar ? (
          <CachedImage source={{ uri: avatar }} style={styles.avatar as ImageStyle} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]} />
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{specialistLabel}</Text>
        </View>
      </View>
      {onPressProfile ? (
        <SecondaryButton
          label={profileButtonLabel ?? ''}
          onPress={onPressProfile}
          style={styles.profileButton}
          size='large'
        />
      ) : null}
    </View>
  );
}
