import React, { useState, useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert, TextInput as RNTextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Title, TextInput, PrimaryButton } from '@/components/ui';
import { GradientSplash3 } from '@/assets';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logButtonClick, logFormSubmit, logNavigation } from '@/analytics';
import { storageService } from '@/services';
import { styles } from './styles';

type Props = { navigation: any };

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Welcome', screenClass: 'WelcomeScreen' });
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    const init = async () => {
      await storageService.setWelcomeScreenAccessedAt(new Date().toISOString());
      const user = await storageService.getUser();
      if (user?.name || user?.nickname || user?.email) {
        setName(user.name || user.nickname || user.email || '');
      }
    };
    init();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (!name.trim()) {
      logFormSubmit({
        screen_name: 'welcome',
        form_name: 'welcome_name',
        success: false,
        error_type: 'validation_empty_name',
      });
      Alert.alert(t('auth.nameRequired'), t('auth.nameRequiredMessage'));
      return;
    }
    logFormSubmit({
      screen_name: 'welcome',
      form_name: 'welcome_name',
      success: true,
    });
    logNavigation({
      source_screen: 'welcome',
      destination_screen: 'intro',
      action_name: 'continue',
    });
    navigation.navigate('Intro' as never, { userName: name.trim() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Header
          onBackPress={() => {
            logButtonClick({
              screen_name: 'welcome',
              button_label: 'back',
              action_name: 'go_back',
            });
            logNavigation({
              source_screen: 'welcome',
              destination_screen: 'unauthenticated',
              action_name: 'go_back',
            });
            navigation.goBack();
          }}
        />

        <View style={styles.main}>
          <View style={styles.content}>
            <Title
              title={t('auth.welcomeTitle')}
              subtitle={t('auth.welcomeSubtitle')}
              variant='large'
              rightAdornment={<Image source={GradientSplash3} style={styles.titleAdornment} resizeMode='cover' />}
            />

            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                value={name}
                onChangeText={setName}
                placeholder={t('auth.yourNamePlaceholder')}
                autoFocus
                returnKeyType='next'
                onSubmitEditing={handleContinue}
                onPressIn={() => inputRef.current?.focus()}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <PrimaryButton label='Próximo' onPress={handleContinue} style={styles.primaryButton} size='large' />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
