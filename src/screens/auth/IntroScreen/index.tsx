import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './styles';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../../../constants';

interface IntroScreenProps {
  route: {
    params: {
      userName: string;
    };
  };
}

const IntroScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const userName = route.params?.userName || 'Usuário';

  const handleShowPresentation = () => {
    console.log('Mostrar apresentação do app');
    navigation.navigate('Register' as never);
  };

  const handleGoToApp = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LIKE:Me</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello, {userName}!</Text>
          <Text style={styles.welcomeText}>Wellcome to Like Me</Text>
          <Text style={styles.questionText}>First, can I introduce you to our app?</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleShowPresentation}
          >
            <Text style={styles.primaryButtonText}>Yes, sure</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleGoToApp}
          >
            <Text style={styles.secondaryButtonText}>No, I want to go straight to the app</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IntroScreen;
