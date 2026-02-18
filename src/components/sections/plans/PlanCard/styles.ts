import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  content: {
    marginBottom: SPACING.LG,
  },

  planTitle: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },

  planSlogan: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: SPACING.SM,
  },

  planDescription: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: SPACING.MD,
  },

  planPrice: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },

  planPriceAnnual: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 0,
  },
});
