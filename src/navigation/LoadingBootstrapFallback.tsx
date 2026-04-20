import React, { useEffect } from 'react';
import type { ComponentType } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { logger } from '@/utils/logger';

type BootstrapNavigation = { replace: (name: string, params?: Record<string, unknown>) => void };

type Props = { navigation: BootstrapNavigation };

const FALLBACK_NAVIGATE_MS = 2_500;

/**
 * Exibido se o módulo principal do Loading falhar ao carregar (`require` quebra).
 * Mantém superfície do app e encaminha para login para o usuário não ficar preso.
 */
export const LoadingBootstrapFallback: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        navigation.replace('Unauthenticated');
      } catch (error) {
        logger.error('[LoadingBootstrapFallback] Falha ao redirecionar após erro de bootstrap', { cause: error });
      }
    }, FALLBACK_NAVIGATE_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} accessibilityLabel='Carregando' />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const loadingBootstrapFallbackScreen: ComponentType<Record<string, unknown>> =
  LoadingBootstrapFallback as ComponentType<Record<string, unknown>>;
