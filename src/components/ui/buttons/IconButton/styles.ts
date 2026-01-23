import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 2,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    width: 53,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
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
    color: '#6E6A6A',
    textAlign: 'center',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
});

