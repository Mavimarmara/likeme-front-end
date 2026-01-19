import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/components/ui';
import { styles } from './styles';

type Props = {
  navigation: any;
};

const AnamnesisCompletionScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    // Auto-redirecionar para home após 3 segundos
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF92D8', '#F4F3EC', '#5AB4FF']}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header 
          onBackPress={() => navigation.navigate('Home')}
          showRating={true}
          onRatingPress={() => {
            // TODO: Implementar lógica de rating/avaliação
          }}
        />
      </SafeAreaView>

      <View style={styles.content}>
        <Text style={styles.title}>GREAT JOB !</Text>
      </View>
    </View>
  );
};

export default AnamnesisCompletionScreen;

