import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const AuthenticatedScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    // Redireciona para MainTabNavigator na aba Community quando o componente monta
    navigation.replace('Main' as never, { screen: 'Community' } as never);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Tela de transição - será substituída imediatamente pela navegação */}
    </SafeAreaView>
  );
};

export default AuthenticatedScreen;

