import React, { useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui';
import { PrimaryButton } from '@/components/ui/buttons';
import { NumberScale } from '@/components/ui/inputs';
import { useAnamnesisQuestionnaire } from '@/hooks';
import { buildMindAnswer, parseMindAnswer } from '@/hooks/anamnesis/anamnesisAnswerMappers';
import { styles } from './styles';

type Props = { navigation: any };

const AnamnesisMindScreen: React.FC<Props> = ({ navigation }) => {
  const {
    questions,
    answers,
    loading,
    completing,
    error,
    unansweredCount,
    setAnswer,
    complete,
  } = useAnamnesisQuestionnaire<number>({
    locale: 'pt-BR',
    keyPrefix: 'mind_',
    parseAnswer: parseMindAnswer,
    buildAnswer: buildMindAnswer,
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

  const handleFinish = async () => {
    const finalize = async () => {
      try {
        await complete();
        navigation.goBack();
      } catch {
        Alert.alert('Erro', 'Não foi possível finalizar a anamnese. Tente novamente.');
      }
    };

    if (unansweredCount > 0) {
      Alert.alert(
        'Perguntas não respondidas',
        `Você ainda não respondeu ${unansweredCount} pergunta(s). Deseja finalizar mesmo assim?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Finalizar', onPress: finalize },
        ]
      );
      return;
    }

    await finalize();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Carregando perguntas...</Text>
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
            <Text style={styles.title}>MENTE</Text>
            <Text style={styles.subtitle}>Bem-estar emocional</Text>
            <Text style={styles.introText}>
              Pensando na última semana, com que intensidade você percebeu esses sentimentos no seu dia a dia?
            </Text>
          </View>

          <View style={styles.questionsContainer}>
            {questions.map((question, index) => (
              <View key={question.id} style={styles.questionSection}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>{index + 1}.</Text>
                  <View style={styles.questionTextContainer}>
                    <Text style={styles.questionTitle}>
                      {question.text || question.key}
                    </Text>
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
              label={completing ? 'Finalizando...' : 'Finalizar'}
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

