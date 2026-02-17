import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSmall: {
    width: 40,
    height: 36,
    borderRadius: BORDER_RADIUS.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  containerMedium: {
    width: 53,
    height: 48,
    borderRadius: BORDER_RADIUS.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    resizeMode: 'cover',
  },
  imageSmall: {
    width: 40,
    height: 36,
  },
  imageMedium: {
    width: 53,
    height: 48,
  },
});
