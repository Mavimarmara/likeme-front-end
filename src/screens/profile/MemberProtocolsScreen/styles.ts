import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FLOATING_NAV_MENU_BAR_OFFSET } from '@/constants';

export const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY.LIGHT,
  },
  listContent: {
    paddingBottom: SPACING.XL + FLOATING_NAV_MENU_BAR_OFFSET,
  },
  screenTitle: {
    fontSize: FONT_SIZES.XL,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.BLACK,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
  searchWrap: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.MD,
  },
  centered: {
    flex: 1,
    paddingBottom: SPACING.XL + FLOATING_NAV_MENU_BAR_OFFSET,
  },
  emptyWrap: {
    flex: 1,
    paddingTop: SPACING.XXL,
  },
  cardRow: {
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  footerLoader: {
    paddingVertical: SPACING.LG,
    alignItems: 'center',
  },
});
