import React, { useEffect } from 'react';
import Constants from 'expo-constants';
import { RootNavigator } from './src/navigation';
import { AUTH0_CONFIG } from './src/config/environment';

const App: React.FC = () => {
  useEffect(() => {
    // Debug: Log das variáveis de ambiente carregadas
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  DEBUG - Variáveis de Ambiente');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('AUTH0_CONFIG:', {
      domain: AUTH0_CONFIG.domain,
      clientId: AUTH0_CONFIG.clientId ? `${AUTH0_CONFIG.clientId.substring(0, 10)}...` : 'NÃO ENCONTRADO',
      audience: AUTH0_CONFIG.audience ? 'ENCONTRADO' : 'NÃO ENCONTRADO',
    });
    console.log('');
    console.log('Constants.expoConfig:', Constants.expoConfig ? 'existe' : 'não existe');
    console.log('Constants.expoConfig.extra:', Constants.expoConfig?.extra ? 'existe' : 'não existe');
    console.log('Constants.expoConfig.extra.env:', Constants.expoConfig?.extra?.env ? 'existe' : 'não existe');
    if (Constants.expoConfig?.extra?.env) {
      console.log('Variáveis em extra.env:', Object.keys(Constants.expoConfig.extra.env));
    }
    console.log('═══════════════════════════════════════════════════════════');
  }, []);

  return <RootNavigator />;
};

export default App;