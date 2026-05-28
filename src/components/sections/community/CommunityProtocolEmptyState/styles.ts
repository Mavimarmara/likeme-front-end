import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.XL,
    alignItems: 'center',
    gap: SPACING.LG,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.NEUTRAL.LOW.PURE,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.NEUTRAL.LOW.PURE,
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  exploreButton: {
    width: '100%',
    minHeight: 36,
    borderWidth: 1,
    borderColor: COLORS.NEUTRAL.LOW.PURE,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: 9,
    backgroundColor: 'rgba(240, 238, 225, 0.16)',
  },
  exploreButtonText: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.NEUTRAL.LOW.PURE,
    textAlign: 'center',
  },
});
