import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Logo } from '@/assets';
import { styles } from './OnboardingStep1.styles';


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
          <Logo width={200} height={60} />
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


export default OnboardingStep1;
