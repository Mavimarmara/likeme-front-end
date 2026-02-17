import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
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
  /** Porcentagem 0–100 só para o avatar de mente (mental). Valor individual. */
  mindPercentage?: number;
  /** Porcentagem 0–100 só para o avatar de corpo (physical). Valor individual. */
  bodyPercentage?: number;
  onSharePress?: () => void;
  onSeeMorePress?: () => void;
  onPeriodChange?: (period: 'week' | 'month') => void;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  hasAnswers = false,
  mindPercentage = 0,
  bodyPercentage = 0,
  onSharePress,
  onSeeMorePress,
  onPeriodChange,
}) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const hasAnyAnswers = useMemo(
    () => hasAnswers || mindPercentage > 0 || bodyPercentage > 0,
    [hasAnswers, mindPercentage, bodyPercentage],
  );

  const mindAvatarSource = useMemo(
    () => (hasAnyAnswers ? MindAvatarActive : MindAvatar),
    [hasAnyAnswers],
  );
  const bodyAvatarSource = useMemo(
    () => (hasAnyAnswers ? BodyAvatarActive : BodyAvatar),
    [hasAnyAnswers],
  );

  // Tamanho de cada avatar é individual: mente usa só mindPercentage, corpo só bodyPercentage
  const mindSize = useMemo(() => getAvatarSizeFromPercentage(mindPercentage), [mindPercentage]);
  const bodySize = useMemo(() => getAvatarSizeFromPercentage(bodyPercentage), [bodyPercentage]);

  const mindDimensions = useMemo(() => getAvatarDimensions(mindSize), [mindSize]);
  const bodyDimensions = useMemo(() => getAvatarDimensions(bodySize), [bodySize]);

  const handlePeriodPress = () => {
    Alert.alert(
      t('avatar.periodTitle'),
      undefined,
      [
        { text: t('avatar.week'), onPress: () => { setSelectedPeriod('week'); onPeriodChange?.('week'); } },
        { text: t('avatar.month'), onPress: () => { setSelectedPeriod('month'); onPeriodChange?.('month'); } },
        { text: t('common.cancel'), style: 'cancel' },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t('avatar.yourAvatar')}</Text>
      </View>
      <View style={[styles.avatarsContainer, hasAnyAnswers && styles.avatarsContainerActive]}>
        {hasAnyAnswers && (
          <TouchableOpacity style={styles.weekDropdown} onPress={handlePeriodPress} activeOpacity={0.7}>
            <Text style={styles.weekText}>{t(selectedPeriod === 'week' ? 'avatar.week' : 'avatar.month')}</Text>
            <IconButton
              icon="keyboard-arrow-down"
              iconSize={20}
              iconColor={COLORS.SECONDARY.LIGHT}
              onPress={handlePeriodPress}
              showBackground={false}
              containerStyle={styles.periodIconContainer}
              iconContainerStyle={styles.periodIconBackground}
            />
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
