import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Bem-vindo ao App de Saúde',
      description: 'Sua jornada para uma vida mais saudável começa aqui',
      image: '🏥',
    },
    {
      title: 'Acompanhe seu Bem-estar',
      description: 'Monitore sua saúde e bem-estar de forma inteligente',
      image: '💚',
    },
    {
      title: 'Conecte-se com Profissionais',
      description: 'Acesse uma rede de profissionais de saúde qualificados',
      image: '👩‍⚕️',
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Register' as never);
    }
  };

  const skipOnboarding = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Text style={styles.emoji}>{slides[currentSlide].image}</Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{slides[currentSlide].title}</Text>
            <Text style={styles.description}>{slides[currentSlide].description}</Text>
          </View>

          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentSlide ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
              <Text style={styles.skipText}>Pular</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
              <Text style={styles.nextText}>
                {currentSlide === slides.length - 1 ? 'Começar' : 'Próximo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 120,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  nextText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;