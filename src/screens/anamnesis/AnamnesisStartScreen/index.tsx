import React from 'react';
import { View, Text } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { ScreenWithHeader } from '@/components/ui/layout';
import { PrimaryButton, SecondaryButton } from '@/components/ui/buttons';
import { useTranslation } from '@/hooks/i18n';
import { BackgroundWithGradient2, BackgroundWithGradient3 } from '@/assets/anamnesis';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type Props = { navigation: any };

// URL da imagem decorativa do Figma (válida por 7 dias)
const IMAGE_DECORATIVE = 'https://www.figma.com/api/mcp/asset/a21f05fe-cd0c-48af-8604-1984f766c8c9';

const AnamnesisStartScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Anamnesis', screenClass: 'AnamnesisStartScreen' });
  const { t } = useTranslation();
  const handleStartAnamnesis = () => {
    navigation.navigate('AnamnesisHome' as never);
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{ showBackButton: true, onBackPress: () => navigation.goBack() }}
      contentContainerStyle={styles.container}
    >
      {/* Background superior */}
      <CachedImage source={BackgroundWithGradient3} style={styles.backgroundTop} />

      {/* Background inferior */}
      <CachedImage source={BackgroundWithGradient2} style={styles.backgroundBottom} />

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
            <Text style={styles.title}>{t('anamnesis.startTitle')}</Text>
            <Text style={styles.description}>{t('anamnesis.startDescription')}</Text>
          </View>

          {/* Botões */}
          <View style={styles.buttonsContainer}>
            <PrimaryButton
              label={t('anamnesis.startButton')}
              onPress={handleStartAnamnesis}
              size='large'
              style={styles.primaryButton}
            />
            <SecondaryButton
              label={t('common.skip')}
              onPress={handleSkip}
              size='large'
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </View>
    </ScreenWithHeader>
  );
};

export default AnamnesisStartScreen;
