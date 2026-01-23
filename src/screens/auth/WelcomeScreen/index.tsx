import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput as RNTextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Title, TextInput } from '@/components/ui';
import { GradientSplash3 } from '@/assets';
import { styles } from './styles';

type Props = { navigation: any };

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

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
          <Title
            title="Welcome!"
            subtitle="How can I call you?"
            variant="large"
            rightAdornment={
              <Image source={GradientSplash3} style={styles.titleAdornment} resizeMode="cover" />
            }
          />

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleContinue}
              onPressIn={() => inputRef.current?.focus()}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
