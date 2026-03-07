import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

/** Layout provider: card Figma. Layout marketplace: lista tela Marketplace (branco, 80x80). */
export const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING.XL,
  },
  sectionMarketplace: {
    paddingHorizontal: SPACING.MD,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: SPACING.MD,
  },
  // --- Provider (card Figma) ---
  productsList: {
    gap: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF7E5',
    borderRadius: 22,
    paddingRight: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  productRowImage: {
    width: 108,
    height: 122,
    borderRadius: 22,
  },
  productRowContent: {
    flex: 1,
    gap: 10,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  productRowTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  productRowCategory: {
    backgroundColor: 'rgba(0, 17, 55, 0.64)',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productRowCategoryText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    color: '#D8E4D6',
    letterSpacing: 0.2,
  },
  productRowRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productRowRatingText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    color: '#001137',
    letterSpacing: 0.2,
  },
  productRowBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },
  productRowTextBlock: {
    gap: 16,
    flex: 1,
    minWidth: 0,
  },
  productRowTitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    color: '#001137',
    letterSpacing: 0.2,
  },
  productRowPrice: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    color: '#001137',
    letterSpacing: 0.2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
  },
  loadingText: {
    marginTop: SPACING.MD,
    fontSize: 16,
    color: '#666666',
  },
  loadingMoreContainer: {
    padding: SPACING.MD,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: SPACING.XL,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  outOfStockText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '600',
  },
  loadMoreButton: {
    padding: SPACING.MD,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginTop: SPACING.MD,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  // --- Marketplace (lista tela Marketplace) ---
  mOrderFilterMenuContainer: {
    marginBottom: SPACING.MD,
  },
  mProductsList: {
    gap: SPACING.MD,
  },
  mProductRow: {
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
  mProductRowImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: SPACING.MD,
  },
  mProductRowContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mProductRowCategory: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderRadius: 999,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    marginBottom: SPACING.XS,
  },
  mProductRowCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  mProductRowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: SPACING.XS,
  },
  mProductRowFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mProductRowPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  mProductRowAddButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.MD,
  },
});
