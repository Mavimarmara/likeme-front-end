import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { AuthService } from '@/services';
import { logger } from '@/utils/logger';

export const useAuthLogin = (navigation: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const authResult = await AuthService.login();
      await AuthService.validateToken(authResult);

      navigation.navigate(
        'Register' as never,
        {
          userName: authResult.user.name || authResult.user.email,
        } as never
      );
    } catch (error) {
      logger.error('Login error:', error);
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes('cancelled') ||
          errorMessage.includes('dismissed') ||
          errorMessage.includes('user cancelled') ||
          errorMessage.includes('login cancelled')
        ) {
          setIsLoading(false);
          return;
        }
        Alert.alert('Erro no Login', error.message || 'Erro ao fazer login');
      } else {
        Alert.alert('Erro no Login', 'Erro ao fazer login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, navigation]);

  return { handleLogin, isLoading };
};
