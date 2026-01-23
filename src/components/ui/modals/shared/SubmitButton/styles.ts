import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

const COLORS = {
  TEXT_DARK: '#001137',
  TEXT_LIGHT: '#666666',
  BORDER: '#b2b2b2',
  BLACK: '#000000',
};

export const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(240, 238, 225, 0.16)',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingVertical: 9,
    paddingHorizontal: SPACING.MD,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginTop: SPACING.SM,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_DARK,
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
  textDisabled: {
    color: COLORS.TEXT_LIGHT,
  },
});
