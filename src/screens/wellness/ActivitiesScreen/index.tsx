import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

const ActivitiesScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Atividades</Text>
        <Text style={styles.subtitle}>Gerenciamento de atividades de saúde</Text>
        {/* TODO: Implementar ActivitiesScreen */}
      </View>
    </SafeAreaView>
  );
};

export default ActivitiesScreen;
