import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OnboardingStep1 } from '../../../onboarding';
import { styles } from './styles';

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('Welcome' as never);
  };

  const handleLogin = () => {
    navigation.navigate('Welcome' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingStep1 onNext={handleNext} onLogin={handleLogin} />
    </SafeAreaView>
  );
};

export default OnboardingScreen;
