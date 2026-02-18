import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { View, Text, ScrollView, Image, useWindowDimensions, Alert } from 'react-native';
import { Header, IconSilhouette, PrimaryButton, SelectionButtonQuiz } from '@/components/ui';
import { GradientSplash6 } from '@/assets';
import { personalObjectivesService, storageService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logEvent } from '@/analytics';
import { CUSTOM_EVENTS, ANALYTICS_PARAMS } from '@/analytics/constants';
import { SPACING } from '@/constants';
import type { RootStackParamList } from '@/types/navigation';
import { getNextOnboardingScreen } from '@/utils';
import { useMarkers, objectiveNameToMarkerId } from './useMarkers';
import { styles } from './styles';
import { getMarkerGradient } from '@/constants/markers';

type Props = StackScreenProps<RootStackParamList, 'PersonalObjectives'>;

const PersonalObjectivesScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'PersonalObjectives', screenClass: 'PersonalObjectivesScreen' });
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const userName = route.params?.userName || 'Usuário';
  const { markers } = useMarkers();
  const [selectedMarkers, setSelectedMarkers] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { width: windowWidth } = useWindowDimensions();

  const adornmentStyle = useMemo(() => {
    const size = windowWidth * 0.45;
    return {
      width: size,
      height: size,
      top: -size * 0.1,
    };
  }, [windowWidth]);

  useEffect(() => {
    const loadSelection = async () => {
      try {
        const objectives = await personalObjectivesService.getMySelectedObjectives();
        const ids = objectives.map((obj) => objectiveNameToMarkerId(obj.name)).filter((id): id is string => id != null);
        if (ids.length > 0) {
          setSelectedMarkers(new Set(ids));
          return;
        }
      } catch {}
      try {
        const ids = await storageService.getSelectedObjectivesIds();
        if (ids.length > 0) setSelectedMarkers(new Set(ids));
      } catch {}
    };
    loadSelection();
  }, []);

  const toggleMarker = useCallback((markerId: string) => {
    setSelectedMarkers((prev) => {
      const next = new Set(prev);
      if (next.has(markerId)) next.delete(markerId);
      else next.add(markerId);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selectedMarkers.size === 0) {
      Alert.alert(t('auth.requiredField'), t('auth.objectivesSelectAtLeastOne'));
      return;
    }
    try {
      setIsSubmitting(true);
      const now = new Date().toISOString();
      await storageService.setSelectedObjectivesIds(Array.from(selectedMarkers));
      await storageService.setObjectivesSelectedAt(now);
      logEvent(CUSTOM_EVENTS.OBJECTIVES_SUBMITTED, {
        [ANALYTICS_PARAMS.SCREEN_NAME]: 'personal_objectives',
        [ANALYTICS_PARAMS.VALUE]: selectedMarkers.size,
      });
      const nextScreen = getNextOnboardingScreen('PersonalObjectives');
      navigation.navigate(nextScreen as never);
    } catch {
      Alert.alert(t('common.error'), t('auth.objectivesSaveError'));
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedMarkers, navigation, t]);

  const handleSkip = useCallback(() => {
    const nextScreen = getNextOnboardingScreen('PersonalObjectives');
    navigation.navigate(nextScreen as never);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} rightLabel={t('common.skip')} onRightPress={handleSkip} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Image source={GradientSplash6} style={[styles.titleAdornment, adornmentStyle]} resizeMode='contain' />
          <Text style={styles.greeting}>{userName},</Text>
          <Text style={styles.question}>{t('auth.personalObjectivesQuestion')}</Text>

          <View style={styles.markersList}>
            {markers.map((marker) => {
              const label = t(marker.i18nKey);
              const selected = selectedMarkers.has(marker.id);
              const gradient = getMarkerGradient(marker.id);
              return (
                <SelectionButtonQuiz
                  key={marker.id}
                  label={label}
                  selected={selected}
                  size='small'
                  onPress={() => toggleMarker(marker.id)}
                  style={styles.markerButton}
                  iconRight={<IconSilhouette tintColor={gradient} size='xsmall' />}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: SPACING.XL + insets.bottom }]}>
        <PrimaryButton
          label={t('common.save')}
          onPress={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
          style={styles.saveButton}
          size='large'
        />
      </View>
    </SafeAreaView>
  );
};

export default PersonalObjectivesScreen;
