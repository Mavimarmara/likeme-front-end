import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loading } from '@/components/ui';

type Props = { navigation: any; route: any };

const LoadingScreen: React.FC<Props> = ({ route }) => {
  const loadingMessage = route.params?.loadingMessage || 'Carregando...';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading message={loadingMessage} fullScreen />
    </SafeAreaView>
  );
};

export default LoadingScreen;

