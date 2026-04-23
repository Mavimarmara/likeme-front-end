import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.LG,
    marginBottom: SPACING.MD,
  },
  price: {
    fontSize: 20,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.NEUTRAL.LOW.PURE,
    lineHeight: 20,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 17, 55, 0.8)',
    borderRadius: 22,
    paddingLeft: SPACING.MD,
    paddingVertical: 0,
    minHeight: 36,
    gap: SPACING.MD,
  },
  quantitySelectorWrapper: {
    position: 'relative',
  },
  quantityLabel: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.SECONDARY.LIGHT,
    minWidth: 24,
    textAlign: 'center',
  },
  quantityButton: {
    width: 40,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001137',
    borderRadius: 18,
  },
  quantityDropdown: {
    position: 'absolute',
    top: 42,
    right: 0,
    minWidth: 86,
    borderRadius: 16,
    backgroundColor: '#001137',
    overflow: 'hidden',
    zIndex: 20,
    elevation: 6,
  },
  quantityDropdownOption: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  quantityDropdownOptionLabel: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.SECONDARY.LIGHT,
    textAlign: 'center',
  },
  paymentLinkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.LG,
  },
  paymentLinkText: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.NEUTRAL.LOW.DARK,
    lineHeight: 18,
  },
});
