import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Animated, Image, ImageStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PartialLogo, GradientSplash7, GradientSplash8, GradientSplash9 } from '@/assets/auth';
import { styles, GRADIENT_STRIP_HEIGHT, GRADIENT_STRIP_WIDTH } from './styles';
import { storageService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { getApiUrl } from '@/config';
import { ensureI18nHydrated, startI18nHydration } from '@/i18n/hydration';
import { fetchWithTimeout } from '@/utils/network/fetchWithTimeout';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const GRADIENT_SOURCES = [GradientSplash7, GradientSplash8, GradientSplash9];
const AUTH_TOKEN_VALIDATE_TIMEOUT_MS = 12_000;
const BOOTSTRAP_MAX_WAIT_MS = 8_000;

type Props = { navigation: any };

const LoadingScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Loading', screenClass: 'LoadingScreen' });
  const { t } = useTranslation();
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(1)).current;
  const [step, setStep] = useState(0);
  const hasNavigatedRef = useRef(false);

  const TAGLINES = [t('auth.taglineRhythm'), t('auth.taglineJourney'), t('auth.taglineRoutine')];

  const gradientAssets = useMemo(() => GRADIENT_SOURCES.map((source) => Image.resolveAssetSource(source)), []);

  const gradientHeights = useMemo(
    () =>
      gradientAssets.map((asset) => {
        if (!asset) {
          return GRADIENT_STRIP_HEIGHT;
        }
        const scale = asset.width ? GRADIENT_STRIP_WIDTH / asset.width : 1;
        const originalHeight = asset.height ?? GRADIENT_STRIP_HEIGHT;
        return originalHeight * scale;
      }),
    [gradientAssets],
  );

  const cumulativeOffsets = useMemo(() => {
    const offsets: number[] = [];
    let sum = 0;
    gradientHeights.forEach((heightValue, index) => {
      sum += heightValue;
      offsets[index] = -sum;
    });
    return offsets;
  }, [gradientHeights]);

  const totalGradientHeight = useMemo(
    () => gradientHeights.reduce((acc, heightValue) => acc + heightValue, 0),
    [gradientHeights],
  );

  useEffect(() => {
    const replaceOnce = (routeName: string, params?: Record<string, unknown>) => {
      if (hasNavigatedRef.current) {
        return;
      }

      hasNavigatedRef.current = true;
      navigation.replace(routeName, params);
    };

    const run = async () => {
      let shouldAuthenticate = false;
      void startI18nHydration('pt-BR');
      const timing = (anim: Animated.Value, toValue: number, duration: number) =>
        new Promise<void>((resolve) => {
          Animated.timing(anim, { toValue, duration, useNativeDriver: true }).start(() => resolve());
        });
      const delay = (ms: number) => new Promise<void>((r) => setTimeout(() => r(), ms));
      const fadeTagToStep = (next: number, fadeOutMs = 180, fadeInMs = 900) =>
        new Promise<void>((resolve) => {
          Animated.timing(taglineOpacity, {
            toValue: 0,
            duration: fadeOutMs,
            useNativeDriver: true,
          }).start(() => {
            setStep(next);
            Animated.timing(taglineOpacity, {
              toValue: 1,
              duration: fadeInMs,
              useNativeDriver: true,
            }).start(() => resolve());
          });
        });

      try {
        await timing(fadeAnim, 1, 300);
        await delay(300);

        const firstOffset = cumulativeOffsets[0] ?? -GRADIENT_STRIP_HEIGHT;

        await Promise.all([timing(scrollAnim, firstOffset, 1200), fadeTagToStep(1, 160, 1040)]);
        await delay(240);

        const secondOffset = cumulativeOffsets[1] ?? cumulativeOffsets[0] ?? -GRADIENT_STRIP_HEIGHT;

        await Promise.all([timing(scrollAnim, secondOffset, 1200), fadeTagToStep(2, 160, 1040)]);

        await delay(360);

        try {
          const token = await storageService.getToken();
          if (token) {
            const response = await fetchWithTimeout(
              getApiUrl('/api/auth/token'),
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              },
              AUTH_TOKEN_VALIDATE_TIMEOUT_MS,
            );

            if (response.ok) {
              const data = await response.json();
              if (data.token || data.accessToken) {
                await storageService.setToken(data.token || data.accessToken);
              }
              shouldAuthenticate = true;
            }
          }
        } catch (error) {
          const err = error as Error & { name?: string };
          const aborted = err?.name === 'AbortError' || (error instanceof Error && error.message?.includes('aborted'));
          console.error('Erro ao renovar token:', error);
          if (aborted) {
            await storageService.removeToken();
          }
        }
      } catch (error) {
        console.error('[LoadingScreen] Falha no fluxo inicial (animacao ou bootstrap):', error);
      }

      try {
        await ensureI18nHydrated({ lang: 'pt-BR', timeoutMs: 2500 });
      } catch (hydrationError) {
        console.error('[LoadingScreen] Falha ao aguardar i18n:', hydrationError);
      }

      replaceOnce(shouldAuthenticate ? 'Authenticated' : 'Unauthenticated');
    };

    const bootstrapWatchdog = setTimeout(() => {
      console.error('[LoadingScreen] Timeout de bootstrap inicial.');
      replaceOnce('Error', {
        errorMessage: 'Conexao com a internet necessaria para continuar.',
      });
    }, BOOTSTRAP_MAX_WAIT_MS);

    const timer = setTimeout(run, 300);
    return () => {
      clearTimeout(timer);
      clearTimeout(bootstrapWatchdog);
    };
  }, [navigation, scrollAnim, fadeAnim, taglineOpacity, cumulativeOffsets]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim }]}>
        <View style={styles.gradientEffect}>
          <Animated.View
            style={[
              styles.scrollContainer,
              {
                transform: [{ translateY: scrollAnim }],
                height: totalGradientHeight || GRADIENT_STRIP_HEIGHT * GRADIENT_SOURCES.length,
              },
            ]}
          >
            {GRADIENT_SOURCES.map((source, index) => {
              const asset = Image.resolveAssetSource(source);
              const scale = asset.width ? GRADIENT_STRIP_WIDTH / asset.width : 1;
              const heightScaled =
                gradientHeights[index] ?? (asset.height ? asset.height * scale : GRADIENT_STRIP_HEIGHT);
              const combinedStyle: ImageStyle = {
                width: GRADIENT_STRIP_WIDTH,
                height: heightScaled,
              };
              return <AnimatedImage key={index} source={source} style={combinedStyle} resizeMode='cover' />;
            })}
          </Animated.View>
        </View>

        <View style={styles.like}>
          <PartialLogo width='100%' height='100%' />
        </View>

        <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity }]}>
          <Text style={styles.taglineText}>{TAGLINES[step]}</Text>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
