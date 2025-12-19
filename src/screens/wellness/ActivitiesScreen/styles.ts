import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  tabsContainer: {
  },
  filtersContainer: {
    marginBottom: SPACING.MD,
    gap: SPACING.SM,
  },
  createButtonContainer: {
    alignSelf: 'flex-start',
  },
  createButton: {
    alignSelf: 'flex-start',
  },
  festivalBanner: {
    backgroundColor: '#FFF9C4',
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    position: 'relative',
  },
  bannerCloseButton: {
    position: 'absolute',
    top: SPACING.SM,
    right: SPACING.SM,
    zIndex: 1,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.SM,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    fontWeight: '500',
    marginBottom: SPACING.XS,
  },
  bannerSubtext: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
  },
  sectionLabel: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.SM,
    marginTop: SPACING.XS,
  },
  scrollContent: {
    paddingBottom: SPACING.XL,
  },
  activityCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  typeBadge: {
    backgroundColor: '#FFF9C4',
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  typeBadgeText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT,
    fontWeight: '500',
  },
  cardContent: {
    gap: SPACING.SM,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
    flexWrap: 'wrap',
  },
  starIcon: {
    marginRight: SPACING.XS,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
    marginRight: SPACING.XS,
  },
  dateTimeText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    flex: 1,
  },
  cardDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 20,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    marginTop: SPACING.XS,
  },
  providerText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
  },
  providerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerAvatarText: {
    fontSize: FONT_SIZES.SM,
    fontWeight: 'bold',
    color: COLORS.TEXT,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.SM,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    gap: SPACING.XS,
  },
  markButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFF9C4',
  },
  markButtonText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: '#FFF9C4',
  },
  doneButtonText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    fontWeight: '600',
  },
  openButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  openButtonText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    fontWeight: '500',
  },
  viewLink: {
    fontSize: FONT_SIZES.SM,
    color: '#2196F3',
    fontWeight: '500',
  },
  recommendationsCard: {
    backgroundColor: '#FFF9C4',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginTop: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  recommendationsTitle: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
  },
  recommendationsSubtitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.SM,
  },
  recommendationsDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    lineHeight: 20,
    marginBottom: SPACING.MD,
  },
  anamnesisButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFF9C4',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
  },
  anamnesisButtonText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT,
    fontWeight: '600',
  },
  section: {
    marginTop: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.MD,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XL,
  },
  emptyText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
  carouselWrapper: {
    marginTop: SPACING.SM,
  },
});
