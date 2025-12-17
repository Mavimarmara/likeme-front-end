import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#001137',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0154f8',
    borderColor: '#0154f8',
  },
  label: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: '#001137',
    flex: 1,
  },
});

