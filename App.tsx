import React, { useEffect, useRef } from 'react';
import { AppState, Platform, StatusBar } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { RootErrorBoundary } from './src/components/infrastructure/RootErrorBoundary';
import { AUTH0_CONFIG } from './src/config/environment';
import { startI18nHydration } from './src/i18n/hydration';
import { featureFlagService } from './src/services';
import { logger } from './src/utils/logger';
// Importar i18n antes de qualquer componente que use useTranslation
import './src/i18n';

const App: React.FC = () => {
  const navBarHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  void useFonts({
    'Bricolage Grotesque': require('./assets/fonts/BricolageGrotesque-Regular.ttf'),
  });

  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  useEffect(() => {
    void startI18nHydration('pt-BR');
    void featureFlagService.initialize();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void startI18nHydration('pt-BR', { force: true });
        void featureFlagService.refresh();
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    try {
      logger.debug('═══════════════════════════════════════════════════════════');
      logger.debug('  DEBUG - Variáveis de Ambiente');
      logger.debug('═══════════════════════════════════════════════════════════');
      logger.debug('AUTH0_CONFIG:', {
        domain: AUTH0_CONFIG.domain,
        clientId: AUTH0_CONFIG.clientId ? `${AUTH0_CONFIG.clientId.substring(0, 10)}...` : 'NÃO ENCONTRADO',
        audience: AUTH0_CONFIG.audience ? 'ENCONTRADO' : 'NÃO ENCONTRADO',
      });
      logger.debug('');

      try {
        const Constants = require('expo-constants').default;
        if (Constants?.expoConfig) {
          logger.debug('Constants.expoConfig:', 'existe');
          logger.debug('Constants.expoConfig.extra:', Constants.expoConfig?.extra ? 'existe' : 'não existe');
          logger.debug('Constants.expoConfig.extra.env:', Constants.expoConfig?.extra?.env ? 'existe' : 'não existe');
          if (Constants.expoConfig?.extra?.env) {
            logger.debug('Variáveis em extra.env:', Object.keys(Constants.expoConfig.extra.env));
          }
        } else {
          logger.debug('Constants.expoConfig:', 'não existe (runtime pode não estar pronto)');
        }
      } catch {
        logger.debug('Constants:', 'não disponível ainda');
      }
      logger.debug('═══════════════════════════════════════════════════════════');
    } catch (error) {
      logger.warn('[App] Erro ao acessar Constants:', error);
    }
  }, []);

  useEffect(() => {
    const configureAndroidSystemUI = async () => {
      if (Platform.OS !== 'android') {
        return;
      }

      try {
        await NavigationBar.setVisibilityAsync('hidden');
      } catch (error) {
        console.warn('[App] Falha ao ocultar barra de navegacao do Android:', error);
      }
    };

    void configureAndroidSystemUI();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void configureAndroidSystemUI();
      }
    });

    const visibilitySubscription =
      Platform.OS === 'android'
        ? NavigationBar.addVisibilityListener(({ visibility }) => {
            if (visibility !== 'visible') {
              return;
            }
            if (navBarHideTimeoutRef.current) {
              clearTimeout(navBarHideTimeoutRef.current);
            }
            navBarHideTimeoutRef.current = setTimeout(() => {
              void configureAndroidSystemUI();
            }, 300);
          })
        : null;

    return () => {
      subscription.remove();
      visibilitySubscription?.remove();
      if (navBarHideTimeoutRef.current) {
        clearTimeout(navBarHideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar hidden={Platform.OS === 'android'} />
      <RootErrorBoundary>
        <RootNavigator />
      </RootErrorBoundary>
    </SafeAreaProvider>
  );
};

export default App;
