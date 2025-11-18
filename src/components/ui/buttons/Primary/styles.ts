import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0, 17, 55, 1)',
    borderRadius: 18,
    display: 'flex',
    gap: 2,
    height: 48,
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
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
  buttonDisabled: {
    opacity: 0.6,
  },
});


