import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING.XL,
    marginHorizontal: SPACING.MD,
  },

  title: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.SM,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.SM,
  },

  bullet: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 14,
    marginRight: SPACING.SM,
  },

  itemText: {
    flex: 1,
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },
});
