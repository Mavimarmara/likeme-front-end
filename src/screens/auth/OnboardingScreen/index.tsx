import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { OnboardingStep1 } from './components';
import { styles } from './styles';

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('Loading' as never);
  };

  const handleLogin = () => {
    navigation.navigate('Loading' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <OnboardingStep1 onNext={handleNext} onLogin={handleLogin} />
    </SafeAreaView>
  );
};

export default OnboardingScreen;
