import { StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES } from '@/constants';
import { COLORS } from '@/constants';

export const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  scroll: {
    maxHeight: '100%',
  },
  footer: {
    marginTop: SPACING.MD,
    gap: SPACING.SM,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.MD,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.NEUTRAL.LOW.PURE,
    marginBottom: SPACING.MD,
  },
  sectionBlock: {
    marginBottom: SPACING.MD,
  },
  sectionBlockLast: {
    marginBottom: 0,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.NEUTRAL.LOW.LIGHT,
    marginBottom: SPACING.MD,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XS,
  },
  chipWidth: {
    width: '48%',
  },
});
