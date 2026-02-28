import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

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
