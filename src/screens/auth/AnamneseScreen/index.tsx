import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

const AnamneseScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleComplete = () => {
    Alert.alert('Parabéns!', 'Anamnese concluída com sucesso!', [
      {
        text: 'Continuar',
        onPress: () => navigation.navigate('Main' as never),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Anamnese</Text>
        <Text style={styles.subtitle}>Questionário de saúde personalizado</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Completar Anamnese</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AnamneseScreen;
