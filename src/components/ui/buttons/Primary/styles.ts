import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '@/constants';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: COLORS.TEXT,
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  buttonLight: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: COLORS.SECONDARY.LIGHT,
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    minHeight: 36,
    borderRadius: 18,
  },
  buttonLarge: {
    minHeight: 48,
    borderRadius: 24,
  },
  label: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  labelLight: {
    ...TYPOGRAPHY.labelMd,
    color: COLORS.TEXT,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconLeft: {
    marginRight: 0,
  },
  iconRight: {
    marginLeft: 0,
  },
});
