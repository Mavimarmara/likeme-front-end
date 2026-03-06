import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#001137',
    backgroundColor: '#fdfbee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#0154f8',
    backgroundColor: '#fdfbee',
  },
  label: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: '#6e6a6a',
    flex: 1,
  },
});
