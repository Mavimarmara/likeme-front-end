import { StyleSheet, Dimensions } from 'react-native';
import { SPACING, COLORS } from '@/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '50%',
    zIndex: 0,
  },
  backgroundBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '50%',
    zIndex: 0,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  decorativeImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  decorativeImageWrapper: {
    width: SCREEN_HEIGHT * 2.2,
    height: SCREEN_WIDTH * 2.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeImage: {
    width: SCREEN_HEIGHT * 2.2,
    height: SCREEN_WIDTH * 2.2,
    transform: [{ rotate: '270deg' }],
  },
  mainContent: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -50 }],
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.XL,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.BLACK,
    lineHeight: 57.6,
    textAlign: 'center',
    fontFamily: 'Urbanist-ExtraBold',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: SPACING.XL,
    marginTop: SPACING.XL,
  },
});
