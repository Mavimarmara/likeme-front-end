import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FLOATING_NAV_MENU_BAR_OFFSET } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY.LIGHT,
  },
  scrollContent: {
    paddingBottom: SPACING.XL + FLOATING_NAV_MENU_BAR_OFFSET,
  },
  infoSection: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.LG,
    gap: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.MD,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.NEUTRAL.LOW.PURE,
  },
  tabContent: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
  },
  eventsSectionTitle: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.NEUTRAL.LOW.PURE,
    marginBottom: SPACING.SM,
  },
  descriptionText: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    color: COLORS.NEUTRAL.LOW.PURE,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    color: COLORS.NEUTRAL.LOW.MEDIUM,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
  },
  loaderWrap: {
    paddingVertical: SPACING.XXL,
    alignItems: 'center',
  },
});
