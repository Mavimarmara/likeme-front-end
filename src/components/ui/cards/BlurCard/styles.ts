import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SPACING } from '@/constants';

export const DEFAULT_BORDER_RADIUS = 22;
export const BLUR_INTENSITY = 10;

export const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: SPACING.SM,
    flex: 1,
    minHeight: 100,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: SPACING.SM,
    paddingBottom: 0,
  },
  topSection: {
    paddingHorizontal: SPACING.SM,
  },
  footerSection: {
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.SM,
    paddingBottom: SPACING.SM,
    gap: SPACING.SM,
  },
  footerContent: {
    position: 'relative',
    zIndex: 1,
    gap: SPACING.SM,
  },
});

/**
 * Normaliza o valor de borderRadius para um número
 */
const normalizeBorderRadius = (borderRadius: ViewStyle['borderRadius']): number => {
  if (typeof borderRadius === 'number') {
    return borderRadius;
  }
  if (typeof borderRadius === 'string') {
    const parsed = parseFloat(borderRadius);
    return isNaN(parsed) ? DEFAULT_BORDER_RADIUS : parsed;
  }
  return DEFAULT_BORDER_RADIUS;
};

/**
 * Extrai o borderRadius de um StyleProp<ViewStyle>
 */
export const extractBorderRadius = (style: StyleProp<ViewStyle>): number => {
  if (!style) return DEFAULT_BORDER_RADIUS;

  const styleObj = Array.isArray(style) ? Object.assign({}, ...style.filter(Boolean)) : style;

  const borderRadius = (styleObj as ViewStyle)?.borderRadius;
  return normalizeBorderRadius(borderRadius);
};

/**
 * Normaliza um StyleProp para um objeto ViewStyle
 */
export const normalizeStyle = (style: StyleProp<ViewStyle>): ViewStyle => {
  if (!style) return {};

  if (Array.isArray(style)) {
    return Object.assign({}, ...style.filter(Boolean));
  }

  return style as ViewStyle;
};

export const getBlurStyle = (footerHeight: number, borderRadius: ViewStyle['borderRadius']): ViewStyle => {
  const radius = normalizeBorderRadius(borderRadius);

  return {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: footerHeight > 0 ? footerHeight + 8 : 60,
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
    overflow: 'hidden',
  };
};

export const getFooterSectionStyle = (borderRadius: ViewStyle['borderRadius']): ViewStyle => {
  const radius = normalizeBorderRadius(borderRadius);

  return {
    borderBottomLeftRadius: radius,
    borderBottomRightRadius: radius,
  };
};
