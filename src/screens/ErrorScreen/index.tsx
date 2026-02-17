import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, PrimaryButton } from '@/components/ui';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = { navigation: any; route: any };

const ErrorScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'Error', screenClass: 'ErrorScreen' });
  const { t } = useTranslation();
  // Garante que errorMessage seja sempre uma string válida
  const rawErrorMessage = route.params?.errorMessage;
  let errorMessage = t('errors.somethingWrong');
  if (rawErrorMessage) {
    if (typeof rawErrorMessage === 'string') {
      errorMessage = rawErrorMessage;
    } else if (rawErrorMessage instanceof Error) {
      errorMessage = rawErrorMessage.message || t('errors.unknownError');
    } else {
      errorMessage = String(rawErrorMessage);
    }
  }
  const onRetry = route.params?.onRetry;

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Unauthenticated' as never);
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      handleGoBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Title title={t('errors.oops')} subtitle={errorMessage} variant='large' />

        <View style={styles.actions}>
          {onRetry && <PrimaryButton label={t('common.retry')} onPress={handleRetry} />}
          <PrimaryButton label={t('common.back')} onPress={handleGoBack} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen;
