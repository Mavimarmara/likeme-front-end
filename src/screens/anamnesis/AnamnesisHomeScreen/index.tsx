import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui';
import { SecondaryButton } from '@/components/ui/buttons';
import ProgressBar from '@/components/ui/feedback/ProgressBar';
import { BackgroundWithGradient2, BackgroundWithGradient3 } from '@/assets';
import { styles } from './styles';

type Props = { navigation: any };

const AnamnesisHomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleContinueBody = () => {
    navigation.navigate('AnamnesisBody' as never);
  };

  const handleContinueMind = () => {
    navigation.navigate('AnamnesisMind' as never);
  };

  const handleUpdateMovement = () => {
    navigation.navigate('AnamnesisHabits' as never, {
      title: 'Movimento',
      keyPrefix: 'habits_movimento',
    } as never);
  };

  const handleStartSpirituality = () => {
    navigation.navigate('AnamnesisHabits' as never, {
      title: 'Espiritualidade',
      keyPrefix: 'habits_espiritualidade',
    } as never);
  };

  const handleContinueSleep = () => {
    navigation.navigate('AnamnesisHabits' as never, {
      title: 'Sono',
      keyPrefix: 'habits_sono',
    } as never);
  };

  const handleContinueNutrition = () => {
    navigation.navigate('AnamnesisHabits' as never, {
      title: 'Alimentação',
      keyPrefix: 'habits_alimentacao',
    } as never);
  };

  const handleContinueStress = () => {
    navigation.navigate('AnamnesisHabits' as never, {
      title: 'Estresse',
      keyPrefix: 'habits_estresse',
    } as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background superior */}
      <Image
        source={BackgroundWithGradient3}
        style={styles.backgroundTop}
        resizeMode="cover"
      />
      
      {/* Background inferior */}
      <Image
        source={BackgroundWithGradient2}
        style={styles.backgroundBottom}
        resizeMode="cover"
      />

      <Header 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Minha anaminese</Text>

        {/* Card: SEU CORPO */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SEU CORPO</Text>
          <Text style={styles.cardSubtitle}>Bem-estar físico</Text>
          <Text style={styles.cardDescription}>
            Um espaço para sabermos como seu corpo tem respondido ao seu cotidiano.
          </Text>
          
          <View style={styles.cardContent}>
            <ProgressBar
              current={8}
              total={10}
              label="Corpo"
              color="#0154f8"
            />
            
            <SecondaryButton
              label="Continuar"
              onPress={handleContinueBody}
              size="medium"
            />
          </View>
        </View>

        {/* Card: SUA MENTE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SUA MENTE</Text>
          <Text style={styles.cardSubtitle}>Bem-estar emocional</Text>
          <Text style={styles.cardDescription}>
            Como você tem se sentido?{'\n'}Um espaço para refletir sobre emoções e equilíbrio no dia a dia.
          </Text>
          
          <View style={styles.cardContent}>
            <ProgressBar
              current={3}
              total={10}
              label="Mente"
              color="#D794FF"
            />
            
            <SecondaryButton
              label="Continuar"
              onPress={handleContinueMind}
              size="medium"
            />
          </View>
        </View>

        {/* Card: SEUS HÁBITOS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SEUS HÁBITOS</Text>
          <Text style={styles.cardSubtitle}>Mapeamento de hábitos</Text>
          <Text style={styles.cardDescription}>
            Uma sessão para entender um pouco mais sobre o seu dia a dia, sem certo ou errado
          </Text>
          
          <View style={styles.habitsContainer}>
            {/* Movimento */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={4}
                total={4}
                label="Movimento"
                color="#0154f8"
              />
              <SecondaryButton
                label="Atualizar"
                onPress={handleUpdateMovement}
                size="medium"
              />
              <View style={styles.habitDivider} />
            </View>

            {/* Espiritualidade */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={0}
                total={5}
                label="Espiritualidade"
                color="#0154f8"
              />
              <SecondaryButton
                label="Iniciar"
                onPress={handleStartSpirituality}
                size="medium"
              />
              <View style={styles.habitDivider} />
            </View>

            {/* Sono */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={4}
                total={8}
                label="Sono"
                color="#9B51E0"
              />
              <SecondaryButton
                label="Continuar"
                onPress={handleContinueSleep}
                size="medium"
              />
              <View style={styles.habitDivider} />
            </View>

            {/* Alimentação */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={10}
                total={24}
                label="Alimentação"
                color="#6FCF97"
              />
              <SecondaryButton
                label="Continuar"
                onPress={handleContinueNutrition}
                size="medium"
              />
              <View style={styles.habitDivider} />
            </View>

            {/* Estresse */}
            <View style={styles.habitSection}>
              <View style={styles.habitDivider} />
              <ProgressBar
                current={15}
                total={27}
                label="Estresse"
                color="#F2994A"
              />
              <SecondaryButton
                label="Continuar"
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
