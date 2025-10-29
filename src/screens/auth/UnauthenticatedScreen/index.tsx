import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UnauthenticatedStep1 } from './components';
import { styles } from './styles';

const UnauthenticatedScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('Welcome' as never);
  };

  const handleLogin = () => {
    navigation.navigate('Welcome' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <UnauthenticatedStep1 onNext={handleNext} onLogin={handleLogin} />
    </SafeAreaView>
  );
};

export default UnauthenticatedScreen;
