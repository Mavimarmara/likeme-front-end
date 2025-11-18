import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 17, 55, 1)',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  label: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

