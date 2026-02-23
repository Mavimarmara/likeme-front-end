import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui';
import { PrimaryButton } from '@/components/ui/buttons';
import { useTranslation } from '@/hooks/i18n';
import { BackgroundWithGradient4, BackgroundWithGradient5 } from '@/assets';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = { navigation: any };

// URL da imagem decorativa do Figma (válida por 7 dias)
const IMAGE_DECORATIVE = 'https://www.figma.com/api/mcp/asset/e6ee3d5c-e9d8-4bf5-bf75-48f53768bafe';

const AnamnesisCompletionScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({
    screenName: 'AnamnesisCompletion',
    screenClass: 'AnamnesisCompletionScreen',
  });
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Background superior */}
      <Image source={BackgroundWithGradient4} style={styles.backgroundTop} resizeMode='cover' />

      {/* Background inferior */}
      <Image source={BackgroundWithGradient5} style={styles.backgroundBottom} resizeMode='cover' />

      <Header
        showBackButton={true}
        onBackPress={() => navigation.navigate('Home')}
        showRating={true}
        onRatingPress={() => {
          // TODO: Implementar lógica de rating/avaliação
        }}
      />

      <View style={styles.content}>
        {/* Imagem decorativa rotacionada 270 graus e centralizada */}
        <View style={styles.decorativeImageContainer}>
          <View style={styles.decorativeImageWrapper}>
            <Image source={{ uri: IMAGE_DECORATIVE }} style={styles.decorativeImage} resizeMode='contain' />
          </View>
        </View>

        {/* Conteúdo principal */}
        <View style={styles.mainContent}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('anamnesis.completionTitle')}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <PrimaryButton label={t('anamnesis.completionButton')} onPress={() => navigation.navigate('Home')} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AnamnesisCompletionScreen;
