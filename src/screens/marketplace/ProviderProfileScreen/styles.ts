import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.BACKGROUND,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
    opacity: 0.1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.LG,
  },
  tabsContainer: {
    marginBottom: SPACING.LG,
  },
  aboutSection: {
    marginBottom: SPACING.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: '#001137',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: '#001137',
    lineHeight: 22,
  },
  programsSection: {
    marginBottom: SPACING.XL,
  },
  productsSection: {
    marginBottom: SPACING.XL,
    gap: SPACING.MD,
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.MD,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  productRowImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: SPACING.MD,
  },
  productRowContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productRowCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderRadius: 999,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    marginBottom: SPACING.XS,
  },
  productRowCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  productRowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: SPACING.XS,
  },
  productRowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productRowPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  productRowAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.MD,
  },
  talkButtonContainer: {
    marginVertical: SPACING.XL,
    marginHorizontal: SPACING.MD,
  },
  talkButton: {
    width: '100%',
  },
  feedbackSection: {
    backgroundColor: '#DBE7DB',
    borderRadius: 20,
    padding: SPACING.LG,
    marginTop: SPACING.XL,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  feedbackTitle: {
    fontSize: 18,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: '#001137',
  },
  feedbackRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feedbackRatingText: {
    fontSize: 16,
    fontFamily: 'DM Sans',
    fontWeight: '600',
    color: '#001137',
  },
  reviewsList: {
    gap: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  reviewCard: {
    backgroundColor: '#F9F7F4',
    borderRadius: 12,
    padding: SPACING.MD,
  },
  reviewUserName: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: '#001137',
    marginBottom: 4,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: '#001137',
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: '#666666',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRatingText: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    fontWeight: '600',
    color: '#001137',
  },
  seeAllButton: {
    alignItems: 'center',
    paddingVertical: SPACING.MD,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '600',
    color: '#001137',
  },
  communityPreviewContainer: {
    gap: SPACING.MD,
  },
  communitiesSectionTitle: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: '#001137',
    marginBottom: SPACING.SM,
  },
  loadingContainer: {
    flex: 1,
    padding: SPACING.XL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.MD,
    fontSize: 16,
    color: COLORS.NEUTRAL.LOW.DARK,
  },
  emptyContainer: {
    padding: SPACING.XL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});
