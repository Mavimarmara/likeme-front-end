import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Title, ButtonGroup, PrimaryButton, SecondaryButton } from '@/components/ui';
import { GradientSplash4 } from '@/assets';
import { useAuthLogin } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = { navigation: any; route: any };

const IntroScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'Intro', screenClass: 'IntroScreen' });
  const { t } = useTranslation();
  const userName = route.params?.userName || 'Usuário';
  const { handleLogin, isLoading } = useAuthLogin(navigation);

  const handleShowPresentation = () => {
    navigation.navigate('AppPresentation' as never);
  };

  const handleGoToApp = () => {
    handleLogin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.greetingContainer}>
          <Title
            title={t('auth.introGreeting', { userName })}
            subtitle={t('auth.introWelcome')}
            variant="large"
            rightAdornment={
              <Image source={GradientSplash4} style={styles.titleAdornment} resizeMode="cover" />
            }
          />
        </View>

        <View style={styles.buttonContainer}>
          <ButtonGroup
            style={{ position: 'relative', left: 0, right: 0, bottom: 0, paddingBottom: 0 }}
          >
            <PrimaryButton
              label={t('auth.yesSure')}
              onPress={handleShowPresentation}
              disabled={isLoading}
            />
            <SecondaryButton
              label={t('auth.noStraightToApp')}
              onPress={handleGoToApp}
              loading={isLoading}
            />
          </ButtonGroup>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IntroScreen;
