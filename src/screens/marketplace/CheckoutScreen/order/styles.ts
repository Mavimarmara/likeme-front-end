import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SPACING.XL,
    paddingHorizontal: SPACING.XXL,
    gap: SPACING.MD,
    alignSelf: 'center',
    width: '100%',
  },
  icon: {
    width: 32,
    height: 32,
    marginBottom: SPACING.XS,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.BLACK,
    textAlign: 'center',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: FONT_SIZES.XL,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.BLACK,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.MD,
  },
  button: {
    alignSelf: 'center',
  },
});
