import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    navigation.replace('Summary' as never);
  }, [navigation]);

  return <SafeAreaView style={styles.container} />;
};

export default HomeScreen;
