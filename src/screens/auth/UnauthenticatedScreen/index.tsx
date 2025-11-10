import React, { useState } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import { UnauthenticatedStep1 } from './components';
import { AuthService } from '@/services';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const UnauthenticatedScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    navigation.navigate('Welcome' as never);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authResult = await AuthService.login();
      await AuthService.sendToBackend(authResult);
      
      navigation.navigate('Register' as never, {
        userName: authResult.user.name || authResult.user.email,
      } as never);
    } catch (error) {
      console.error('Login screen error:', error);
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('cancelled') || 
            errorMessage.includes('dismissed') || 
            errorMessage.includes('user cancelled') ||
            errorMessage.includes('login cancelled')) {
          return;
        }
        Alert.alert('Erro no Login', error.message || 'Erro ao fazer login');
      } else {
        Alert.alert('Erro no Login', 'Erro ao fazer login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <UnauthenticatedStep1 onNext={handleNext} onLogin={handleLogin} isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default UnauthenticatedScreen;
