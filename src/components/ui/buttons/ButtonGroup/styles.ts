import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  vertical: {
    flexDirection: 'column',
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'stretch',
  },
  horizontal: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-start',
  },
});
