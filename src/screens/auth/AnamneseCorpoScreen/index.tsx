import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui';
import { PrimaryButton } from '@/components/ui/buttons';
import { SymptomSlider, SymptomLevel } from '@/components/ui/inputs';
import { styles } from './styles';

type Props = { navigation: any };

interface Question {
  id: number;
  title: string;
  description: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Sistema musculoesquelético',
    description: 'Dores, rigidez ou limitações de movimento no corpo (músculos, articulações ou coluna).',
  },
  {
    id: 2,
    title: 'Sistema cardiovascular',
    description: 'Sensação de cansaço exacerbado ao fazer esforço, palpitação, dor no peito, pressão alta ou baixa.',
  },
  {
    id: 3,
    title: 'Sistema respiratório',
    description: 'Fôlego curto, tosse frequente, chiado no peito ou dificuldade para respirar.',
  },
  {
    id: 4,
    title: 'Sistema digestivo',
    description: 'Refluxo, gases, constipação, diarreia, dores abdominais ou má digestão.',
  },
  {
    id: 5,
    title: 'Sistema imunológico',
    description: 'Frequência de gripes, resfriados, infecções ou alergias. Imunidade de uma forma geral.',
  },
  {
    id: 6,
    title: 'Sistema urinário',
    description: 'Frequência urinária, dor ao urinar, infecções urinárias, controle da bexiga.',
  },
  {
    id: 7,
    title: 'Sistema reprodutor/sexual',
    description: 'Desejo sexual, função sexual, saúde menstrual ou prostática.',
  },
  {
    id: 8,
    title: 'Funções Neurocognitivas',
    description: 'Nível de energia, memória, atenção, concentração, coordenação motora.',
  },
  {
    id: 9,
    title: 'Pele, unhas e cabelo',
    description: 'Erupções, queda de cabelo, oleosidade, coceiras, ressecamento e unhas fracas ou quebradiças.',
  },
  {
    id: 10,
    title: 'Percepção: visão e audição',
    description: 'Qualidade da visão, qualidade da audição, zumbido.',
  },
];

const AnamneseCorpoScreen: React.FC<Props> = ({ navigation }) => {
  const [answers, setAnswers] = useState<Record<number, SymptomLevel>>({});

  const handleAnswerChange = (questionId: number, value: SymptomLevel) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleFinish = () => {
    // TODO: Salvar respostas e navegar para próxima tela
    console.log('Respostas:', answers);
    navigation.goBack();
  };

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
            {QUESTIONS.map((question) => (
              <View key={question.id} style={styles.questionSection}>
                <View style={styles.questionHeader}>
                  <Text style={styles.questionNumber}>{question.id}.</Text>
                  <View style={styles.questionTextContainer}>
                    <Text style={styles.questionTitle}>{question.title}</Text>
                    <Text style={styles.questionDescription}>{question.description}</Text>
                  </View>
                </View>
                <SymptomSlider
                  selectedValue={answers[question.id]}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                />
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              label="Finalizar"
              onPress={handleFinish}
              style={styles.finishButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnamneseCorpoScreen;

