import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.XL,
    gap: SPACING.MD,
  },
  communityIntroContainer: {},
  shoppingTipContainer: {},
  shoppingTip: {
    borderRadius: BORDER_RADIUS.XL,
  },
  shoppingTipTitle: {
    fontSize: 20,
  },
  specialistBlock: {},
  headerTextContainer: {
    gap: SPACING.XS,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_LIGHT,
  },
  ctaCard: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.LG,
    borderRadius: BORDER_RADIUS.XL,
  },
  ctaCardTitle: {
    fontSize: 20,
  },
  solutionsTabsRow: {
    marginTop: SPACING.MD,
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: SPACING.MD,
  },
  solutionTab: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: COLORS.NEUTRAL.LOW.MEDIUM,
  },
  solutionTabActive: {
    backgroundColor: COLORS.PRIMARY.PURE,
  },
  solutionTabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.TEXT,
  },
  solutionTabLabelActive: {
    color: COLORS.WHITE,
  },
  orderRow: {
    marginTop: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  list: {
    gap: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  cardWrapper: {
    borderRadius: BORDER_RADIUS.XL,
    overflow: 'hidden',
    backgroundColor: COLORS.NEUTRAL.LOW.PURE,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  professionalCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.XL,
    overflow: 'hidden',
    backgroundColor: COLORS.NEUTRAL.LOW.PURE,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    paddingRight: SPACING.SM,
  },
  professionalCardContent: {
    flex: 1,
  },
  professionalCardChevron: {
    marginLeft: SPACING.XS,
  },
  emptySection: {
    paddingVertical: SPACING.XL,
    alignItems: 'center',
    gap: SPACING.LG,
  },
});
