import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MindAvatar, BodyAvatar, MindAvatarActive, BodyAvatarActive, BackgroundIconButton } from '@/assets';
import { getAvatarSizeFromPercentage, getAvatarDimensions, type AvatarSize } from '@/utils/anamnesis/avatarSizeMapper';
import { styles } from './styles';

interface AvatarSectionProps {
  hasAnswers?: boolean;
  mindPercentage?: number;
  bodyPercentage?: number;
  onSharePress?: () => void;
  onSeeMorePress?: () => void;
  onWeekChange?: (week: string) => void;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  hasAnswers = false,
  mindPercentage = 0,
  bodyPercentage = 0,
  onSharePress,
  onSeeMorePress,
  onWeekChange,
}) => {
  const hasAnyAnswers = useMemo(() => hasAnswers || mindPercentage > 0 || bodyPercentage > 0, [hasAnswers, mindPercentage, bodyPercentage]);
  
  const mindAvatarSource = useMemo(() => hasAnyAnswers ? MindAvatarActive : MindAvatar, [hasAnyAnswers]);
  const bodyAvatarSource = useMemo(() => hasAnyAnswers ? BodyAvatarActive : BodyAvatar, [hasAnyAnswers]);

  const mindSize = useMemo(() => getAvatarSizeFromPercentage(mindPercentage), [mindPercentage]);
  const bodySize = useMemo(() => getAvatarSizeFromPercentage(bodyPercentage), [bodyPercentage]);

  const mindDimensions = useMemo(() => getAvatarDimensions(mindSize), [mindSize]);
  const bodyDimensions = useMemo(() => getAvatarDimensions(bodySize), [bodySize]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Your Avatar</Text>
      </View>
      <View style={[styles.avatarsContainer, hasAnyAnswers && styles.avatarsContainerActive]}>
        {hasAnyAnswers && (
          <TouchableOpacity style={styles.weekDropdown} activeOpacity={0.7}>
            <Text style={styles.weekText}>Week</Text>
            <Icon name="keyboard-arrow-down" size={20} color="#FDFBEE" />
          </TouchableOpacity>
        )}
        <View style={styles.avatarsContent}>
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
        {hasAnyAnswers && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={onSharePress} activeOpacity={0.7}>
              <View style={styles.actionIconContainerShare}>
                <Icon name="share" size={24} color="#001137" />
              </View>
              <Text style={styles.actionLabel}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onSeeMorePress} activeOpacity={0.7}>
              <View style={styles.actionIconContainer}>
                <ImageBackground
                  source={BackgroundIconButton}
                  style={styles.actionIconBackground}
                  imageStyle={styles.actionIconImageDark}
                >
                  <Icon name="add" size={24} color="#FDFBEE" style={styles.actionIcon} />
                </ImageBackground>
              </View>
              <Text style={styles.actionLabel}>See more</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default AvatarSection;

