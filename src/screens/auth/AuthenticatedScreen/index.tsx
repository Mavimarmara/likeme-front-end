import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useAnalyticsScreen } from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
import { useOnboardingRedirect } from '@/hooks';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'Authenticated'>;

const AuthenticatedScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Authenticated', screenClass: 'AuthenticatedScreen' });

  const replace = useCallback(
    (screen: string, params?: object) => {
      navigation.replace(screen as never, params as never);
    },
    [navigation],
  );
  useOnboardingRedirect(replace);

  return <SafeAreaView style={styles.container} />;
};

export default AuthenticatedScreen;
