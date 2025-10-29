import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@/components/ui';
import { styles } from './styles';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert('Nome obrigatório', 'Por favor, digite seu nome para continuar.');
      return;
    }

    console.log('Nome do usuário:', name.trim());
    navigation.navigate('Intro' as never, { userName: name.trim() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header onBackPress={() => navigation.goBack()} />

        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Wellcome!</Text>
            <Text style={styles.questionText}>How can I call you?</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputFrame}>
              <TextInput
                ref={inputRef}
                style={styles.nameInput}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="rgba(110, 106, 106, 1)"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            </View>
            <View style={styles.inputSpacer} />
          </View>

          <TouchableOpacity 
            style={[styles.continueButton, !name.trim() && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!name.trim()}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
