import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ec',
  },
  splash: {
    backgroundColor: '#f4f3ec',
    height: height,
    minWidth: 393,
    position: 'relative',
    width: width,
  },
  gradienteEfeito: {
    height: 247,
    left: width * 0.28, // 109px de 393px
    position: 'absolute',
    top: height * 0.21, // 178px de 852px
    width: width * 0.45, // 176px de 393px
    overflow: 'hidden',
  },
  scrollContainer: {
    flexDirection: 'column',
    height: 247 * 3.5, // 350.61% como no CSS
  },
  efeitoGradiente: {
    height: 247,
    width: width * 0.45,
  },
  like: {
    height: height * 0.063, // 6.31%
    left: width * 0.29, // 29.01%
    position: 'absolute',
    top: height * 0.466, // 46.60%
    width: width * 0.358, // 35.79%
    justifyContent: 'center',
    alignItems: 'center',
  },
  doisPontos: {
    height: 38,
    left: width * 0.5 + 70,
    position: 'absolute',
    top: height * 0.5 - 21,
    width: 17,
    backgroundColor: '#1E3A8A',
    borderRadius: 2,
  },
  taglineEfeito: {
    height: 48,
    left: width * 0.15, // 59px de 393px
    position: 'absolute',
    top: height * 0.53, // 452px de 852px
    width: width * 0.7, // 276px de 393px
    justifyContent: 'center',
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    fontFamily: 'Bricolage Grotesque',
  },
});
