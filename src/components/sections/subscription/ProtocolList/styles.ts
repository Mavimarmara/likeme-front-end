import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  emptyContainer: {
    paddingHorizontal: SPACING.XL,
    alignItems: 'center',
    gap: SPACING.LG,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.NEUTRAL.LOW.PURE,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.NEUTRAL.LOW.PURE,
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  exploreButton: {
    width: '100%',
    minHeight: 36,
    borderWidth: 1,
    borderColor: COLORS.NEUTRAL.LOW.PURE,
    borderRadius: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: 9,
    backgroundColor: 'rgba(240, 238, 225, 0.16)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  exploreButtonText: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.NEUTRAL.LOW.PURE,
    textAlign: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
});
