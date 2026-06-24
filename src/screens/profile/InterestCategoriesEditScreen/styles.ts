import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingBottom: 0,
  },

  layout: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.MD,
  },

  content: {
    paddingTop: SPACING.LG,
    width: '100%',
  },

  instructionBlock: {
    width: '100%',
    gap: SPACING.MD,
    marginBottom: SPACING.XL,
  },

  title: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },

  instructionTexts: {
    width: '100%',
    gap: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },

  supportText: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },

  instruction: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
  },

  note: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
    lineHeight: 18,
  },

  categoriesList: {
    width: '100%',
    gap: SPACING.MD,
    marginBottom: SPACING.XL,
    paddingHorizontal: SPACING.LG,
  },

  categoryButton: {
    width: '100%',
  },

  footer: {
    width: '100%',
    paddingHorizontal: SPACING.MD,
  },

  loadErrorBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.LG,
    gap: SPACING.MD,
  },

  loadErrorText: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
