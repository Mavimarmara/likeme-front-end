import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(253, 251, 238, 0.8)',
    borderRadius: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: SPACING.MD,
    height: 48,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: SPACING.SM,
    borderRadius: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  optionSelected: {
    backgroundColor: '#fbf7e5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6e6a6a',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#001137',
    fontWeight: '500',
  },
});
