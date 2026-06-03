import { Dimensions, StyleSheet } from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '@/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GRADIENT_ASPECT = 389 / 278;

export const GRADIENT_WIDTH = Math.min(SCREEN_WIDTH, 389);
export const GRADIENT_HEIGHT = GRADIENT_WIDTH / GRADIENT_ASPECT;

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  root: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.SM,
    paddingBottom: SPACING.MD,
  },
  gradientWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: GRADIENT_HEIGHT,
    marginTop: SPACING.XL,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: SPACING.SECTION,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: SPACING.XXL,
  },
  title: {
    ...TYPOGRAPHY.displayLg,
    color: COLORS.TEXT,
  },
  body: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.TEXT,
  },
  bodyEmphasis: {
    ...TYPOGRAPHY.bodyLgSemibold,
  },
  footer: {
    paddingBottom: SPACING.MD,
    paddingTop: SPACING.LG,
    width: '100%',
    maxWidth: 362,
    alignSelf: 'center',
  },
  updateButton: {
    borderTopLeftRadius: BORDER_RADIUS.BUTTON_TOP,
    borderTopRightRadius: BORDER_RADIUS.BUTTON_TOP,
    borderBottomLeftRadius: BORDER_RADIUS.BUTTON_BOTTOM,
    borderBottomRightRadius: BORDER_RADIUS.BUTTON_BOTTOM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});
