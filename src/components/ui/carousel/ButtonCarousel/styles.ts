import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: SPACING.SM,
    paddingHorizontal: SPACING.SM,
  },
  buttonSelected: {
    backgroundColor: '#0154f8',
  },
  buttonUnselected: {
    backgroundColor: '#FDFBEE',
  },
  buttonSelectedText: {
    color: '#FFFFFF',
  },
});
