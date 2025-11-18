import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, BORDER_RADIUS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.LG,
  },
  
  // Variants
  primary: {
    backgroundColor: COLORS.PRIMARY,
  },
  secondary: {
    backgroundColor: COLORS.SECONDARY,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  
  // Sizes
  small: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
  },
  medium: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  large: {
    paddingVertical: SPACING.LG,
    paddingHorizontal: SPACING.XL,
  },
  
  // Full width
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
  },
  
  // Text variants
  primaryText: {
    color: COLORS.WHITE,
  },
  secondaryText: {
    color: COLORS.BLACK,
  },
  outlineText: {
    color: COLORS.PRIMARY,
  },
  
  // Text sizes
  smallText: {
    fontSize: FONT_SIZES.SM,
  },
  mediumText: {
    fontSize: FONT_SIZES.MD,
  },
  largeText: {
    fontSize: FONT_SIZES.LG,
  },
});
