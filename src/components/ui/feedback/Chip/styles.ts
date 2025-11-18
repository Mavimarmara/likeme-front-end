import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: '#f4f3ec',
    borderColor: 'rgba(0, 17, 55, 1)',
    borderWidth: 1,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  chipSelected: {
    backgroundColor: 'rgba(0, 17, 55, 1)',
  },
  chipText: {
    color: 'rgba(0, 17, 55, 1)',
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'center',
  },
  chipTextSelected: {
    color: '#f4f3ec',
  },
});

