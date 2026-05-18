import React from 'react';
import { View, Text } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { ScreenWithHeader } from '@/components/ui/layout';
import { PrimaryButton } from '@/components/ui/buttons';
import { useTranslation } from '@/hooks/i18n';
import { BackgroundWithGradient4, BackgroundWithGradient5 } from '@/assets/anamnesis';
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
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{
        showBackButton: true,
        onBackPress: () => navigation.navigate('Home'),
        showRating: true,
        onRatingPress: () => {
          // TODO: Implementar lógica de rating/avaliação
        },
      }}
      contentContainerStyle={styles.container}
    >
      {/* Background superior */}
      <CachedImage source={BackgroundWithGradient4} style={styles.backgroundTop} />

      {/* Background inferior */}
      <CachedImage source={BackgroundWithGradient5} style={styles.backgroundBottom} />

      <View style={styles.content}>
        {/* Imagem decorativa rotacionada 270 graus e centralizada */}
        <View style={styles.decorativeImageContainer}>
          <View style={styles.decorativeImageWrapper}>
            <CachedImage source={{ uri: IMAGE_DECORATIVE }} style={styles.decorativeImage} contentFit='contain' />
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
    </ScreenWithHeader>
  );
};

export default AnamnesisCompletionScreen;
