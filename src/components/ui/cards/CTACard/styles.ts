import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  card: {
    paddingHorizontal: SPACING.XL + SPACING.MD,
    paddingTop: SPACING.XXL,
    borderTopLeftRadius: 64,
    borderTopRightRadius: 64,
    borderBottomLeftRadius: BORDER_RADIUS.XL,
    borderBottomRightRadius: BORDER_RADIUS.XL,
    marginBottom: SPACING.LG,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XXL,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  content: {
    gap: SPACING.SM,
    paddingTop: SPACING.MD,
    justifyContent: 'center',
  },
  highlightText: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XL,
    fontWeight: '400',
    color: COLORS.TEXT,
    lineHeight: 28,
  },
  description: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    color: COLORS.TEXT_LIGHT,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.MD,
    paddingVertical: SPACING.LG,
  },
  actionsSingle: {
    justifyContent: 'center',
  },
  singleButton: {
    width: '100%',
    borderRadius: BORDER_RADIUS.XL,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});
