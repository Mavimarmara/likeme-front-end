import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FLOATING_NAV_MENU_BAR_OFFSET, TYPOGRAPHY } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
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
    ...TYPOGRAPHY.bodyMdMedium,
    color: COLORS.NEUTRAL.LOW.PURE,
  },
  tabContent: {
    paddingTop: SPACING.LG,
    gap: SPACING.LG,
  },
  eventBannerContainer: {
    paddingHorizontal: SPACING.MD,
    width: '100%',
    alignSelf: 'stretch',
  },
  descriptionText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.NEUTRAL.LOW.DARK,
    paddingHorizontal: SPACING.LG,
  },
  emptyText: {
    ...TYPOGRAPHY.bodyMd,
    color: COLORS.NEUTRAL.LOW.DARK,
    paddingHorizontal: SPACING.LG,
  },
  loaderWrap: {
    paddingVertical: SPACING.XXL,
    alignItems: 'center',
  },
  heroFooter: {
    width: '100%',
  },
  heroDescription: {
    ...TYPOGRAPHY.bodySm,
    color: COLORS.WHITE,
    marginBottom: SPACING.SM,
  },
});
