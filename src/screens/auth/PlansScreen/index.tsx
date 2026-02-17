import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, PrimaryButton, Toggle } from '@/components/ui';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logButtonClick } from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
import { getNextOnboardingScreen } from '@/utils';
import { COLORS } from '@/constants';
import { styles } from './styles';

type PlanTabId = 'free' | 'basic' | 'premium' | 'compare';

type Props = StackScreenProps<RootStackParamList, 'Plans'>;

type CompareCell = 'yes' | 'no' | 'unlimited';

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

  const compareRows: { featureKey: string; free: CompareCell; basic: CompareCell; premium: CompareCell }[] = [
    { featureKey: 'plans.compareFeatureCommunities', free: 'yes', basic: 'yes', premium: 'yes' },
    { featureKey: 'plans.compareFeatureProducts', free: 'yes', basic: 'yes', premium: 'yes' },
    { featureKey: 'plans.compareFeatureDiscounts', free: 'no', basic: 'yes', premium: 'yes' },
    { featureKey: 'plans.compareFeaturePoints', free: 'no', basic: 'yes', premium: 'yes' },
    { featureKey: 'plans.compareFeatureUpload', free: 'no', basic: 'unlimited', premium: 'unlimited' },
    { featureKey: 'plans.compareFeatureDevices', free: 'no', basic: 'unlimited', premium: 'unlimited' },
    { featureKey: 'plans.compareFeatureGenetic', free: 'no', basic: 'no', premium: 'yes' },
    { featureKey: 'plans.compareFeatureExclusive', free: 'no', basic: 'no', premium: 'yes' },
  ];

  const renderPlanCard = (
    titleKey: string,
    sloganKey: string,
    descriptionKey: string,
    priceMonthlyKey: string,
    priceAnnualKey: string,
    includes: string[],
    buttonLabelKey: string,
  ) => (
    <>
      <View style={styles.planCard}>
        <Text style={styles.planTitle}>{t(titleKey)}</Text>
        <Text style={styles.planSlogan}>{t(sloganKey)}</Text>
        <Text style={styles.planDescription}>{t(descriptionKey)}</Text>
        <Text style={styles.planPrice}>{t(priceMonthlyKey)}</Text>
        <Text style={styles.planPriceAnnual}>{t(priceAnnualKey)}</Text>
        <PrimaryButton label={t(buttonLabelKey)} onPress={handleStart} style={styles.startButton} size='large' />
      </View>
      <View style={styles.includesSection}>
        <Text style={styles.includesTitle}>{t('plans.includesTitle')}</Text>
        {includes.map((item, index) => (
          <View key={index} style={styles.includeItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.includeText}>{item}</Text>
          </View>
        ))}
      </View>
    </>
  );

  const renderCompareCell = (cell: CompareCell) => {
    if (cell === 'yes') {
      return <Icon name='check' size={20} color={COLORS.WHITE} />;
    }
    if (cell === 'unlimited') {
      return <Text style={styles.compareCellText}>{t('plans.compareUnlimited')}</Text>;
    }
    return <Text style={styles.compareCellText}>{t('plans.compareNo')}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Toggle
            options={tabLabels}
            selected={selectedLabel}
            onSelect={handleTabSelect}
          />
        </View>

        {selectedTab === 'free' &&
          renderPlanCard(
            'plans.freeTitle',
            'plans.freeSlogan',
            'plans.freeDescription',
            'plans.freePriceMonthly',
            'plans.freePriceAnnual',
            freeIncludes,
            'plans.startButton',
          )}

        {selectedTab === 'basic' &&
          renderPlanCard(
            'plans.basicTitle',
            'plans.basicSlogan',
            'plans.basicDescription',
            'plans.basicPriceMonthly',
            'plans.basicPriceAnnual',
            basicIncludes,
            'plans.startButtonBeta',
          )}

        {selectedTab === 'premium' &&
          renderPlanCard(
            'plans.premiumTitle',
            'plans.premiumSlogan',
            'plans.premiumDescription',
            'plans.premiumPriceMonthly',
            'plans.premiumPriceAnnual',
            premiumIncludes,
            'plans.startButtonBeta',
          )}

        {selectedTab === 'compare' && (
          <View style={styles.compareTable}>
            <View style={styles.compareHeaderRow}>
              <View style={styles.compareFeatureCol} />
              <Text style={styles.compareHeaderCell}>{t('plans.tabFree')}</Text>
              <Text style={styles.compareHeaderCell}>{t('plans.tabBasic')}</Text>
              <Text style={styles.compareHeaderCell}>{t('plans.tabPremium')}</Text>
            </View>
            {compareRows.map((row, index) => (
              <View key={index} style={styles.compareRow}>
                <Text style={styles.compareFeatureCell} numberOfLines={2}>
                  {t(row.featureKey)}
                </Text>
                <View style={styles.compareCell}>{renderCompareCell(row.free)}</View>
                <View style={styles.compareCell}>{renderCompareCell(row.basic)}</View>
                <View style={styles.compareCell}>{renderCompareCell(row.premium)}</View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlansScreen;
