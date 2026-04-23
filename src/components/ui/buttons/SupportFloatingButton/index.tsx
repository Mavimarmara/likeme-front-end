import React, { useCallback, useMemo } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColoredTwoDotsIcon } from '@/assets/ui';
import { AUTH_ONBOARDING_SCREENS_ORDER, FEATURE_FLAGS, isRouteNameHiddenForSupportFloating } from '@/constants';
import { useFeatureFlag } from '@/hooks';
import { useIsFloatingMenuVisible } from '@/contexts/FloatingMenuContext';
import { SUPPORT_CONFIG } from '@/config/environment';
import { getFocusedRouteNameFromNavState, getRootRouteName } from '@/utils/floatingMenuRoutePolicy';
import { logger } from '@/utils/logger';
import { styles } from './styles';

const SUPPORT_ICON_SIZE = 16;
const SUPPORT_ACCESSIBILITY_LABEL = 'Abrir suporte';
const SUPPORT_LABEL = 'Suporte';
const SUPPORT_BUTTON_DEFAULT_BOTTOM_OFFSET = 20;
const FLOATING_MENU_HEIGHT = 64;
const SUPPORT_BUTTON_MENU_GAP = 15;

const onboardingRouteNames = new Set<string>(AUTH_ONBOARDING_SCREENS_ORDER);

function buildSupportWhatsappUrl(): string {
  if (SUPPORT_CONFIG.whatsappUrl.trim()) {
    return SUPPORT_CONFIG.whatsappUrl.trim();
  }

  const phone = SUPPORT_CONFIG.whatsappPhone.replace(/\D/g, '');
  const text = encodeURIComponent(SUPPORT_CONFIG.whatsappDefaultMessage.trim());
  return `https://wa.me/${phone}?text=${text}`;
}

const SupportFloatingButton: React.FC = () => {
  const insets = useSafeAreaInsets();
  const isFloatingMenuVisible = useIsFloatingMenuVisible();
  const { isEnabled: isSupportFloatingButtonEnabled } = useFeatureFlag(FEATURE_FLAGS.SUPPORT_FLOATING_BUTTON_ENABLED);
  const rootRouteName = useNavigationState((state) => getRootRouteName(state));
  const focusedRouteName = useNavigationState((state) => getFocusedRouteNameFromNavState(state));

  const shouldHideOnboarding = useMemo(
    () => onboardingRouteNames.has(rootRouteName ?? '') || onboardingRouteNames.has(focusedRouteName ?? ''),
    [focusedRouteName, rootRouteName],
  );

  const shouldHideSplashOrBootstrap = useMemo(
    () => isRouteNameHiddenForSupportFloating(rootRouteName) || isRouteNameHiddenForSupportFloating(focusedRouteName),
    [focusedRouteName, rootRouteName],
  );

  const bottomOffset = useMemo(() => {
    if (isFloatingMenuVisible) {
      return FLOATING_MENU_HEIGHT + SUPPORT_BUTTON_MENU_GAP;
    }

    return insets.bottom + SUPPORT_BUTTON_DEFAULT_BOTTOM_OFFSET;
  }, [insets.bottom, isFloatingMenuVisible]);

  const handlePressSupport = useCallback(async () => {
    const supportUrl = buildSupportWhatsappUrl();
    if (!supportUrl) {
      logger.warn('[SupportFloatingButton] URL de suporte não configurada');
      return;
    }

    logger.info('[SupportFloatingButton] Abrindo link de suporte', {
      supportUrl,
      hasAccentInMessage: SUPPORT_CONFIG.whatsappDefaultMessage.includes('ú'),
    });

    try {
      const canOpen = await Linking.canOpenURL(supportUrl);
      if (!canOpen) {
        logger.warn('[SupportFloatingButton] URL de suporte inválida', { supportUrl });
        return;
      }

      await Linking.openURL(supportUrl);
    } catch (error) {
      logger.error('[SupportFloatingButton] Falha ao abrir suporte', {
        supportUrl,
        cause: error,
      });
    }
  }, []);

  if (!isSupportFloatingButtonEnabled || shouldHideOnboarding || shouldHideSplashOrBootstrap) {
    return null;
  }

  return (
    <View pointerEvents='box-none' style={styles.wrapper}>
      <Pressable
        accessibilityRole='button'
        accessibilityLabel={SUPPORT_ACCESSIBILITY_LABEL}
        onPress={() => {
          void handlePressSupport();
        }}
        style={[styles.button, { bottom: bottomOffset }]}
      >
        <Text style={styles.label}>{SUPPORT_LABEL}</Text>
        <ColoredTwoDotsIcon width={SUPPORT_ICON_SIZE} height={SUPPORT_ICON_SIZE} />
      </Pressable>
    </View>
  );
};

export default SupportFloatingButton;
