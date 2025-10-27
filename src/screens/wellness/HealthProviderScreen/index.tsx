import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

const HealthProviderScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HealthProviderScreen</Text>
        <Text style={styles.subtitle}>Funcionalidade em desenvolvimento</Text>
        {/* TODO: Implementar HealthProviderScreen */}
      </View>
    </SafeAreaView>
  );
};

export default HealthProviderScreen;
