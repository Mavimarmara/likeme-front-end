import { Dimensions, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

export type ComputeKeyboardInsetParams = {
  keyboardHeight: number;
  screenY?: number;
  windowHeight?: number;
};

export function computeKeyboardInset(params: ComputeKeyboardInsetParams): number {
  const { keyboardHeight: height, screenY } = params;
  if (height <= 0) return 0;
  const windowH = params.windowHeight ?? Dimensions.get('window').height;
  if (typeof screenY === 'number' && screenY > 0 && screenY <= windowH) {
    return Math.max(height, windowH - screenY);
  }
  return height;
}

export type KeyboardFooterResolvedOptions = {
  translateFooterWithKeyboard: boolean;
  keyboardFooterLiftExtra: number;
  includeFooterHeightInKeyboardLift: boolean;
};

export type KeyboardFooterOverrides = Partial<KeyboardFooterResolvedOptions>;

export function resolveKeyboardFooterOptions(
  defaults: KeyboardFooterResolvedOptions,
  overrides?: KeyboardFooterOverrides,
): KeyboardFooterResolvedOptions {
  if (overrides == null) return defaults;
  return {
    translateFooterWithKeyboard: overrides.translateFooterWithKeyboard ?? defaults.translateFooterWithKeyboard,
    keyboardFooterLiftExtra: overrides.keyboardFooterLiftExtra ?? defaults.keyboardFooterLiftExtra,
    includeFooterHeightInKeyboardLift:
      overrides.includeFooterHeightInKeyboardLift ?? defaults.includeFooterHeightInKeyboardLift,
  };
}

export function resolveBaseScrollContentPaddingBottom(
  scrollContentContainerStyle: StyleProp<ViewStyle> | undefined,
  fallbackPaddingBottom: number,
): number {
  if (scrollContentContainerStyle == null) return fallbackPaddingBottom;
  const flat = StyleSheet.flatten(scrollContentContainerStyle);
  return typeof flat.paddingBottom === 'number' ? flat.paddingBottom : fallbackPaddingBottom;
}

export function resolveScrollContentPaddingBottom(params: {
  basePaddingBottom: number;
  hasFooter: boolean;
  keyboardInset: number;
}): number {
  const { basePaddingBottom, hasFooter, keyboardInset } = params;
  if (hasFooter && keyboardInset > 0) return basePaddingBottom + keyboardInset;
  return basePaddingBottom;
}
