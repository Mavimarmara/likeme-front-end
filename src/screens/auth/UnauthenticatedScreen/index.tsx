import React from 'react';
import { SafeAreaView } from 'react-native';
import { UnauthenticatedStep1 } from './components';
import { useAuthLogin } from '@/hooks/useAuthLogin';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const UnauthenticatedScreen: React.FC<Props> = ({ navigation }) => {
  const { handleLogin, isLoading } = useAuthLogin(navigation);

  const handleNext = () => {
    navigation.navigate('Welcome' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <UnauthenticatedStep1 onNext={handleNext} onLogin={handleLogin} isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default UnauthenticatedScreen;
