import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui';
import { PrimaryButton } from '@/components/ui/buttons';
import { NumberScale } from '@/components/ui/inputs';
import { useAnamnesisQuestionnaire } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { buildMindAnswer, parseMindAnswer } from '@/hooks/anamnesis/anamnesisAnswerMappers';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = { navigation: any };

const AnamnesisMindScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'AnamnesisMind', screenClass: 'AnamnesisMindScreen' });
  const { t } = useTranslation();
  const { questions, answers, loading, completing, error, unansweredCount, setAnswer, complete } =
    useAnamnesisQuestionnaire<number>({
      locale: 'pt-BR',
      keyPrefix: 'mental',
      parseAnswer: parseMindAnswer,
      buildAnswer: buildMindAnswer,
    });

  useEffect(() => {
    if (!error) {
      return;
    }

    Alert.alert(t('errors.error'), error, [
      {
        text: t('common.ok'),
        onPress: () => navigation.goBack(),
      },
    ]);
  }, [error, navigation, t]);

  const handleFinish = async () => {
    if (unansweredCount > 0) {
      Alert.alert(
        t('anamnesis.unansweredQuestions'),
        t('anamnesis.unansweredQuestionsMessage', { count: unansweredCount }),
        [{ text: t('common.ok') }]
      );
      return;
    }

    try {
      await complete();
      navigation.navigate('AnamnesisCompletion');
    } catch (err) {
      Alert.alert(
        t('errors.error'),
        err instanceof Error ? err.message : t('anamnesis.finalizationError')
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{t('anamnesis.loadingQuestions')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>{t('anamnesis.mindTitle')}</Text>
            <Text style={styles.subtitle}>{t('anamnesis.mindSubtitle')}</Text>
            <Text style={styles.introText}>
              {t('anamnesis.mindIntro')}
            </Text>
          </View>

          <View style={styles.questionsContainer}>
            {questions.map((question, index) => (
              <View key={question.id} style={styles.questionSection}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>{index + 1}.</Text>
                  <View style={styles.questionTextContainer}>
                    <Text style={styles.questionTitle}>{question.text || question.key}</Text>
                  </View>
                </View>
                <NumberScale
                  selectedValue={answers[question.id]}
                  onValueChange={(value) => setAnswer(question.id, value)}
                />
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              label={completing ? t('common.finalizing') : t('common.finalize')}
              onPress={handleFinish}
              style={styles.finishButton}
              disabled={completing}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnamnesisMindScreen;
