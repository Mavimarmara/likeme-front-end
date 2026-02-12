import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, Title, ButtonGroup, PrimaryButton, SecondaryButton } from '@/components/ui';
import { GradientSplash4 } from '@/assets';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = { navigation: any; route: any };

const IntroScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'Intro', screenClass: 'IntroScreen' });
  const { t } = useTranslation();
  const userName = route.params?.userName || 'Usuário';

  const handleShowPresentation = () => {
    navigation.navigate('AppPresentation', { userName });
  };

  const handleSkipToRegister = () => {
    navigation.navigate('Register', { userName });
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
            />
            <SecondaryButton
              label={t('auth.noStraightToApp')}
              onPress={handleSkipToRegister}
            />
          </ButtonGroup>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IntroScreen;
