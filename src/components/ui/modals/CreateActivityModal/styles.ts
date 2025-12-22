import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
    gap: SPACING.SM,
  },
  content: {
    width: '100%',
    gap: SPACING.MD,
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
    gap: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  typeButtonBase: {
    flex: 1,
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
  dateTimeButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: BORDER_RADIUS.FULL,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: '#F5F5F5',
    gap: SPACING.XS,
    marginBottom: SPACING.XS,
  },
  locationText: {
    fontSize: 14,
    color: '#001137',
    fontWeight: '500',
    flex: 1,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.SM,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    flex: 1,
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
});
