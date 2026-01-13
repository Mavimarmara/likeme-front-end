import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui';
import { PrimaryButton } from '@/components/ui/buttons';
import { SymptomSlider, SymptomLevel } from '@/components/ui/inputs';
import { storageService, anamnesisService, userService } from '@/services';
import type { AnamnesisQuestion } from '@/types/anamnesis';
import { styles } from './styles';

type Props = { navigation: any };

// Mapeamento de níveis de sintomas para valores numéricos
const SYMPTOM_LEVEL_TO_VALUE: Record<SymptomLevel, number> = {
  sem: 0,
  leve: 1,
  moderado: 2,
  grave: 3,
  plena: 4,
};

// Mapeamento reverso: valor numérico para nível de sintoma
const VALUE_TO_SYMPTOM_LEVEL: Record<number, SymptomLevel> = {
  0: 'sem',
  1: 'leve',
  2: 'moderado',
  3: 'grave',
  4: 'plena',
};

const AnamnesisBodyScreen: React.FC<Props> = ({ navigation }) => {
  const [questions, setQuestions] = useState<AnamnesisQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [answers, setAnswers] = useState<Record<string, SymptomLevel>>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Buscar userId do perfil do usuário autenticado
      let currentUserId: string;
      try {
        const profileResponse = await userService.getProfile();
        if (profileResponse.success && profileResponse.data?.id) {
          currentUserId = profileResponse.data.id;
          setUserId(currentUserId);
        } else {
          throw new Error('Não foi possível obter o ID do usuário');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Erro', 'Não foi possível identificar o usuário. Faça login novamente.');
        navigation.goBack();
        return;
      }
      
      // Buscar perguntas do backend
      const locale = 'pt-BR'; // TODO: Obter do sistema/i18n
      const questionsResponse = await anamnesisService.getQuestions({ locale });
      
      if (questionsResponse.success && questionsResponse.data) {
        setQuestions(questionsResponse.data);
        
        // Carregar respostas existentes após carregar as perguntas
        try {
          const answersResponse = await anamnesisService.getUserAnswers({ userId: currentUserId, locale });
          if (answersResponse.success && answersResponse.data && answersResponse.data.length > 0) {
            const existingAnswers: Record<string, SymptomLevel> = {};
            
            answersResponse.data.forEach((answer) => {
              let symptomLevel: SymptomLevel | null = null;
              
              // Tentar mapear a partir do answerText (valor numérico)
              if (answer.answerText) {
                const numericValue = parseInt(answer.answerText, 10);
                if (!isNaN(numericValue) && VALUE_TO_SYMPTOM_LEVEL[numericValue]) {
                  symptomLevel = VALUE_TO_SYMPTOM_LEVEL[numericValue];
                }
              }
              
              // Se não encontrou pelo answerText, tentar pelo answerOptionKey
              if (!symptomLevel && answer.answerOptionKey) {
                // Mapear keys do backend para valores do front-end
                const key = answer.answerOptionKey.toLowerCase();
                const keyMapping: Record<string, SymptomLevel> = {
                  'none': 'sem',
                  'low': 'leve',
                  'medium': 'moderado',
                  'high': 'grave',
                  'very_high': 'plena',
                  'sem': 'sem',
                  'leve': 'leve',
                  'moderado': 'moderado',
                  'grave': 'grave',
                  'plena': 'plena',
                };
                
                if (keyMapping[key]) {
                  symptomLevel = keyMapping[key];
                } else {
                  // Tentar mapear valores numéricos como string
                  const numericKey = parseInt(key, 10);
                  if (!isNaN(numericKey) && VALUE_TO_SYMPTOM_LEVEL[numericKey]) {
                    symptomLevel = VALUE_TO_SYMPTOM_LEVEL[numericKey];
                  }
                }
              }
              
              // Se encontrou um nível válido, adicionar ao objeto de respostas
              if (symptomLevel) {
                existingAnswers[answer.questionConceptId] = symptomLevel;
                console.log('Resposta carregada:', {
                  questionConceptId: answer.questionConceptId,
                  answerText: answer.answerText,
                  answerOptionKey: answer.answerOptionKey,
                  symptomLevel,
                });
              }
            });
            
            if (Object.keys(existingAnswers).length > 0) {
              setAnswers(existingAnswers);
              console.log('Respostas existentes carregadas:', Object.keys(existingAnswers).length);
            }
          }
        } catch (error) {
          console.error('Error loading user answers:', error);
          // Não bloquear a tela se houver erro ao carregar respostas
        }
      }
    } catch (error) {
      console.error('Error loading anamnesis data:', error);
      Alert.alert('Erro', 'Não foi possível carregar as perguntas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = async (questionConceptId: string, value: SymptomLevel) => {
    if (!userId) {
      console.error('UserId not available');
      return;
    }

    // Atualizar estado local imediatamente para feedback visual
    setAnswers((prev) => ({
      ...prev,
      [questionConceptId]: value,
    }));

    try {
      const question = questions.find((q) => q.id === questionConceptId);
      if (!question) {
        console.error('Question not found:', questionConceptId);
        return;
      }

      const numericValue = SYMPTOM_LEVEL_TO_VALUE[value];
      
      // Encontrar a opção de resposta correspondente ou usar answerText
      let answerOptionId: string | null = null;
      
      // Se a pergunta tiver opções numéricas, tentar encontrar a correspondente
      if (question.answerOptions && question.answerOptions.length > 0) {
        const matchingOption = question.answerOptions.find(
          (opt) => opt.key === String(numericValue) || opt.key === value
        );
        if (matchingOption) {
          answerOptionId = matchingOption.id;
        }
      }

      // Salvar resposta no backend imediatamente
      await anamnesisService.createOrUpdateAnswer({
        userId,
        questionConceptId,
        answerOptionId,
        answerText: String(numericValue), // Salvar como texto numérico
      });

      console.log('Resposta salva:', { questionConceptId, value, numericValue });
    } catch (error) {
      console.error('Error saving answer:', error);
      // Reverter mudança local em caso de erro
      setAnswers((prev) => {
        const updated = { ...prev };
        // Manter o valor anterior ou remover se não existir
        // Não revertemos para não confundir o usuário, apenas logamos o erro
        return updated;
      });
    }
  };

  const handleFinish = async () => {
    if (!userId) {
      Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
      return;
    }

    try {
      setSaving(true);
      
      // Verificar se todas as perguntas foram respondidas
      const unansweredQuestions = questions.filter(
        (q) => !answers[q.id] || answers[q.id] === 'sem'
      );

      if (unansweredQuestions.length > 0) {
        Alert.alert(
          'Perguntas não respondidas',
          `Você ainda não respondeu ${unansweredQuestions.length} pergunta(s). Deseja finalizar mesmo assim?`,
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Finalizar',
              onPress: async () => {
                await storageService.setAnamnesisCompletedAt(new Date().toISOString());
                navigation.goBack();
              },
            },
          ]
        );
        return;
      }
      
      // Salvar data de conclusão da anamnesis
      await storageService.setAnamnesisCompletedAt(new Date().toISOString());
      
      Alert.alert('Sucesso', 'Anamnesis finalizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error finalizing anamnesis:', error);
      Alert.alert('Erro', 'Não foi possível finalizar a anamnesis. Tente novamente.');
    } finally {
      setSaving(false);
    }
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
            <Text style={styles.title}>CORPO</Text>
            <Text style={styles.subtitle}>Bem-estar físico</Text>
            <Text style={styles.introText}>
              pensando na última semana, como você percebeu o seu corpo nas seguintes áreas:
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
                    {question.text && question.text !== question.key && (
                      <Text style={styles.questionDescription}>{question.key}</Text>
                    )}
                  </View>
                </View>
                <SymptomSlider
                  selectedValue={answers[question.id] || 'sem'}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                />
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              label={saving ? 'Salvando...' : 'Finalizar'}
              onPress={handleFinish}
              style={styles.finishButton}
              disabled={saving || !userId}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnamnesisBodyScreen;

