import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY.PURE,
    borderRadius: 22,
    paddingRight: 16,
    gap: 12,
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  image: {
    width: 108,
    height: 122,
    borderRadius: 22,
  },
  content: {
    flex: 1,
    gap: 10,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  badge: {
    backgroundColor: 'rgba(0, 17, 55, 0.64)',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    color: COLORS.PRIMARY.LIGHT,
    letterSpacing: 0.2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },
  textBlock: {
    gap: 16,
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    color: COLORS.TEXT,
    letterSpacing: 0.2,
  },
  price: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'DM Sans',
    color: COLORS.TEXT,
    letterSpacing: 0.2,
  },
  outOfStock: {
    fontSize: 12,
    color: COLORS.ERROR,
    fontWeight: '600',
  },
});
