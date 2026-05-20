import { Dimensions, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

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
    gap: 40,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: SPACING.XXL,
  },
  title: {
    color: COLORS.TEXT,
    fontFamily: 'Bricolage Grotesque',
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 44,
  },
  body: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 25,
  },
  bodyEmphasis: {
    fontWeight: '600',
  },
  footer: {
    paddingBottom: SPACING.MD,
    paddingTop: SPACING.LG,
    width: '100%',
    maxWidth: 362,
    alignSelf: 'center',
  },
  updateButton: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});
