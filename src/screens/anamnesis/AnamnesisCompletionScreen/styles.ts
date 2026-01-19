import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F3EC',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: 'Urbanist-ExtraBold',
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 57.6,
    textAlign: 'center',
    color: '#001137',
    letterSpacing: 0.5,
  },
});

