import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: -SPACING.MD,
  },

  title: {
    ...TYPOGRAPHY.titleScreenScaled,
    alignSelf: 'flex-start',
    color: COLORS.TEXT,
    textAlign: 'left',
  },

  large: {
    fontSize: TYPOGRAPHY.titleScreen.fontSize,
    lineHeight: TYPOGRAPHY.titleScreen.lineHeight,
  },

  medium: {
    ...TYPOGRAPHY.displayMd,
  },

  small: {
    ...TYPOGRAPHY.displaySm,
  },
});
