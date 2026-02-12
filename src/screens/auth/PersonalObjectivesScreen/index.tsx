import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Image, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import {
  Header,
  Title,
  Chip,
  PrimaryButton,
  SecondaryButton,
  ButtonGroup,
} from '@/components/ui';
import { GradientSplash6 } from '@/assets';
import { storageService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logEvent } from '@/analytics';
import { CUSTOM_EVENTS, ANALYTICS_PARAMS } from '@/analytics/constants';
import { COLORS, SPACING } from '@/constants';
import type { RootStackParamList } from '@/types/navigation';
import { useObjectives } from './useObjectives';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'PersonalObjectives'>;

const PersonalObjectivesScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'PersonalObjectives', screenClass: 'PersonalObjectivesScreen' });
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const userName = route.params?.userName || 'Usuário';
  const { objectives } = useObjectives();
  const [selectedObjectives, setSelectedObjectives] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { width: windowWidth } = useWindowDimensions();
  const adornmentStyle = useMemo(() => {
    const size = windowWidth * 0.45;
    return {
      width: size,
      height: size,
      right: -size * 0.1,
      top: -size * 0.3,
    };
  }, [windowWidth]);

  useEffect(() => {
    const loadSavedSelection = async () => {
      try {
        const ids = await storageService.getSelectedObjectivesIds();
        if (ids.length > 0) setSelectedObjectives(new Set(ids));
      } catch {
        // Ignora falha ao carregar seleção anterior
      }
    };
    loadSavedSelection();
  }, []);

  const toggleObjective = useCallback((objectiveId: string) => {
    setSelectedObjectives((prev) => {
      const next = new Set(prev);
      if (next.has(objectiveId)) next.delete(objectiveId);
      else next.add(objectiveId);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selectedObjectives.size === 0) {
      Alert.alert(t('auth.requiredField'), t('auth.objectivesSelectAtLeastOne'));
      return;
    }
    try {
      setIsSubmitting(true);
      const now = new Date().toISOString();
      await storageService.setSelectedObjectivesIds(Array.from(selectedObjectives));
      await storageService.setObjectivesSelectedAt(now);
      logEvent(CUSTOM_EVENTS.OBJECTIVES_SUBMITTED, {
        [ANALYTICS_PARAMS.SCREEN_NAME]: 'personal_objectives',
        [ANALYTICS_PARAMS.VALUE]: selectedObjectives.size,
      });
      navigation.navigate('Home');
    } catch {
      Alert.alert(t('common.error'), t('auth.objectivesSaveError'));
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedObjectives, navigation, t]);

  const handleNext = useCallback(() => handleSubmit(), [handleSubmit]);
  const handleSkip = useCallback(() => handleSubmit(), [handleSubmit]);

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Image
              source={GradientSplash6}
              style={[styles.titleAdornment, adornmentStyle]}
              resizeMode="contain"
            />
            <Title title={t('auth.personalObjectivesTitle', { userName })} variant="large" />
          </View>

          <Text style={styles.question}>{t('auth.personalObjectivesQuestion')}</Text>

          <View style={styles.chipsContainer}>
            {objectives.map((objective) => {
              const label = t(objective.i18nKey);
              const selected = selectedObjectives.has(objective.id);
              return (
                <Chip
                  key={objective.id}
                  label={label}
                  selected={selected}
                  onPress={() => toggleObjective(objective.id)}
                  selectedBackgroundColor={COLORS.HIGHLIGHT.LIGHT}
                  selectedTextColor={COLORS.NEUTRAL.LOW.PURE}
                  accessibilityLabel={label}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: SPACING.XL + insets.bottom }]}>
        <ButtonGroup style={styles.buttonGroup}>
          <PrimaryButton
            label={t('common.next')}
            onPress={handleNext}
            disabled={isSubmitting}
          />
          <SecondaryButton
            label={t('common.skipInformation')}
            onPress={handleSkip}
            disabled={isSubmitting}
          />
        </ButtonGroup>
      </View>
    </SafeAreaView>
  );
};

export default PersonalObjectivesScreen;
