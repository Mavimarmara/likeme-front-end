import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Background, Header, PrimaryButton } from '@/components/ui';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { AuthService, storageService } from '@/services';
import { COLORS } from '@/constants';
import { styles } from './styles';

/** Parse "text **bold** more" into segments for rendering bold in React Native Text */
function parseBoldSegments(str: string): { text: string; bold: boolean }[] {
  const segments: { text: string; bold: boolean }[] = [];
  let remaining = str;
  let bold = false;
  while (remaining.length > 0) {
    const marker = '**';
    const idx = remaining.indexOf(marker);
    if (idx === -1) {
      segments.push({ text: remaining, bold });
      break;
    }
    if (idx > 0) {
      segments.push({ text: remaining.slice(0, idx), bold });
    }
    bold = !bold;
    remaining = remaining.slice(idx + marker.length);
  }
  return segments;
}

const SECTION_KEYS = [
  'section1',
  'section2',
  'section3',
  'section4',
  'section5',
  'section6',
  'section7',
  'section8',
  'section9',
  'section10',
  'section11',
  'section12',
] as const;

type Props = {
  navigation: any;
  route: any;
};

const PrivacyPoliciesScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'PrivacyPolicies', screenClass: 'PrivacyPoliciesScreen' });
  const { t } = useTranslation();
  const userName = route.params?.userName || 'Usuário';
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAccordion = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleAgree = useCallback(async () => {
    if (isSubmitting) return;
    const acceptedAt = new Date().toISOString();
    try {
      setIsSubmitting(true);
      await storageService.setPrivacyPolicyAcceptedAt(acceptedAt);
      await AuthService.acceptPrivacyPolicy(acceptedAt);
    } catch (error) {
      if (__DEV__ && error instanceof Error) {
        console.warn('[PrivacyPolicies] acceptPrivacyPolicy:', error.message);
      }
      // Aceite já salvo no storage; mesmo se o backend falhar, segue para Register
    } finally {
      setIsSubmitting(false);
      navigation.navigate('Register', { userName });
    }
  }, [navigation, userName, isSubmitting]);

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{t('privacyPolicies.title')}</Text>
          <Text style={styles.description}>
            {parseBoldSegments(t('privacyPolicies.description')).map((segment, i) => (
              <Text key={i} style={segment.bold ? styles.descriptionBold : undefined}>
                {segment.text}
              </Text>
            ))}
          </Text>

          <View style={styles.accordionItem}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleAccordion('intro')}
              activeOpacity={0.7}
            >
              <Text style={styles.accordionTitle}>{t('privacyPolicies.introTitle')}</Text>
              <Icon
                name={expandedId === 'intro' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color={COLORS.TEXT}
              />
            </TouchableOpacity>
            {expandedId === 'intro' && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionBody}>{t('privacyPolicies.intro')}</Text>
              </View>
            )}
          </View>

          {SECTION_KEYS.map((sectionKey, index) => {
            const id = `section-${index + 1}`;
            const isExpanded = expandedId === id;
            const titleKey = `privacyPolicies.${sectionKey}Title`;
            const contentKey = `privacyPolicies.${sectionKey}Content`;
            return (
              <View key={id} style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => toggleAccordion(id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.accordionTitle}>{t(titleKey)}</Text>
                  <Icon name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color={COLORS.TEXT} />
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.accordionBody}>{t(contentKey)}</Text>
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
