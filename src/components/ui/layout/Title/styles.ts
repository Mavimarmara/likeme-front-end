import { SPACING } from '@/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginLeft: -SPACING.MD,
  },

  title: {
    alignSelf: 'flex-start',
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'Bricolage Grotesque',
    fontWeight: '700',
    letterSpacing: -2,
    textAlign: 'left',
    transform: [{ scaleX: 0.92 }],
  },

  large: {
    fontSize: 48,
    lineHeight: 48,
  },

  medium: {
    fontSize: 32,
    lineHeight: 32,
  },

  small: {
    fontSize: 24,
    lineHeight: 24,
  },
});
