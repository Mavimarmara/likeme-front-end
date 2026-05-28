import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: SPACING.XL,
    paddingHorizontal: SPACING.MD,
    gap: SPACING.MD,
    maxWidth: 272,
    alignSelf: 'center',
    width: '100%',
  },
  icon: {
    marginBottom: SPACING.XS,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.BLACK,
    textAlign: 'center',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: FONT_SIZES.XL,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.BLACK,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.MD,
  },
  button: {
    alignSelf: 'stretch',
  },
});
