import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Title, PrimaryButton } from '@/components/ui';
import { styles } from './styles';

type Props = { navigation: any; route: any };

const ErrorScreen: React.FC<Props> = ({ navigation, route }) => {
  // Garante que errorMessage seja sempre uma string válida
  const rawErrorMessage = route.params?.errorMessage;
  let errorMessage = 'Algo deu errado';
  if (rawErrorMessage) {
    if (typeof rawErrorMessage === 'string') {
      errorMessage = rawErrorMessage;
    } else if (rawErrorMessage instanceof Error) {
      errorMessage = rawErrorMessage.message || 'Erro desconhecido';
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
        <Title title="Oops..." subtitle={errorMessage} variant="large" />

        <View style={styles.actions}>
          {onRetry && <PrimaryButton label="Tentar novamente" onPress={handleRetry} />}
          <PrimaryButton label="Voltar" onPress={handleGoBack} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen;
