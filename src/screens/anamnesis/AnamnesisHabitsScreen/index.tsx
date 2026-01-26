import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui';
import { PrimaryButton } from '@/components/ui/buttons';
import { useAnamnesisQuestionnaire } from '@/hooks';
import {
  buildSingleChoiceAnswerKey,
  parseSingleChoiceAnswerKey,
} from '@/hooks/anamnesis/anamnesisAnswerMappers';
import { COLORS } from '@/constants';
import { styles } from './styles';

type HabitKeyPrefix =
  | 'habits_movimento'
  | 'habits_espiritualidade'
  | 'habits_sono'
  | 'habits_nutricao'
  | 'habits_estresse'
  | 'habits_autoestima'
  | 'habits_relacionamentos'
  | 'habits_saude_bucal'
  | 'habits_proposito';

type Props = {
  navigation: any;
  route: {
    params: {
      title: string;
      keyPrefix: HabitKeyPrefix;
    };
  };
};

function getQuestionBodyText(questionText: string | null, title: string) {
  if (!questionText) {
    return '';
  }
  const trimmed = questionText.trim();
  const [first, ...rest] = trimmed.split('\n');
  if (first.trim().toLowerCase() === title.trim().toLowerCase() && rest.length > 0) {
    return rest.join('\n').trim();
  }
  return trimmed;
}

const AnamnesisHabitsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { title, keyPrefix } = route.params;
  const [stepIndex, setStepIndex] = useState(0);

  const { questions, answers, loading, completing, error, setAnswer, complete } =
    useAnamnesisQuestionnaire<string>({
      locale: 'pt-BR',
      keyPrefix,
      parseAnswer: parseSingleChoiceAnswerKey,
      buildAnswer: buildSingleChoiceAnswerKey,
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
  }, [error, navigation]);

  useEffect(() => {
    if (stepIndex > 0 && stepIndex >= questions.length) {
      setStepIndex(Math.max(questions.length - 1, 0));
    }
  }, [questions.length, stepIndex]);

  const currentQuestion = questions[stepIndex];
  const totalSteps = Math.max(questions.length, 0);
  const progressText = useMemo(() => {
    if (!totalSteps) {
      return '0/0';
    }
    return `${stepIndex + 1}/${totalSteps}`;
  }, [stepIndex, totalSteps]);

  const selectedKey = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleClose = () => {
    navigation.goBack();
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      navigation.goBack();
      return;
    }
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = async () => {
    if (totalSteps === 0) {
      navigation.goBack();
      return;
    }

    if (stepIndex < totalSteps - 1) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    try {
      await complete();
      navigation.navigate('AnamnesisCompletion');
    } catch {
      Alert.alert(t('errors.error'), t('anamnesis.finalizationError'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerText}>
          <Text style={styles.screenTitle}>{t('anamnesis.habitsTitle')}</Text>
          <Text style={styles.screenSubtitle}>
            {t('anamnesis.habitsSubtitle')}
          </Text>
          <Text style={styles.screenDescription}>
            {t('anamnesis.habitsDescription')}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTopicTitle}>{title}</Text>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardProgress}>{progressText}</Text>
              <TouchableOpacity
                onPress={handleClose}
                activeOpacity={0.7}
                style={styles.closeButton}
              >
                <Icon name="close" size={18} color={COLORS.TEXT} />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardQuestionText}>
              {getQuestionBodyText(currentQuestion?.text ?? null, title)}
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={COLORS.TEXT} />
            </View>
          ) : totalSteps === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>{t('anamnesis.noQuestionsAvailable')}</Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {(currentQuestion?.answerOptions ?? []).map((opt) => {
                const isSelected = selectedKey === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                    activeOpacity={0.75}
                    onPress={() => setAnswer(currentQuestion.id, opt.key)}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {opt.text ?? opt.key}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.footer}>
            <PrimaryButton
              label={t('common.back')}
              onPress={handleBack}
              variant="light"
              icon="chevron-left"
              iconPosition="left"
              style={styles.backButton}
            />
            <PrimaryButton
              label={
                totalSteps === 0 ? t('common.close') : stepIndex === totalSteps - 1 ? t('common.finalize') : t('common.next')
              }
              onPress={handleNext}
              icon="chevron-right"
              iconPosition="right"
              disabled={completing}
              style={styles.nextButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnamnesisHabitsScreen;
