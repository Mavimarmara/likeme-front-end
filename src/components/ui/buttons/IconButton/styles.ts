import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 2,
    padding: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  iconBackground: {
    width: 53,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBackgroundImage: {
    width: 53,
    height: 48,
    resizeMode: 'cover',
  },
  label: {
    fontFamily: 'DM Sans',
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
});
