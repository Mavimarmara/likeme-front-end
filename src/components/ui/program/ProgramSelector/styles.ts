import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  scrollContent: {
    gap: SPACING.XS,
    paddingHorizontal: SPACING.MD,
  },
  button: {
    minHeight: 36,
    paddingHorizontal: SPACING.MD,
    paddingVertical: 9,
    borderRadius: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#0154f8',
  },
  buttonUnselected: {
    backgroundColor: '#fdfbee',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonTextSelected: {
    color: '#fbf7e5',
  },
  buttonTextUnselected: {
    color: '#001137',
  },
});

