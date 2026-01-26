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
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

type Props = { navigation: any };

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
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
      Alert.alert(t('auth.nameRequired'), t('auth.nameRequiredMessage'));
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
            title={t('auth.welcomeTitle')}
            subtitle={t('auth.welcomeSubtitle')}
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
              placeholder={t('auth.yourNamePlaceholder')}
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
