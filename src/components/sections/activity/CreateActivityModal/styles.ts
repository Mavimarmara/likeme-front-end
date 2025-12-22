import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.XS,
    gap: SPACING.SM,
  },
  content: {
    width: '100%',
    gap: SPACING.XS,
    padding: SPACING.MD,
  },
  inputContainer: {
    marginBottom: SPACING.XS,
  },
  nameInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: SPACING.XS,
    fontSize: 16,
    color: '#001137',
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: SPACING.SM,
    marginBottom: SPACING.XS,
    alignSelf: 'flex-start',
  },
  typeButtonBase: {
    flexShrink: 0,
  },
  typeButtonSelected: {
    borderColor: '#0154f8',
    backgroundColor: 'rgba(1, 84, 248, 0.1)',
  },
  typeButtonTextSelected: {
    color: '#0154f8',
    fontWeight: '600',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  locationButton: {
    backgroundColor: '#F6DEA9B8',
    borderColor: '#F6DEA9B8',
  },
  reminderContainer: {
    flexDirection: 'column',
    paddingVertical: SPACING.SM,
    gap: SPACING.SM,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  reminderText: {
    fontSize: 14,
    color: '#001137',
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  switchLabel: {
    fontSize: 14,
    color: '#001137',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: SPACING.XS,
  },
});
