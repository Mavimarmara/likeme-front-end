import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { UnauthenticatedStep1 } from './components';
import { useAuthLogin } from '@/hooks';
import { useAnalyticsScreen, logButtonClick, logNavigation } from '@/analytics';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const UnauthenticatedScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Unauthenticated', screenClass: 'UnauthenticatedScreen' });
  const { handleLogin: authLogin, isLoading } = useAuthLogin(navigation);

  useEffect(() => {
    authLogin();
  }, [authLogin]);

  const handleLogin = () => {
    logButtonClick({
      screen_name: 'unauthenticated',
      button_label: 'login',
      action_name: 'login',
    });
    logNavigation({
      source_screen: 'unauthenticated',
      destination_screen: 'authenticated',
      action_name: 'login',
    });
    authLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <UnauthenticatedStep1 onLogin={handleLogin} isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default UnauthenticatedScreen;
