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
    paddingBottom: 170,
    paddingHorizontal: SPACING.MD,
  },

  content: {
    paddingTop: SPACING.XXL,
    position: 'relative',
    width: '100%',
  },

  titleAdornment: {
    position: 'absolute',
    right: -40,
  },

  greeting: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 48,
    fontWeight: '700',
    marginBottom: SPACING.MD,
  },

  question: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: SPACING.LG,
    width: '100%',
  },

  description: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.2,
  },

  markersList: {
    width: '100%',
    gap: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.XL,
  },

  markerButton: {
    width: '100%',
  },

  ctaCard: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.XL,
    marginHorizontal: -SPACING.MD,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    zIndex: 2,
    elevation: 2,
  },

  saveButton: {
    width: '100%',
  },
});
