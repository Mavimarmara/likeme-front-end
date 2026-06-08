import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/constants';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: COLORS.SECONDARY.PURE,
    borderWidth: 1,
    borderColor: COLORS.TEXT,
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  buttonSmall: {
    minHeight: 36,
    borderRadius: 18,
  },
  buttonMedium: {
    minHeight: 48,
    borderRadius: 24,
  },
  buttonDark: {
    backgroundColor: COLORS.SECONDARY.LIGHT,
    borderColor: COLORS.SECONDARY.LIGHT,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.TEXT,
    textAlign: 'center',
  },
  labelDark: {
    color: COLORS.TEXT_LIGHT,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
