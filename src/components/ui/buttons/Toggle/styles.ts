import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: BORDER_RADIUS.ROUND,
    padding: SPACING.XS,
    marginHorizontal: SPACING.MD,
    marginVertical: SPACING.MD,
  },
  option: {
    flex: 1,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.ROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#4A5568',
    fontWeight: '600',
  },
});

