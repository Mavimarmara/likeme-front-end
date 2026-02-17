import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { Header, PrimaryButton } from '@/components/ui';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logButtonClick } from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

type PlanTabId = 'free' | 'basic' | 'premium' | 'compare';

type Props = StackScreenProps<RootStackParamList, 'Plans'>;

const PlansScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'Plans', screenClass: 'PlansScreen' });
  const { t } = useTranslation();
  const userName = route.params?.userName || 'Usuário';
  const [selectedTab, setSelectedTab] = useState<PlanTabId>('free');

  const handleBack = useCallback(() => {
    logButtonClick({
      screen_name: 'plans',
      button_label: 'back',
      action_name: 'go_back',
    });
    navigation.goBack();
  }, [navigation]);

  const handleStart = useCallback(() => {
    logButtonClick({
      screen_name: 'plans',
      button_label: 'comecar',
      action_name: 'start_plan',
    });
    navigation.navigate('PersonalObjectives', { userName });
  }, [navigation, userName]);

  const tabs: { id: PlanTabId; labelKey: string }[] = [
    { id: 'free', labelKey: 'plans.tabFree' },
    { id: 'basic', labelKey: 'plans.tabBasic' },
    { id: 'premium', labelKey: 'plans.tabPremium' },
    { id: 'compare', labelKey: 'plans.tabCompare' },
  ];

  const freeIncludes = [
    t('plans.includeCommunity'),
    t('plans.includeProducts'),
    t('plans.includeScheduling'),
    t('plans.includePayAsYouGo'),
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header onBackPress={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <Text style={styles.title}>{t('plans.title')}</Text>

        <View style={styles.betaCard}>
          <Text style={styles.betaTitle}>{t('plans.betaTitle')}</Text>
          <Text style={styles.betaText}>{t('plans.betaParagraph1')}</Text>
          <Text style={styles.betaText}>{t('plans.betaParagraph2')}</Text>
          <Text style={styles.betaText}>{t('plans.betaParagraph3')}</Text>
          <Text style={[styles.betaText, { marginBottom: 0 }]}>{t('plans.betaParagraph4')}</Text>
        </View>

        <View style={styles.tabsRow}>
          {tabs.map((tab) => {
            const isSelected = selectedTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isSelected && styles.tabSelected]}
                onPress={() => setSelectedTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}>{t(tab.labelKey)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedTab === 'free' && (
          <>
            <View style={styles.planCard}>
              <Text style={styles.planTitle}>{t('plans.freeTitle')}</Text>
              <Text style={styles.planSlogan}>{t('plans.freeSlogan')}</Text>
              <Text style={styles.planDescription}>{t('plans.freeDescription')}</Text>
              <Text style={styles.planPrice}>{t('plans.freePriceMonthly')}</Text>
              <Text style={styles.planPriceAnnual}>{t('plans.freePriceAnnual')}</Text>
              <PrimaryButton
                label={t('plans.startButton')}
                onPress={handleStart}
                style={styles.startButton}
                size='large'
              />
            </View>

            <View style={styles.includesSection}>
              <Text style={styles.includesTitle}>{t('plans.includesTitle')}</Text>
              {freeIncludes.map((item, index) => (
                <View key={index} style={styles.includeItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.includeText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {(selectedTab === 'basic' || selectedTab === 'premium' || selectedTab === 'compare') && (
          <View style={styles.planCard}>
            <Text style={styles.planDescription}>{t('plans.comingSoon')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlansScreen;
