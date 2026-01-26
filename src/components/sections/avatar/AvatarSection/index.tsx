import React, { useMemo } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  MindAvatar,
  BodyAvatar,
  MindAvatarActive,
  BodyAvatarActive,
  BackgroundIconButton,
} from '@/assets';
import { IconButton } from '@/components/ui/buttons';
import { COLORS } from '@/constants';
import {
  getAvatarSizeFromPercentage,
  getAvatarDimensions,
  type AvatarSize,
} from '@/utils/anamnesis/avatarSizeMapper';
import { useTranslation } from '@/hooks/i18n';
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
  const { t } = useTranslation();
  const hasAnyAnswers = useMemo(
    () => hasAnswers || mindPercentage > 0 || bodyPercentage > 0,
    [hasAnswers, mindPercentage, bodyPercentage]
  );

  const mindAvatarSource = useMemo(
    () => (hasAnyAnswers ? MindAvatarActive : MindAvatar),
    [hasAnyAnswers]
  );
  const bodyAvatarSource = useMemo(
    () => (hasAnyAnswers ? BodyAvatarActive : BodyAvatar),
    [hasAnyAnswers]
  );

  const mindSize = useMemo(() => getAvatarSizeFromPercentage(mindPercentage), [mindPercentage]);
  const bodySize = useMemo(() => getAvatarSizeFromPercentage(bodyPercentage), [bodyPercentage]);

  const mindDimensions = useMemo(() => getAvatarDimensions(mindSize), [mindSize]);
  const bodyDimensions = useMemo(() => getAvatarDimensions(bodySize), [bodySize]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t('avatar.yourAvatar')}</Text>
      </View>
      <View style={[styles.avatarsContainer, hasAnyAnswers && styles.avatarsContainerActive]}>
        {hasAnyAnswers && (
          <TouchableOpacity style={styles.weekDropdown} activeOpacity={0.7}>
            <Text style={styles.weekText}>{t('avatar.week')}</Text>
            <Icon name="keyboard-arrow-down" size={20} color={COLORS.SECONDARY.LIGHT} />
          </TouchableOpacity>
        )}
        <View style={styles.avatarsContent}>
          <View style={styles.avatarItem}>
            <Text style={styles.avatarLabel}>{t('avatar.mind')}</Text>
            <Image
              source={mindAvatarSource}
              style={[
                styles.mindAvatar,
                { width: mindDimensions.width, height: mindDimensions.height },
              ]}
              resizeMode="cover"
            />
          </View>
          <View style={styles.avatarItem}>
            <Image
              source={bodyAvatarSource}
              style={[
                styles.bodyAvatar,
                { width: bodyDimensions.width, height: bodyDimensions.height },
              ]}
              resizeMode="cover"
            />
            <Text style={styles.avatarLabel}>{t('avatar.body')}</Text>
          </View>
        </View>
        {hasAnyAnswers && (
          <View style={styles.actionsContainer}>
            <IconButton
              icon="share"
              iconSize={24}
              iconColor={COLORS.TEXT}
              onPress={onSharePress || (() => {})}
              label={t('avatar.share')}
              showBackground={false}
            />
            <IconButton
              icon="add"
              iconSize={24}
              iconColor={COLORS.SECONDARY.LIGHT}
              onPress={onSeeMorePress || (() => {})}
              label={t('avatar.seeMore')}
              backgroundTintColor={COLORS.TEXT}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default AvatarSection;
