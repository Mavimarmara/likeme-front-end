import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import { Header, Toggle, CTACard, Background } from '@/components/ui';
import { PlanCard, PlanDescription, ComparativeTable } from '@/components/sections/plans';
import type { ComparativeTableRow } from '@/components/sections/plans';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logButtonClick } from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
import { getNextOnboardingScreen } from '@/utils';
import { COLORS } from '@/constants';
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
    const nextScreen = getNextOnboardingScreen('Plans');
    const params = { userName };
    navigation.navigate(nextScreen as never, params as never);
  }, [navigation, userName]);

  const tabItems: { id: PlanTabId; label: string }[] = [
    { id: 'free', label: t('plans.tabFree') },
    { id: 'basic', label: t('plans.tabBasic') },
    { id: 'premium', label: t('plans.tabPremium') },
    { id: 'compare', label: t('plans.tabCompare') },
  ];

  const tabLabels = tabItems.map((tab) => tab.label);
  const selectedLabel = tabItems.find((tab) => tab.id === selectedTab)?.label ?? tabItems[0].label;
  const handleTabSelect = useCallback(
    (label: string) => {
      const tab = tabItems.find((t) => t.label === label);
      if (tab) setSelectedTab(tab.id);
    },
    [tabItems],
  );

  const freeIncludes = [
    t('plans.includeCommunity'),
    t('plans.includeProducts'),
    t('plans.includeScheduling'),
    t('plans.includePayAsYouGo'),
  ];

  const basicIncludes = [
    t('plans.basicInclude1'),
    t('plans.basicInclude2'),
    t('plans.basicInclude3'),
    t('plans.basicInclude4'),
  ];

  const premiumIncludes = [
    t('plans.premiumInclude1'),
    t('plans.premiumInclude2'),
    t('plans.premiumInclude3'),
    t('plans.premiumInclude4'),
    t('plans.premiumInclude5'),
    t('plans.premiumInclude6'),
  ];

  const compareColumnHeaders = [t('plans.tabFree'), t('plans.tabBasic'), t('plans.tabPremium')];

  const compareRows: ComparativeTableRow[] = [
    { feature: t('plans.compareFeatureCommunities'), values: ['yes', 'yes', 'yes'] },
    { feature: t('plans.compareFeatureProducts'), values: ['yes', 'yes', 'yes'] },
    { feature: t('plans.compareFeatureDiscounts'), values: ['no', 'yes', 'yes'] },
    { feature: t('plans.compareFeaturePoints'), values: ['no', 'yes', 'yes'] },
    { feature: t('plans.compareFeatureUpload'), values: ['no', 'unlimited', 'unlimited'] },
    { feature: t('plans.compareFeatureDevices'), values: ['no', 'unlimited', 'unlimited'] },
    { feature: t('plans.compareFeatureGenetic'), values: ['no', 'no', 'yes'] },
    { feature: t('plans.compareFeatureExclusive'), values: ['no', 'no', 'yes'] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header onBackPress={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <Text style={styles.title}>{t('plans.title')}</Text>

        <CTACard
          title={t('plans.betaTitle')}
          highlightText={t('plans.betaParagraph1')}
          description={[t('plans.betaParagraph2'), t('plans.betaParagraph3'), t('plans.betaParagraph4')]}
          backgroundColor={COLORS.HIGHLIGHT.LIGHT}
        />

        <View style={styles.tabsRow}>
          <Toggle options={tabLabels} selected={selectedLabel} onSelect={handleTabSelect} />
        </View>

        {selectedTab === 'free' && (
          <View style={styles.planCardWrapper}>
            <PlanCard
              title={t('plans.freeTitle')}
              slogan={t('plans.freeSlogan')}
              description={t('plans.freeDescription')}
              priceMonthly={t('plans.freePriceMonthly')}
              priceAnnual={t('plans.freePriceAnnual')}
              primaryButtonLabel={t('plans.startButton')}
              onPrimaryPress={handleStart}
            />
            <PlanDescription title={t('plans.includesTitle')} items={freeIncludes} />
          </View>
        )}

        {selectedTab === 'basic' && (
          <View style={styles.planCardWrapper}>
            <PlanCard
              title={t('plans.basicTitle')}
              slogan={t('plans.basicSlogan')}
              description={t('plans.basicDescription')}
              priceMonthly={t('plans.basicPriceMonthly')}
              priceAnnual={t('plans.basicPriceAnnual')}
              primaryButtonLabel={t('plans.startButtonBeta')}
              onPrimaryPress={handleStart}
            />
            <PlanDescription title={t('plans.includesTitle')} items={basicIncludes} />
          </View>
        )}

        {selectedTab === 'premium' && (
          <View style={styles.planCardWrapper}>
            <PlanCard
              title={t('plans.premiumTitle')}
              slogan={t('plans.premiumSlogan')}
              description={t('plans.premiumDescription')}
              priceMonthly={t('plans.premiumPriceMonthly')}
              priceAnnual={t('plans.premiumPriceAnnual')}
              primaryButtonLabel={t('plans.startButtonBeta')}
              onPrimaryPress={handleStart}
            />
            <PlanDescription title={t('plans.includesTitle')} items={premiumIncludes} />
          </View>
        )}

        {selectedTab === 'compare' && (
          <ComparativeTable
            columnHeaders={compareColumnHeaders}
            rows={compareRows}
            noLabel={t('plans.compareNo')}
            unlimitedLabel={t('plans.compareUnlimited')}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlansScreen;
