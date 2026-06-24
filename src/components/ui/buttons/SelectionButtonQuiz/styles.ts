import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
  },

  buttonSmall: {
    paddingHorizontal: SPACING.MD,
    height: 32,
  },

  buttonMedium: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    minHeight: 48,
  },

  buttonDefault: {
    backgroundColor: COLORS.NEUTRAL.HIGH.PURE,
    borderColor: COLORS.NEUTRAL.LOW.LIGHT,
  },

  buttonSelected: {
    backgroundColor: COLORS.HIGHLIGHT.LIGHT,
    borderColor: COLORS.TEXT,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },

  buttonContentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.SM,
  },

  iconLeft: {
    marginRight: SPACING.SM,
  },

  iconRight: {},

  label: {
    fontFamily: 'DM Sans',
    fontWeight: '500',
    flex: 1,
  },

  labelSmall: {
    fontSize: 14,
    lineHeight: 20,
  },

  labelMedium: {
    fontSize: 14,
    lineHeight: 20,
  },

  labelDefault: {
    color: COLORS.NEUTRAL.LOW.DARK,
  },

  labelSelected: {
    color: COLORS.TEXT,
  },

  buttonProfile: {
    minHeight: 32,
    paddingHorizontal: SPACING.MD,
    borderWidth: 1.5,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  buttonProfileDefault: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(143, 163, 161, 0.8)',
  },

  buttonProfileSelected: {
    backgroundColor: COLORS.HIGHLIGHT.LIGHT,
    borderColor: COLORS.PRIMARY.MEDIUM,
  },

  labelProfile: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },

  labelProfileDefault: {
    color: COLORS.PRIMARY.MEDIUM,
  },

  labelProfileSelected: {
    color: COLORS.TEXT,
  },
});
