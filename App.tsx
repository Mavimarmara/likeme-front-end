import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { RootNavigator } from './src/navigation';
import { AUTH0_CONFIG } from './src/config/environment';
// Importar i18n antes de qualquer componente que use useTranslation
import './src/i18n';

// Desabilitar todos os logs que aparecem na tela
LogBox.ignoreAllLogs(true);

const App: React.FC = () => {
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

  return <RootNavigator />;
};

export default App;
