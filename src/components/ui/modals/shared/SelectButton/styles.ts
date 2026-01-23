import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

const COLORS = {
  TEXT_DARK: '#001137',
  PRIMARY: '#0154f8',
  BLACK: '#000000',
};

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 247, 229, 0.8)',
    borderRadius: BORDER_RADIUS.MD,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: SPACING.MD,
    width: '47%',
    marginHorizontal: SPACING.XS / 2,
    marginBottom: SPACING.XS,
    minWidth: 140,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSelected: {
    backgroundColor: 'rgba(240, 238, 225, 0.9)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  icon: {
    fontSize: 16,
    marginRight: 9,
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.TEXT_DARK,
    flex: 1,
  },
  textSelected: {
    fontWeight: '500',
    color: '#4CAF50',
  },
});

