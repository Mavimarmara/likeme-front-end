import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { View, Text, ScrollView, Image, useWindowDimensions, Alert } from 'react-native';
import { IconSilhouette, PrimaryButton, SelectionButtonQuiz } from '@/components/ui';
import { ScreenWithHeader } from '@/components/ui/layout';
import { CTACard } from '@/components/ui/cards';
import { COLORS, SPACING } from '@/constants';
import { GradientSplash6 } from '@/assets/auth';
import { personalObjectivesService, storageService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logEvent } from '@/analytics';
import { CUSTOM_EVENTS, ANALYTICS_PARAMS } from '@/analytics/constants';
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
  const firstName = route.params?.firstName || 'Usuário';
  const { markers } = useMarkers();
  const [selectedMarkers, setSelectedMarkers] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [betaBannerVisible, setBetaBannerVisible] = useState(true);
  const { width: windowWidth } = useWindowDimensions();

  const adornmentStyle = useMemo(() => {
    const size = windowWidth * 0.5;
    return {
      width: size,
      height: size,
      top: -size * 0.25,
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
      } catch (error) {
        console.error('[PersonalObjectivesScreen] Falha ao carregar objetivos do backend.', error);
      }
      try {
        const ids = await storageService.getSelectedObjectivesIds();
        if (ids.length > 0) setSelectedMarkers(new Set(ids));
      } catch (error) {
        console.error('[PersonalObjectivesScreen] Falha ao carregar objetivos salvos localmente.', error);
      }
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
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{ onBackPress: () => navigation.goBack(), rightLabel: t('common.skip'), onRightPress: handleSkip }}
      contentContainerStyle={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: SPACING.XXL + Math.max(insets.bottom, SPACING.MD) },
        ]}
      >
        <View style={styles.content}>
          <Image source={GradientSplash6} style={[styles.titleAdornment, adornmentStyle]} resizeMode='contain' />
          <Text style={styles.greeting}>{firstName},</Text>
          {betaBannerVisible && (
            <CTACard
              title={t('auth.personalObjectivesCardTitle')}
              titleStyle={styles.betaCardTitle}
              highlightText={t('auth.personalObjectivesCardHighlightText')}
              description={t('auth.personalObjectivesCardDescription')}
              backgroundColor={COLORS.HIGHLIGHT.LIGHT}
              style={styles.ctaCard}
              onClose={() => setBetaBannerVisible(false)}
            />
          )}
          <View style={styles.instructionBlock}>
            <Text style={styles.question}>{t('auth.personalObjectivesQuestion')}</Text>
            <Text style={styles.description}>{t('auth.personalObjectivesQuestioDescription')}</Text>
          </View>

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

          <PrimaryButton
            label={t('auth.personalObjectivesStart')}
            onPress={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
            style={styles.saveButton}
            size='large'
          />
        </View>
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default PersonalObjectivesScreen;
