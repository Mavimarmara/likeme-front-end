import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OnboardingStep1 } from '../../../onboarding';
import { styles } from './styles';

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    // Navegar para próxima etapa do onboarding
    navigation.navigate('Register' as never);
  };

  const handleLogin = () => {
    // Navegar para tela de login (por enquanto vai para Register)
    navigation.navigate('Register' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingStep1 onNext={handleNext} onLogin={handleLogin} />
    </SafeAreaView>
  );
};

export default OnboardingScreen;
