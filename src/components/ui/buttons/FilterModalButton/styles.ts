import { StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES } from '@/constants';
import { COLORS } from '@/constants';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 247, 229, 0.8)',
    borderRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  buttonSelected: {
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY.PURE,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    marginRight: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.NEUTRAL.LOW.PURE,
    flex: 1,
  },
});
