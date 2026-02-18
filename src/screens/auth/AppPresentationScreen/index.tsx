import React, { useMemo, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui';
import { PRESENTATION_PAGES } from '@/constants/presentation';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
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

type Props = { navigation: any; route: any };

const AppPresentationScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'AppPresentation', screenClass: 'AppPresentationScreen' });
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const userName = route.params?.userName || 'Usuário';

  const pages = useMemo(() => {
    return PRESENTATION_PAGES.map((page, index) => ({
      ...page,
      title: t(`presentation.page${index + 1}Title`),
      description: t(`presentation.page${index + 1}Description`),
    }));
  }, [t]);

  const goToPrivacyPolicies = () => {
    navigation.navigate('PrivacyPolicies', { userName });
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      goToPrivacyPolicies();
    }
  };

  const handleSkip = () => {
    goToPrivacyPolicies();
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      navigation.goBack();
    }
  };

  const currentPageData = pages[currentPage];

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={handleBack} rightLabel={t('common.skip')} onRightPress={handleSkip} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image source={currentPageData.image} style={styles.image} resizeMode='cover' />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{currentPageData.title}</Text>
          <Text style={styles.description}>
            {parseBoldSegments(currentPageData.description).map((segment, i) => (
              <Text key={i} style={segment.bold ? styles.descriptionBold : undefined}>
                {segment.text}
              </Text>
            ))}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AppPresentationScreen;
