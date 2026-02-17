import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, PrimaryButton } from '@/components/ui';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { AuthService } from '@/services';
import { COLORS } from '@/constants';
import { styles } from './styles';

type PolicyTab = 'data' | 'communication' | 'notification';

type AccordionItem = {
  id: string;
  titleKey: string;
  contentKey: string;
};

const DATA_ITEMS: AccordionItem[] = [
  {
    id: 'data-security',
    titleKey: 'privacyPolicies.policyDataSecurity',
    contentKey: 'privacyPolicies.policyDataSecurityContent',
  },
  {
    id: 'privacy-usage',
    titleKey: 'privacyPolicies.policyPrivacyUsage',
    contentKey: 'privacyPolicies.policyPrivacyUsageContent',
  },
  {
    id: 'health-data',
    titleKey: 'privacyPolicies.policyHealthData',
    contentKey: 'privacyPolicies.policyHealthDataContent',
  },
];

const COMMUNICATION_ITEMS: AccordionItem[] = [
  {
    id: 'channels',
    titleKey: 'privacyPolicies.policyCommunicationChannels',
    contentKey: 'privacyPolicies.policyCommunicationChannelsContent',
  },
  {
    id: 'marketing',
    titleKey: 'privacyPolicies.policyMarketing',
    contentKey: 'privacyPolicies.policyMarketingContent',
  },
  {
    id: 'support',
    titleKey: 'privacyPolicies.policySupport',
    contentKey: 'privacyPolicies.policySupportContent',
  },
];

const NOTIFICATION_ITEMS: AccordionItem[] = [
  {
    id: 'types',
    titleKey: 'privacyPolicies.policyNotificationTypes',
    contentKey: 'privacyPolicies.policyNotificationTypesContent',
  },
  {
    id: 'preferences',
    titleKey: 'privacyPolicies.policyNotificationPreferences',
    contentKey: 'privacyPolicies.policyNotificationPreferencesContent',
  },
  {
    id: 'push',
    titleKey: 'privacyPolicies.policyPushSettings',
    contentKey: 'privacyPolicies.policyPushSettingsContent',
  },
];

const TAB_ITEMS: { key: PolicyTab; labelKey: string }[] = [
  { key: 'data', labelKey: 'privacyPolicies.tabData' },
  { key: 'communication', labelKey: 'privacyPolicies.tabCommunication' },
  { key: 'notification', labelKey: 'privacyPolicies.tabNotification' },
];

type Props = {
  navigation: any;
  route: any;
};

const PrivacyPoliciesScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'PrivacyPolicies', screenClass: 'PrivacyPoliciesScreen' });
  const { t } = useTranslation();
  const userName = route.params?.userName || 'Usuário';
  const [activeTab, setActiveTab] = useState<PolicyTab>('data');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getItems = useCallback((): AccordionItem[] => {
    if (activeTab === 'data') return DATA_ITEMS;
    if (activeTab === 'communication') return COMMUNICATION_ITEMS;
    return NOTIFICATION_ITEMS;
  }, [activeTab]);

  const toggleAccordion = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleAgree = useCallback(async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await AuthService.acceptPrivacyPolicy();
    } catch (error) {
      // Endpoint pode não existir ainda no backend (404); não bloqueia o fluxo.
      if (__DEV__ && error instanceof Error) {
        console.warn('[PrivacyPolicies] acceptPrivacyPolicy:', error.message);
      }
    } finally {
      setIsSubmitting(false);
      navigation.navigate('Register', { userName });
    }
  }, [navigation, userName, isSubmitting]);

  const items = getItems();

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{t('privacyPolicies.title')}</Text>
          <Text style={styles.intro}>{t('privacyPolicies.intro')}</Text>
          <Text style={styles.inControl}>{t('privacyPolicies.inControl')}</Text>

          <View style={styles.tabsContainer}>
            {TAB_ITEMS.map(({ key, labelKey }) => (
              <TouchableOpacity
                key={key}
                style={[styles.tab, activeTab === key && styles.tabActive]}
                onPress={() => setActiveTab(key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{t(labelKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <View key={item.id} style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleAccordion(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.accordionTitle}>{t(item.titleKey)}</Text>
                  <Icon name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={COLORS.TEXT} />
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.accordionBody}>{t(item.contentKey)}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>{t('privacyPolicies.disclaimer')}</Text>
        <PrimaryButton
          label={t('privacyPolicies.agreeButton')}
          onPress={handleAgree}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPoliciesScreen;
