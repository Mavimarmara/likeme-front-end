import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    zIndex: 1,
    paddingBottom: SPACING.XL,
    backgroundColor: 'transparent',
  },
  toggleContainer: {
    paddingHorizontal: SPACING.MD,
  },
  suggestedSection: {
    marginTop: SPACING.XL,
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.LG,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  suggestedOverline: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.XS,
    letterSpacing: 0.5,
  },
  suggestedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
  },
  suggestedDescription: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.LG,
  },
  productSlide: {
    flexDirection: 'row',
  },
  productCardWrapper: {
    flex: 1,
    marginRight: SPACING.MD,
  },
  productCardWrapperLast: {
    marginRight: 0,
  },
  productCard: {
    backgroundColor: '#E7EFE7',
    borderRadius: BORDER_RADIUS.XL,
    padding: SPACING.MD,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 130,
    borderRadius: BORDER_RADIUS.LG,
    marginBottom: SPACING.SM,
  },
  productTag: {
    position: 'absolute',
    top: SPACING.MD,
    left: SPACING.MD,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.LG,
  },
  productTagText: {
    fontSize: 12,
    color: COLORS.WHITE,
    fontWeight: '500',
  },
  productInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  productLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  productLikesText: {
    fontSize: 12,
    color: COLORS.TEXT,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  productSubtitleText: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.MD,
  },
  productActionButton: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.WHITE,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productCardPlaceholder: {
    flex: 1,
  },
  sliderIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.MD,
  },
  sliderIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginHorizontal: 4,
  },
  sliderIndicatorActive: {
    width: 20,
    backgroundColor: '#4CAF50',
  },
});
