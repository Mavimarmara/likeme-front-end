import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';

const MarketplaceScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>MarketplaceScreen</Text>
        <Text style={styles.subtitle}>Funcionalidade em desenvolvimento</Text>
        {/* TODO: Implementar MarketplaceScreen */}
      </View>
    </SafeAreaView>
  );
};

export default MarketplaceScreen;
