import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '@/constants';

export const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  button: {
    position: 'absolute',
    right: 16,
    minHeight: 36,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 2,
    backgroundColor: COLORS.NEUTRAL.LOW.PURE,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  label: {
    color: COLORS.NEUTRAL.HIGH.LIGHT,
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
  },
});
