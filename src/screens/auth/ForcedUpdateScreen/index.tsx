import React, { useEffect, useMemo } from 'react';
import { BackHandler, Image, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STORE_LISTING_BADGES_IMAGE } from '@/assets/ui';
import { PrimaryButton } from '@/components/ui/buttons';
import { STORE_URL_CONFIG } from '@/config';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { logger } from '@/utils/logger';
import {
  normalizeStoreOpenUrl,
  openStoreListingWithFallback,
  sanitizeExternalHttpUrl,
} from '@/utils/url/storeListingUrl';
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

function resolveEffectiveStoreUrl(routeUrl: string | undefined): string {
  const fromRoute = sanitizeExternalHttpUrl(routeUrl);
  const fallback =
    Platform.OS === 'ios'
      ? sanitizeExternalHttpUrl(STORE_URL_CONFIG.ios)
      : Platform.OS === 'android'
      ? sanitizeExternalHttpUrl(STORE_URL_CONFIG.android)
      : '';
  const base = fromRoute || fallback;
  if (!base) {
    return '';
  }
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return normalizeStoreOpenUrl(base, Platform.OS);
  }
  return base;
}

const ForcedUpdateScreen: React.FC<Props> = ({ route }) => {
  useAnalyticsScreen({ screenName: 'ForcedUpdate', screenClass: 'ForcedUpdateScreen' });
  const { t } = useTranslation();
  const customMessage = route.params?.message?.trim();

  const effectiveStoreUrl = useMemo(() => resolveEffectiveStoreUrl(route.params?.storeUrl), [route.params?.storeUrl]);

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
    if (!effectiveStoreUrl) {
      logger.error('[ForcedUpdateScreen] URL da loja indisponível após fallback do app');
      return;
    }
    void openStoreListingWithFallback(effectiveStoreUrl).catch((cause) => {
      logger.error('[ForcedUpdateScreen] Falha ao abrir URL da loja', { storeUrl: effectiveStoreUrl, cause });
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <Image
          source={STORE_LISTING_BADGES_IMAGE}
          style={styles.storeBadges}
          resizeMode='contain'
          accessibilityIgnoresInvertColors
        />
        <View style={styles.buttonWrap}>
          <PrimaryButton
            label={t('appUpdate.updateButton')}
            onPress={openStore}
            disabled={!effectiveStoreUrl}
            loading={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForcedUpdateScreen;
