import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0, 17, 55, 1)',
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  buttonLight: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#FDFBEE',
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  buttonMedium: {
    minHeight: 36,
    borderRadius: 18,
  },
  buttonLarge: {
    minHeight: 48,
    borderRadius: 24,
  },
  label: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: 'center',
  },
  labelLight: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconLeft: {
    marginRight: 0,
  },
  iconRight: {
    marginLeft: 0,
  },
});


