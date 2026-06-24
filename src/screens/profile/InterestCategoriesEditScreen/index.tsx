import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { View, Text, ScrollView, Alert } from 'react-native';
import { IconSilhouette, Loading, PrimaryButton, SelectionButtonQuiz } from '@/components/ui';
import { ScreenWithHeader, GradientBackground } from '@/components/ui/layout';
import { COLORS } from '@/constants';
import { personalObjectivesService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
import { logger } from '@/utils/logger';
import {
  useInterestCategoryMarkers,
  objectiveNameToMarkerId,
} from '@/hooks/interestCategories/useInterestCategoryMarkers';
import { getMarkerGradient } from '@/constants/markers';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'InterestCategoriesEdit'>;

function markerSetsEqual(left: Set<string>, right: Set<string>): boolean {
  if (left.size !== right.size) return false;
  for (const markerId of left) {
    if (!right.has(markerId)) return false;
  }
  return true;
}

const InterestCategoriesEditScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({
    screenName: 'InterestCategoriesEdit',
    screenClass: 'InterestCategoriesEditScreen',
  });
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { markers } = useInterestCategoryMarkers();
  const [selectedMarkers, setSelectedMarkers] = useState<Set<string>>(new Set());
  const [savedMarkerIds, setSavedMarkerIds] = useState<Set<string>>(new Set());
  const [isLoadingSelection, setIsLoadingSelection] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPendingChanges = useMemo(
    () => !markerSetsEqual(selectedMarkers, savedMarkerIds),
    [savedMarkerIds, selectedMarkers],
  );

  const loadSelection = useCallback(async () => {
    setIsLoadingSelection(true);
    setLoadFailed(false);
    try {
      const objectives = await personalObjectivesService.getMySelectedObjectives();
      const ids = objectives.map((obj) => objectiveNameToMarkerId(obj.name)).filter((id): id is string => id != null);
      const nextSelection = new Set(ids);
      setSelectedMarkers(nextSelection);
      setSavedMarkerIds(new Set(ids));
    } catch (error) {
      logger.error('[InterestCategoriesEditScreen] Falha ao carregar categorias do backend.', error);
      setLoadFailed(true);
    } finally {
      setIsLoadingSelection(false);
    }
  }, []);

  useEffect(() => {
    void loadSelection();
  }, [loadSelection]);

  const toggleMarker = useCallback((markerId: string) => {
    setSelectedMarkers((prev) => {
      const next = new Set(prev);
      if (next.has(markerId)) next.delete(markerId);
      else next.add(markerId);
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const markerIds = Array.from(selectedMarkers);
      await personalObjectivesService.syncMyObjectivesFromMarkerIds(markerIds);
      setSavedMarkerIds(new Set(markerIds));
      navigation.goBack();
    } catch (error) {
      logger.error('[InterestCategoriesEditScreen] Falha ao salvar categorias no backend.', error);
      Alert.alert(t('common.error'), t('profile.interestCategories.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  }, [navigation, selectedMarkers, t]);

  const saveDisabled = !hasPendingChanges || isSubmitting || (isLoadingSelection && !loadFailed);

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{
        onBackPress: () => navigation.goBack(),
        backgroundColor: COLORS.SECONDARY.LIGHT,
      }}
      contentBackgroundColor={COLORS.BACKGROUND}
      contentContainerStyle={styles.container}
    >
      <GradientBackground colors={['#958AAA', '#D8E4D6', '#F4F3EC']} />
      {isLoadingSelection ? (
        <Loading message={t('auth.loadingObjectives')} fullScreen />
      ) : loadFailed ? (
        <View style={styles.loadErrorBlock}>
          <Text style={styles.loadErrorText}>{t('profile.interestCategories.loadError')}</Text>
          <PrimaryButton label={t('common.retry')} onPress={() => void loadSelection()} size='large' />
        </View>
      ) : (
        <View style={styles.layout}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
              <View style={styles.instructionBlock}>
                <Text style={styles.title}>{t('profile.interestCategories.title')}</Text>
                <View style={styles.instructionTexts}>
                  <Text style={styles.supportText}>{t('profile.interestCategories.supportText')}</Text>
                  <Text style={styles.instruction}>{t('profile.interestCategories.instruction')}</Text>
                  <Text style={styles.note}>{t('profile.interestCategories.multiSelectNote')}</Text>
                </View>
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
                      variant='profile'
                      onPress={() => toggleMarker(marker.id)}
                      style={styles.markerButton}
                      iconRight={<IconSilhouette tintColor={gradient} size='xsmall' />}
                    />
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
            <PrimaryButton
              label={t('profile.interestCategories.save')}
              onPress={handleSave}
              disabled={saveDisabled}
              solidDisabled
              loading={isSubmitting}
              size='large'
            />
          </View>
        </View>
      )}
    </ScreenWithHeader>
  );
};

export default InterestCategoriesEditScreen;
