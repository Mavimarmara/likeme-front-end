import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
    width: '100%',
  },

  titleRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 48,
    maxWidth: '85%',
  },

  adornmentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: 90,
    overflow: 'hidden',
  },

  title: {
    alignItems: 'center',
    alignSelf: 'auto',
    color: 'rgba(0, 17, 55, 1)',
    display: 'flex',
    fontFamily: 'Bricolage Grotesque',
    fontWeight: '700',
    justifyContent: 'center',
    letterSpacing: 0,
    position: 'relative',
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

  subtitle: {
    alignItems: 'center',
    alignSelf: 'stretch',
    color: 'rgba(0, 17, 55, 1)',
    display: 'flex',
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '400',
    justifyContent: 'center',
    letterSpacing: 0,
    lineHeight: 25,
    position: 'relative',
  },
});
