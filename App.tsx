import React, { useEffect, useRef, useState } from 'react';
import { AppState, LogBox, Platform, StatusBar, View } from 'react-native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { AUTH0_CONFIG } from './src/config/environment';
import { startI18nHydration } from './src/i18n/hydration';
import { COLORS } from './src/constants';
import { featureFlagService } from './src/services';
// Importar i18n antes de qualquer componente que use useTranslation
import './src/i18n';

// Desabilitar todos os logs que aparecem na tela
LogBox.ignoreAllLogs(true);

const FONT_LOAD_MAX_WAIT_MS = 5_000;

const App: React.FC = () => {
  const navBarHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fontLoadDeadlinePassed, setFontLoadDeadlinePassed] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'Bricolage Grotesque': require('./assets/fonts/BricolageGrotesque-Regular.ttf'),
  });

  useEffect(() => {
    const t = setTimeout(() => setFontLoadDeadlinePassed(true), FONT_LOAD_MAX_WAIT_MS);
    return () => clearTimeout(t);
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
    // Debug: Log das variáveis de ambiente carregadas
    // Usa try-catch para evitar erros se o runtime não estiver pronto
    try {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('  DEBUG - Variáveis de Ambiente');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('AUTH0_CONFIG:', {
        domain: AUTH0_CONFIG.domain,
        clientId: AUTH0_CONFIG.clientId ? `${AUTH0_CONFIG.clientId.substring(0, 10)}...` : 'NÃO ENCONTRADO',
        audience: AUTH0_CONFIG.audience ? 'ENCONTRADO' : 'NÃO ENCONTRADO',
      });
      console.log('');

      // Verifica se Constants está disponível antes de acessar (lazy import)
      try {
        const Constants = require('expo-constants').default;
        if (Constants?.expoConfig) {
          console.log('Constants.expoConfig:', 'existe');
          console.log('Constants.expoConfig.extra:', Constants.expoConfig?.extra ? 'existe' : 'não existe');
          console.log('Constants.expoConfig.extra.env:', Constants.expoConfig?.extra?.env ? 'existe' : 'não existe');
          if (Constants.expoConfig?.extra?.env) {
            console.log('Variáveis em extra.env:', Object.keys(Constants.expoConfig.extra.env));
          }
        } else {
          console.log('Constants.expoConfig:', 'não existe (runtime pode não estar pronto)');
        }
      } catch (error) {
        console.log('Constants:', 'não disponível ainda');
      }
      console.log('═══════════════════════════════════════════════════════════');
    } catch (error) {
      console.warn('[App] Erro ao acessar Constants:', error);
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

  if (!fontsLoaded && !fontError && !fontLoadDeadlinePassed) {
    return <View style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }} />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar hidden={Platform.OS === 'android'} />
      <RootNavigator />
    </SafeAreaProvider>
  );
};

export default App;
