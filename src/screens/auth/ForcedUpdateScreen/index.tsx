import React, { useEffect } from 'react';
import { BackHandler, Linking, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '@/components/ui/buttons';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { logger } from '@/utils/logger';
import { styles } from './styles';

type Props = {
  navigation: { navigate: (name: string) => void };
  route: {
    params?: {
      storeUrl?: string;
      message?: string;
    };
  };
};

const ForcedUpdateScreen: React.FC<Props> = ({ route }) => {
  useAnalyticsScreen({ screenName: 'ForcedUpdate', screenClass: 'ForcedUpdateScreen' });
  const { t } = useTranslation();
  const storeUrl = route.params?.storeUrl?.trim() ?? '';
  const customMessage = route.params?.message?.trim();

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const title = t('appUpdate.requiredTitle');
  const body = customMessage && customMessage.length > 0 ? customMessage : t('appUpdate.requiredBody');

  const openStore = () => {
    if (!storeUrl) {
      logger.error('[ForcedUpdateScreen] storeUrl vazio; não é possível abrir a loja');
      return;
    }
    void Linking.openURL(storeUrl).catch((cause) => {
      logger.error('[ForcedUpdateScreen] Falha ao abrir URL da loja', { storeUrl, cause });
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.buttonWrap}>
          <PrimaryButton label={t('appUpdate.updateButton')} onPress={openStore} disabled={!storeUrl} loading={false} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForcedUpdateScreen;
