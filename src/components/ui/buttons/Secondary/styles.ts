import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'rgba(239, 237, 225, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0, 17, 55, 1)',
    borderRadius: 18,
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  buttonSmall: {
    minHeight: 36,
  },
  buttonMedium: {
    minHeight: 48,
  },
  buttonDark: {
    backgroundColor: '#FDFBEE',
    borderColor: '#FDFBEE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: 'center',
  },
  labelDark: {
    color: '#6E6A6A',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});


