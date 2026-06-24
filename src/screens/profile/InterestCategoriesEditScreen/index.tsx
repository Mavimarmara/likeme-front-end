import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { View, Text, ScrollView, Alert } from 'react-native';
import { IconSilhouette, Loading, PrimaryButton, SelectionButtonQuiz } from '@/components/ui';
import { ScreenWithHeader, GradientBackground } from '@/components/ui/layout';
import { COLORS } from '@/constants';
import { personCategoryService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
import type { CategoryName } from '@/types/category';
import { logger } from '@/utils/logger';
import { useInterestCategories } from '@/hooks/interestCategories/useInterestCategories';
import { getMarkerGradient } from '@/constants/markers';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'InterestCategoriesEdit'>;

function categorySelectionEqual(left: Set<CategoryName>, right: Set<CategoryName>): boolean {
  if (left.size !== right.size) return false;
  for (const categoryId of left) {
    if (!right.has(categoryId)) return false;
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
  const { categories } = useInterestCategories();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<CategoryName>>(new Set());
  const [savedCategoryIds, setSavedCategoryIds] = useState<Set<CategoryName>>(new Set());
  const [isLoadingSelection, setIsLoadingSelection] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPendingChanges = useMemo(
    () => !categorySelectionEqual(selectedCategoryIds, savedCategoryIds),
    [savedCategoryIds, selectedCategoryIds],
  );

  const loadSelection = useCallback(async () => {
    setIsLoadingSelection(true);
    setLoadFailed(false);
    try {
      const categoryIds = await personCategoryService.getMySelectedCategoryIds();
      const nextSelection = new Set(categoryIds);
      setSelectedCategoryIds(nextSelection);
      setSavedCategoryIds(new Set(categoryIds));
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

  const toggleCategory = useCallback((categoryId: CategoryName) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const categoryIds = Array.from(selectedCategoryIds);
      await personCategoryService.syncMyCategories(categoryIds);
      setSavedCategoryIds(new Set(categoryIds));
      navigation.goBack();
    } catch (error) {
      logger.error('[InterestCategoriesEditScreen] Falha ao salvar categorias no backend.', error);
      Alert.alert(t('common.error'), t('profile.interestCategories.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  }, [navigation, selectedCategoryIds, t]);

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

              <View style={styles.categoriesList}>
                {categories.map((category) => {
                  const label = t(category.i18nKey);
                  const selected = selectedCategoryIds.has(category.id);
                  const gradient = getMarkerGradient(category.id);
                  return (
                    <SelectionButtonQuiz
                      key={category.id}
                      label={label}
                      selected={selected}
                      variant='profile'
                      onPress={() => toggleCategory(category.id)}
                      style={styles.categoryButton}
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
