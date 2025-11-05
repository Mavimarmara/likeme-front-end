import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f3ec',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    gap: 32,
  },
  actions: {
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
});

