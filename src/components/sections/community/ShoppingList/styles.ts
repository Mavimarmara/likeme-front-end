import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  communityIntroContainer: {},
  shoppingTipContainer: {},
  shoppingTip: {
    borderRadius: BORDER_RADIUS.XL,
  },
  shoppingTipTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.BLACK,
  },
  shoppingTipDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.BLACK,
    lineHeight: 20,
  },
  shoppingTipDescriptionBold: {
    fontWeight: '700',
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: 0,
  },
  professionalCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.MD,
  },
  professionalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: SPACING.MD,
  },
  professionalAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.NEUTRAL.HIGH.PURE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.MD,
  },
  professionalInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: 2,
  },
  professionalProfession: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '400',
  },
  professionalViewProfileButton: {
    alignSelf: 'center',
  },
  professionalCardSeparator: {
    height: 1,
    backgroundColor: COLORS.NEUTRAL.LOW.MEDIUM,
  },
  emptySection: {
    paddingVertical: SPACING.XL,
    alignItems: 'center',
    gap: SPACING.LG,
  },
});
