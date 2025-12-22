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
  descriptionInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: SPACING.XS,
    fontSize: 16,
    color: '#001137',
    minHeight: 60,
    textAlignVertical: 'top',
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6DEA9B8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F6DEA9B8',
    paddingHorizontal: SPACING.MD,
    paddingVertical: 9,
    gap: SPACING.XS,
  },
  locationIcon: {
    marginRight: SPACING.XS,
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    color: '#6E6A6A',
    fontWeight: '500',
    padding: 0,
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
  dateTimeFieldContainer: {
    position: 'relative',
    flex: 1,
  },
  pickerContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: SPACING.XS,
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  picker: {
    width: '100%',
  },
});
