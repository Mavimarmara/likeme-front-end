import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.SM,
    paddingVertical: SPACING.MD,
  },
  textInputWrapper: {
    flex: 1,
    backgroundColor: COLORS.NEUTRAL.LOW.PURE,
    borderRadius: 18,
    paddingHorizontal: SPACING.MD,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.SECONDARY.LIGHT,
    letterSpacing: 0.2,
    padding: 0,
    maxHeight: 120,
  },
});
