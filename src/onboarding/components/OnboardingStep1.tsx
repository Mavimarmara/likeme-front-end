import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingStep1Props {
  onNext: () => void;
  onLogin: () => void;
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext, onLogin }) => {
  return (
    <View style={styles.container}>
      {/* Gradientes coloridos no fundo */}
      <View style={styles.gradientContainer}>
        <View style={styles.pinkGradient} />
        <View style={styles.yellowGradient} />
        <View style={styles.greenGradient} />
      </View>
      
      <View style={styles.content}>
        {/* Título e subtítulo */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>LIKE:ME</Text>
          <Text style={styles.subtitle}>LIKE YOUR LIFE</Text>
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Bege claro
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.6,
    height: height,
  },
  pinkGradient: {
    position: 'absolute',
    top: height * 0.1,
    right: width * 0.1,
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: '#FFB6C1', // Rosa claro
    opacity: 0.6,
    transform: [{ scale: 1.2 }],
  },
  yellowGradient: {
    position: 'absolute',
    top: height * 0.3,
    right: width * 0.05,
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: width * 0.175,
    backgroundColor: '#FFD700', // Amarelo dourado
    opacity: 0.5,
    transform: [{ scale: 1.1 }],
  },
  greenGradient: {
    position: 'absolute',
    bottom: height * 0.1,
    right: width * 0.02,
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: '#32CD32', // Verde lima
    opacity: 0.7,
    transform: [{ scale: 1.3 }],
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 12,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  loginText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingStep1;
