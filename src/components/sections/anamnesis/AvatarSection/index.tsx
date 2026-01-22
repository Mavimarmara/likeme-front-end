import React from 'react';
import { View, Text, Image } from 'react-native';
import { MindAvatar, BodyAvatar, MindAvatarActive, BodyAvatarActive } from '@/assets';
import { getAvatarSizeFromPercentage, getAvatarDimensions, type AvatarSize } from '@/utils/anamnesis/avatarSizeMapper';
import { styles } from './styles';

interface AvatarSectionProps {
  hasAnswers?: boolean;
  mindPercentage?: number;
  bodyPercentage?: number;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  hasAnswers = false,
  mindPercentage = 0,
  bodyPercentage = 0,
}) => {
  const mindAvatarSource = hasAnswers ? MindAvatarActive : MindAvatar;
  const bodyAvatarSource = hasAnswers ? BodyAvatarActive : BodyAvatar;

  // Calcular tamanhos baseados nas porcentagens
  const mindSize: AvatarSize = getAvatarSizeFromPercentage(mindPercentage);
  const bodySize: AvatarSize = getAvatarSizeFromPercentage(bodyPercentage);

  const mindDimensions = getAvatarDimensions(mindSize);
  const bodyDimensions = getAvatarDimensions(bodySize);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Avatar</Text>
      <View style={[styles.avatarsContainer, hasAnswers && styles.avatarsContainerActive]}>
        <View style={styles.avatarItem}>
          <Text style={styles.avatarLabel}>MIND</Text>
          <Image
            source={mindAvatarSource}
            style={[styles.mindAvatar, { width: mindDimensions.width, height: mindDimensions.height }]}
            resizeMode="cover"
          />
        </View>
        <View style={styles.avatarItem}>
          <Image
            source={bodyAvatarSource}
            style={[styles.bodyAvatar, { width: bodyDimensions.width, height: bodyDimensions.height }]}
            resizeMode="cover"
          />
          <Text style={styles.avatarLabel}>BODY</Text>
        </View>
      </View>
    </View>
  );
};

export default AvatarSection;

