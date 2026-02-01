import React from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Header } from '@/components/ui';
import { SecondaryButton } from '@/components/ui/buttons';
import ProgressBar from '@/components/ui/feedback/ProgressBar';
import { BackgroundWithGradient2, BackgroundWithGradient3 } from '@/assets';
import { useAnamnesisProgress } from '@/hooks/anamnesis/useAnamnesisProgress';
import { useTranslation } from '@/hooks/i18n';
import { COLORS } from '@/constants';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = { navigation: any };

const AnamnesisHomeScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'AnamnesisHome', screenClass: 'AnamnesisHomeScreen' });
  const { t } = useTranslation();
  const { progress, loading, error, refresh } = useAnamnesisProgress();

  // Atualizar progresso quando a tela ganhar foco
  // Sem dependências para evitar loop - refresh é estável
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [])
  );
  const handleContinueBody = () => {
    navigation.navigate('AnamnesisBody' as never);
  };

  const handleContinueMind = () => {
    navigation.navigate('AnamnesisMind' as never);
  };

  const handleUpdateMovement = () => {
    navigation.navigate(
      'AnamnesisHabits' as never,
      {
        title: 'Movimento',
        keyPrefix: 'habits_movimento',
      } as never
    );
  };

  const handleStartSpirituality = () => {
    navigation.navigate(
      'AnamnesisHabits' as never,
      {
        title: 'Espiritualidade',
        keyPrefix: 'habits_espiritualidade',
      } as never
    );
  };

  const handleContinueSleep = () => {
    navigation.navigate(
      'AnamnesisHabits' as never,
      {
        title: 'Sono',
        keyPrefix: 'habits_sono',
      } as never
    );
  };

  const handleContinueNutrition = () => {
    navigation.navigate(
      'AnamnesisHabits' as never,
      {
        title: 'Alimentação',
        keyPrefix: 'habits_nutricao',
      } as never
    );
  };

  const handleContinueStress = () => {
    navigation.navigate(
      'AnamnesisHabits' as never,
      {
        title: 'Estresse',
        keyPrefix: 'habits_estresse',
      } as never
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton={true} onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY.PURE} />
          <Text style={{ marginTop: 16, color: '#666' }}>{t('anamnesis.loadingProgress')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton={true} onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#EF4444', marginBottom: 16 }}>{t('anamnesis.errorLoadingData')}</Text>
          <Text style={{ color: '#666', textAlign: 'center' }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Background superior */}
      <Image source={BackgroundWithGradient3} style={styles.backgroundTop} resizeMode="cover" />

      {/* Background inferior */}
      <Image source={BackgroundWithGradient2} style={styles.backgroundBottom} resizeMode="cover" />

      <Header showBackButton={true} onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>{t('anamnesis.homeTitle')}</Text>

        {/* Card: SEU CORPO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SEU CORPO</Text>
          <Text style={styles.cardSubtitle}>Bem-estar físico</Text>
          <Text style={styles.cardDescription}>
            Um espaço para sabermos como seu corpo tem respondido ao seu cotidiano.
          </Text>

          <View style={styles.cardContent}>
            <ProgressBar
              current={progress?.physical.answered || 0}
              total={progress?.physical.total || 0}
              label="Corpo"
              color={COLORS.PRIMARY.PURE}
            />

            <SecondaryButton
              label={
                progress?.physical.answered === progress?.physical.total
                  ? 'Atualizar'
                  : progress?.physical.answered === 0
                  ? 'Iniciar'
                  : 'Continuar'
              }
              onPress={handleContinueBody}
              size="medium"
            />
          </View>
        </View>

        {/* Card: SUA MENTE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('anamnesis.yourMind')}</Text>
          <Text style={styles.cardSubtitle}>{t('anamnesis.yourMindSubtitle')}</Text>
          <Text style={styles.cardDescription}>
            {t('anamnesis.yourMindDescription')}
          </Text>

          <View style={styles.cardContent}>
            <ProgressBar
              current={progress?.mental.answered || 0}
              total={progress?.mental.total || 0}
              label={t('anamnesis.mind')}
              color="#D794FF"
            />

            <SecondaryButton
              label={
                progress?.mental.answered === progress?.mental.total
                  ? t('anamnesis.update')
                  : progress?.mental.answered === 0
                  ? t('anamnesis.start')
                  : t('anamnesis.continue')
              }
              onPress={handleContinueMind}
              size="medium"
            />
          </View>
        </View>

        {/* Card: SEUS HÁBITOS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('anamnesis.yourHabits')}</Text>
          <Text style={styles.cardSubtitle}>{t('anamnesis.yourHabitsSubtitle')}</Text>
          <Text style={styles.cardDescription}>
            {t('anamnesis.yourHabitsDescription')}
          </Text>

          <View style={styles.habitsContainer}>
            {/* Movimento */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={progress?.habits.movimento.answered || 0}
                total={progress?.habits.movimento.total || 0}
                label={t('anamnesis.movement')}
                color={COLORS.PRIMARY.PURE}
              />
              <SecondaryButton
                label={
                  progress?.habits.movimento.answered === progress?.habits.movimento.total
                    ? t('anamnesis.update')
                    : progress?.habits.movimento.answered === 0
                    ? t('anamnesis.start')
                    : t('anamnesis.continue')
                }
                onPress={handleUpdateMovement}
                size="medium"
              />
              <View style={styles.habitDivider} />
            </View>

            {/* Espiritualidade */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={progress?.habits.espiritualidade.answered || 0}
                total={progress?.habits.espiritualidade.total || 0}
                label={t('anamnesis.spirituality')}
                color={COLORS.PRIMARY.PURE}
              />
              <SecondaryButton
                label={
                  progress?.habits.espiritualidade.answered ===
                  progress?.habits.espiritualidade.total
                    ? t('anamnesis.update')
                    : progress?.habits.espiritualidade.answered === 0
                    ? t('anamnesis.start')
                    : t('anamnesis.continue')
                }
                onPress={handleStartSpirituality}
                size="medium"
              />
              <View style={styles.habitDivider} />
            </View>

            {/* Sono */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={progress?.habits.sono.answered || 0}
                total={progress?.habits.sono.total || 0}
                label={t('anamnesis.sleep')}
                color="#9B51E0"
              />
              <SecondaryButton
                label={
                  progress?.habits.sono.answered === progress?.habits.sono.total
                    ? t('anamnesis.update')
                    : progress?.habits.sono.answered === 0
                    ? t('anamnesis.start')
                    : t('anamnesis.continue')
                }
                onPress={handleContinueSleep}
                size="medium"
              />
              <View style={styles.habitDivider} />
            </View>

            {/* Alimentação */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={progress?.habits.nutricao.answered || 0}
                total={progress?.habits.nutricao.total || 0}
                label={t('anamnesis.nutrition')}
                color="#6FCF97"
              />
              <SecondaryButton
                label={
                  progress?.habits.nutricao.answered === progress?.habits.nutricao.total
                    ? t('anamnesis.update')
                    : progress?.habits.nutricao.answered === 0
                    ? t('anamnesis.start')
                    : t('anamnesis.continue')
                }
                onPress={handleContinueNutrition}
                size="medium"
              />
              <View style={styles.habitDivider} />
            </View>

            {/* Estresse */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={progress?.habits.estresse.answered || 0}
                total={progress?.habits.estresse.total || 0}
                label={t('anamnesis.stress')}
                color="#F2994A"
              />
              <SecondaryButton
                label={
                  progress?.habits.estresse.answered === progress?.habits.estresse.total
                    ? t('anamnesis.update')
                    : progress?.habits.estresse.answered === 0
                    ? t('anamnesis.start')
                    : t('anamnesis.continue')
                }
                onPress={handleContinueStress}
                size="medium"
              />
              <View style={styles.habitDivider} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnamnesisHomeScreen;
