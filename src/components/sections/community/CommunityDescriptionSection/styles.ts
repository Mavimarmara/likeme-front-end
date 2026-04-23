import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  welcomeCtaWrap: {
    paddingHorizontal: SPACING.MD,
  },
  welcomeCtaCard: {
    marginHorizontal: -SPACING.MD,
  },
  welcomeCtaTitle: {
    fontSize: 20,
  },
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
});
