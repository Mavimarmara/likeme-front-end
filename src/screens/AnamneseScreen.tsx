import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, RadioButton, Button } from 'react-native-paper';

const AnamneseScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  const questions = [
    {
      id: 'health_conditions',
      question: 'Você possui alguma condição de saúde crônica?',
      options: ['Não', 'Diabetes', 'Hipertensão', 'Problemas cardíacos', 'Outros'],
    },
    {
      id: 'medications',
      question: 'Você toma algum medicamento regularmente?',
      options: ['Não', 'Sim, 1-2 medicamentos', 'Sim, 3-5 medicamentos', 'Sim, mais de 5 medicamentos'],
    },
    {
      id: 'allergies',
      question: 'Você possui alguma alergia?',
      options: ['Não', 'Alimentar', 'Medicamentosa', 'Ambiental', 'Múltiplas'],
    },
    {
      id: 'exercise_frequency',
      question: 'Com que frequência você pratica exercícios físicos?',
      options: ['Nunca', '1-2 vezes por semana', '3-4 vezes por semana', '5+ vezes por semana'],
    },
    {
      id: 'sleep_quality',
      question: 'Como você avalia a qualidade do seu sono?',
      options: ['Excelente', 'Boa', 'Regular', 'Ruim'],
    },
    {
      id: 'stress_level',
      question: 'Como você avalia seu nível de estresse?',
      options: ['Muito baixo', 'Baixo', 'Moderado', 'Alto', 'Muito alto'],
    },
  ];

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Anamnese Concluída',
      'Obrigado por completar a anamnese. Agora você pode acessar todas as funcionalidades do app!',
      [
        {
          text: 'Continuar',
          onPress: () => navigation.navigate('Main' as never),
        },
      ]
    );
  };

  const currentQuestion = questions[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>Anamnese</Text>
          <Text style={styles.subtitle}>
            Pergunta {currentStep + 1} de {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / questions.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        <Card style={styles.card}>
          <View style={styles.content}>
            <Text style={styles.question}>{currentQuestion.question}</Text>
            
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    answers[currentQuestion.id] === option && styles.selectedOption
                  ]}
                  onPress={() => handleAnswer(currentQuestion.id, option)}
                >
                  <RadioButton
                    value={option}
                    status={answers[currentQuestion.id] === option ? 'checked' : 'unchecked'}
                    onPress={() => handleAnswer(currentQuestion.id, option)}
                    color="#4CAF50"
                  />
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              {currentStep > 0 && (
                <Button
                  mode="outlined"
                  onPress={prevStep}
                  style={styles.button}
                >
                  Anterior
                </Button>
              )}
              
              <Button
                mode="contained"
                onPress={nextStep}
                style={[styles.button, styles.nextButton]}
                disabled={!answers[currentQuestion.id]}
              >
                {currentStep === questions.length - 1 ? 'Finalizar' : 'Próximo'}
              </Button>
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  card: {
    flex: 1,
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    elevation: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
});

export default AnamneseScreen;