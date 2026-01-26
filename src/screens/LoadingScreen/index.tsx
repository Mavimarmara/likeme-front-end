import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loading } from '@/components/ui';
import { useTranslation } from '@/hooks/i18n';

type Props = { navigation: any; route: any };

const LoadingScreen: React.FC<Props> = ({ route }) => {
  const { t } = useTranslation();
  const loadingMessage = route.params?.loadingMessage || t('common.loading');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading message={loadingMessage} fullScreen />
    </SafeAreaView>
  );
};

export default LoadingScreen;
