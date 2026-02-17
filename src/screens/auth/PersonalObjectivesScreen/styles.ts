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
    paddingBottom: 120,
    paddingHorizontal: SPACING.MD,
  },

  content: {
    paddingTop: SPACING.LG,
    position: 'relative',
    width: '100%',
  },

  titleAdornment: {
    position: 'absolute',
    right: -40,
    top: -60,
  },

  greeting: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.SM,
  },

  question: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: SPACING.LG,
    width: '100%',
  },

  markersList: {
    width: '100%',
    gap: SPACING.SM,
  },

  markerButton: {
    width: '100%',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.XL,
  },

  saveButton: {
    width: '100%',
  },
});
