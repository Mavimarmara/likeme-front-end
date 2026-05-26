import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FLOATING_NAV_MENU_BAR_OFFSET } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.XL + FLOATING_NAV_MENU_BAR_OFFSET,
  },
  infoSection: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
    gap: SPACING.SM,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.NEUTRAL.LOW.PURE,
  },
  tabContent: {
    paddingTop: SPACING.LG,
    gap: SPACING.LG,
  },
  eventCardWrap: {
    paddingHorizontal: SPACING.MD,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.NEUTRAL.LOW.DARK,
    letterSpacing: 0.2,
    lineHeight: 22,
    paddingHorizontal: SPACING.LG,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    color: COLORS.NEUTRAL.LOW.DARK,
    paddingHorizontal: SPACING.LG,
  },
  heroFooter: {
    width: '100%',
  },
  heroDescription: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    lineHeight: 20,
    color: '#FFFFFF',
  },
});
