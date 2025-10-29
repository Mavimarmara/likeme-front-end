import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ec',
  },
  splashContainer: {
    backgroundColor: '#f4f3ec',
    height: height,
    minWidth: 393,
    position: 'relative',
    width: width,
  },
  gradientEffect: {
    height: 247,
    left: width * 0.28,
    position: 'absolute',
    top: height * 0.21,
    width: width * 0.45,
    overflow: 'hidden',
  },
  scrollContainer: {
    flexDirection: 'column',
    height: 247 * 3.5, // 350.61% como no CSS
  },
  gradientImage: {
    height: 247,
    width: width * 0.45,
  },
  like: {
    height: height * 0.063, // 6.31%
    left: '50%',
    position: 'absolute',
    top: height * 0.4, // Ajustado para ficar mais próximo da UnauthenticatedScreen
    width: width * 0.358, // 35.79%
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -(width * 0.358) / 2 }], // Centraliza horizontalmente
  },
  dots: {
    height: 38,
    left: '50%',
    position: 'absolute',
    top: height * 0.4 + 30,
    width: 17,
    backgroundColor: '#1E3A8A',
    borderRadius: 2,
    transform: [{ translateX: 70 }],
  },
  taglineContainer: {
    height: 48,
    left: '50%',
    position: 'absolute',
    top: height * 0.4 + 80,
    width: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -(width * 0.7) / 2 }],
  },
  taglineText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    fontFamily: 'Bricolage Grotesque',
  },
});
