import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.MD,
  },

  content: {
    paddingTop: SPACING.LG,
    position: 'relative',
    width: '100%',
  },

  instructionBlock: {
    width: '100%',
    maxWidth: 305,
    alignSelf: 'center',
    gap: SPACING.XS,
    marginBottom: SPACING.LG,
  },

  titleAdornment: {
    position: 'absolute',
    right: -40,
  },

  greeting: {
    color: COLORS.TEXT,
    fontFamily: 'Bricolage Grotesque',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 52,
    marginBottom: SPACING.XL,
  },

  highlightCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },

  question: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 22,
    width: '100%',
  },

  description: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.2,
    lineHeight: 22,
  },

  markersList: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    gap: SPACING.MD,
    marginBottom: SPACING.XL,
  },

  markerButton: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },

  ctaCard: {
    marginHorizontal: -SPACING.MD,
    marginBottom: SPACING.XL,
  },

  saveButton: {
    width: '100%',
    maxWidth: 362,
    alignSelf: 'center',
    marginTop: SPACING.XL,
  },
});
