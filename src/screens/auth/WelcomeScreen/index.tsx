import React, { useState, useEffect, useRef } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert, TextInput as RNTextInput, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, TextInput, PrimaryButton } from '@/components/ui';
import { GradientSplash4 } from '@/assets';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logButtonClick, logFormSubmit, logNavigation } from '@/analytics';
import { getNextOnboardingScreen } from '@/utils';
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
    const nextScreen = getNextOnboardingScreen('Welcome');
    const params = { userName: name.trim() };
    logNavigation({
      source_screen: 'welcome',
      destination_screen: nextScreen.toLowerCase(),
      action_name: 'continue',
    });
    navigation.navigate(nextScreen as never, params as never);
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
            <View style={styles.welcomeTitleBlock}>
              <View style={styles.welcomeTitleRow}>
                <Text style={[styles.welcomeTitleText, styles.welcomeTitleLarge]}>{t('auth.welcomeTitleStart')}</Text>
                <Image source={GradientSplash4} style={styles.welcomeTitleImage} resizeMode='cover' />
                <Text style={[styles.welcomeTitleText, styles.welcomeTitleLarge]}>{t('auth.welcomeTitleLine1End')}</Text>
              </View>
              <Text style={[styles.welcomeTitleText, styles.welcomeTitleLarge]}>{t('auth.welcomeTitleLine2')}</Text>
            </View>
            <Text style={styles.welcomeSubtitle}>{t('auth.welcomeSubtitle')}</Text>
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
