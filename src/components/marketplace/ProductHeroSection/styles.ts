import { StyleSheet, Dimensions } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  heroSection: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2E7D32',
  },
  heroProductCard: {
    position: 'absolute',
    bottom: SPACING.LG,
    right: SPACING.MD,
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    width: SCREEN_WIDTH * 0.7,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroCardTags: {
    flexDirection: 'row',
    gap: SPACING.SM,
    flexWrap: 'wrap',
    marginBottom: SPACING.SM,
  },
  heroCardTag: {
    backgroundColor: '#2E7D32',
    borderRadius: 999,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
  },
  heroCardTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#001137',
    marginBottom: SPACING.SM,
  },
  heroCardPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroCardPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001137',
  },
  heroCardCartButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  outOfStockBadge: {
    marginTop: SPACING.SM,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    backgroundColor: '#FFE0E0',
    borderRadius: BORDER_RADIUS.SM,
    alignItems: 'center',
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D32F2F',
  },
});
