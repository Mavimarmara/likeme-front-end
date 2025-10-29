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
  
  title: {
    alignItems: 'center',
    alignSelf: 'stretch',
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
    height: 60,
    lineHeight: 48,
  },
  
  medium: {
    fontSize: 32,
    height: 40,
    lineHeight: 32,
  },
  
  small: {
    fontSize: 24,
    height: 30,
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
