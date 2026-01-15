import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui';
import { PrimaryButton } from '@/components/ui/buttons';
import { useAnamnesisQuestionnaire } from '@/hooks';
import { buildSingleChoiceAnswerKey, parseSingleChoiceAnswerKey } from '@/hooks/anamnesis/anamnesisAnswerMappers';
import { styles } from './styles';

type HabitKeyPrefix =
  | 'habits_movimento'
  | 'habits_espiritualidade'
  | 'habits_sono'
  | 'habits_alimentacao'
  | 'habits_estresse';

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
  const { title, keyPrefix } = route.params;
  const [stepIndex, setStepIndex] = useState(0);

  const {
    questions,
    answers,
    loading,
    completing,
    error,
    setAnswer,
    complete,
  } = useAnamnesisQuestionnaire<string>({
    locale: 'pt-BR',
    keyPrefix,
    parseAnswer: parseSingleChoiceAnswerKey,
    buildAnswer: buildSingleChoiceAnswerKey,
  });

  useEffect(() => {
    if (!error) {
      return;
    }
    Alert.alert('Erro', error, [
      {
        text: 'OK',
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
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível finalizar a anamnese. Tente novamente.');
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
          <Text style={styles.screenTitle}>HÁBITOS</Text>
          <Text style={styles.screenSubtitle}>
            Aqui a gente olha para as suas rotinas e escolhas, sem julgamentos.
          </Text>
          <Text style={styles.screenDescription}>
            Responda pensando no que mais se aproxima do seu dia a dia na última semana.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTopicTitle}>{title}</Text>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardProgress}>{progressText}</Text>
              <TouchableOpacity onPress={handleClose} activeOpacity={0.7} style={styles.closeButton}>
                <Icon name="close" size={18} color="#001137" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardQuestionText}>
              {getQuestionBodyText(currentQuestion?.text ?? null, title)}
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#001137" />
            </View>
          ) : totalSteps === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Nenhuma pergunta disponível no momento.</Text>
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
              label="Voltar"
              onPress={handleBack}
              variant="light"
              icon="chevron-left"
              iconPosition="left"
              style={styles.backButton}
            />
            <PrimaryButton
              label={totalSteps === 0 ? 'Fechar' : stepIndex === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
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


