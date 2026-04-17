import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, TextInput as RNTextInput, Image, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput, PrimaryButton } from '@/components/ui';
import { KeyboardAwareScreen, ScreenWithHeader } from '@/components/ui/layout';
import { GradientSplash4 } from '@/assets/auth';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen, logButtonClick, logFormSubmit, logNavigation } from '@/analytics';
import { getNextOnboardingScreen } from '@/utils';
import { storageService } from '@/services';
import { styles } from './styles';

type Props = { navigation: any };

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Welcome', screenClass: 'WelcomeScreen' });
  const { t } = useTranslation();
  const { bottom: bottomInset } = useSafeAreaInsets();
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

  const handleBack = () => {
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
    if (navigation.canGoBack?.()) {
      navigation.goBack();
    }
  };

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{ onBackPress: handleBack }}
      contentContainerStyle={styles.container}
    >
      <KeyboardAwareScreen
        scrollContentContainerStyle={styles.scrollContentContainer}
        includeBottomSafeAreaOnFooter={false}
        footer={
          <View style={[styles.footer, bottomInset > 0 ? { paddingBottom: bottomInset } : null]}>
            <PrimaryButton label='Próximo' onPress={handleContinue} size='large' />
          </View>
        }
      >
        <View style={styles.main}>
          <View style={styles.content}>
            <View style={styles.welcomeTitleBlock}>
              <View style={styles.welcomeTitleRow}>
                <Text style={[styles.welcomeTitleText, styles.welcomeTitleLarge]}>{t('auth.welcomeTitleStart')}</Text>
                <Image source={GradientSplash4} style={styles.welcomeTitleImage} resizeMode='cover' />
                <Text style={[styles.welcomeTitleText, styles.welcomeTitleLarge]}>
                  {t('auth.welcomeTitleLine1End')}
                </Text>
              </View>
              <Text style={[styles.welcomeTitleText, styles.welcomeTitleLarge]}>{t('auth.welcomeTitleLine2')}</Text>
            </View>
            <Text style={styles.welcomeSubtitle}>{t('auth.welcomeSubtitle')}</Text>
          </View>
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                value={name}
                onChangeText={setName}
                placeholder={t('auth.yourNamePlaceholder')}
                returnKeyType='next'
                onSubmitEditing={handleContinue}
                onPressIn={() => inputRef.current?.focus()}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScreen>
    </ScreenWithHeader>
  );
};

export default WelcomeScreen;
