import { StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES, COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.MD,
    marginBottom: SPACING.LG,
    paddingHorizontal: 0,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  labelActive: {
    fontSize: FONT_SIZES.XL,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
  },
  labelInactive: {
    fontSize: FONT_SIZES.XL,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.NEUTRAL.LOW.MEDIUM,
    marginBottom: SPACING.XS,
  },
  line: {
    height: 2,
    width: 105,
  },
  lineActive: {
    backgroundColor: COLORS.INFO,
  },
  lineInactive: {
    height: 2,
    width: 105,
    backgroundColor: COLORS.NEUTRAL.LOW.MEDIUM,
  },
});
