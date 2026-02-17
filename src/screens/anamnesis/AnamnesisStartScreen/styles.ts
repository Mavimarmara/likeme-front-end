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
    left: 33,
    width: 326,
    transform: [{ translateY: -200 }],
    zIndex: 1,
  },
  textContainer: {
    marginBottom: SPACING.XL * 2,
    gap: SPACING.MD,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.BLACK,
    lineHeight: 24,
    textTransform: 'uppercase',
    fontFamily: 'Bricolage Grotesque',
    letterSpacing: 0,
  },
  description: {
    fontSize: 20,
    fontWeight: '400',
    color: COLORS.BLACK,
    lineHeight: 25,
    fontFamily: 'DM Sans',
    letterSpacing: 0,
    width: 291,
  },
  buttonsContainer: {
    gap: SPACING.SM,
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
});
