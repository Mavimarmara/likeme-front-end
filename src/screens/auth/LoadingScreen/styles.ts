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
    left: (width - 176) / 2,
    position: 'absolute',
    top: height * 0.4 - 225,
    width: 176,
    overflow: 'hidden',
  },
  scrollContainer: {
    flexDirection: 'column',
    height: 866 * 3,
  },
  gradientImage: {
    height: 866,
    width: 176,
  },
  like: {
    height: 54,
    left: '50%',
    position: 'absolute',
    top: '42%',
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -85 }, { translateY: -27 }],
  },
  taglineContainer: {
    height: 48,
    left: '50%',
    position: 'absolute',
    top: '46%',
    width: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -(width * 0.7) / 2 }],
  },
  taglineText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(30, 58, 138, 1)',
    textAlign: 'center',
    fontFamily: 'DM Sans',
  },
});
