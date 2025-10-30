import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f3ec',
    height: 852,
    minWidth: 393,
    position: 'relative',
    width: '100%',
  },
  
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
  },

  buttonContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    left: 16,
    right: 16,
    position: 'absolute',
    bottom: 70,
    paddingBottom: 40,
  },

  nextButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0, 17, 55, 1)',
    borderRadius: 18,
    boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    gap: 2,
    height: 48,
    justifyContent: 'center',
    padding: 9,
    paddingHorizontal: 16,
    position: 'relative',
    width: '100%',
  },
  nextButtonLabel: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
    position: 'relative',
    textAlign: 'center',
  },

  loginButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(239, 237, 225, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0, 17, 55, 1)',
    borderRadius: 18,
    boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    gap: 2,
    height: 50,
    justifyContent: 'center',
    marginBottom: -1,
    marginLeft: -1,
    marginRight: -1,
    padding: 9,
    paddingHorizontal: 16,
    position: 'relative',
    width: '100%',
  },
  loginButtonLabel: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
    position: 'relative',
    textAlign: 'center',
  },

  logoContainer: {
    position: 'absolute',
    top: '42%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  taglineContainer: {
    height: 48,
    left: '50%',
    position: 'absolute',
    top: '46%',
    width: 276,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -138 }],
  },
  taglineText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(30, 58, 138, 1)',
    textAlign: 'center',
  },
});