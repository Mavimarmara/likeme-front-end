import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    paddingBottom: 0,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    width: '100%',
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.XL,
    paddingBottom: SPACING.LG,
  },

  title: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
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
