import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, PrimaryButton, SecondaryButton, ButtonGroup } from '@/components/ui';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = { navigation: any };

const SelfAwarenessIntroScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'SelfAwarenessIntro', screenClass: 'SelfAwarenessIntroScreen' });
  const { t } = useTranslation();
  const handleTakeQuiz = () => {
    navigation.navigate('Main' as never);
  };

  const handleSkip = () => {
    navigation.navigate('Main' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} />
      {/*TODO: Adicionar tela quando houver as perguntas*/}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{t('auth.selfAwarenessTitle')}</Text>
          <Text style={styles.subtitle}>
            {t('auth.selfAwarenessSubtitle')}
          </Text>
        </View>

        <View style={styles.footer}>
          <ButtonGroup style={styles.buttonGroup}>
            <PrimaryButton label={t('auth.takeQuiz')} onPress={handleTakeQuiz} />
            <SecondaryButton label={t('common.skip')} onPress={handleSkip} />
          </ButtonGroup>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelfAwarenessIntroScreen;
