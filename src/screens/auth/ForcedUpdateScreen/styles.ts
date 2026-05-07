import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.XL,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: SPACING.MD,
    fontFamily: 'DM Sans',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.XL,
    fontFamily: 'DM Sans',
  },
  buttonWrap: {
    marginTop: SPACING.MD,
  },
});
