import { StyleSheet } from 'react-native';
import { SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  cardContainer: {
    width: 194,
    height: 208,
    borderRadius: 22,
  },
  topSectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 26,
    height: 24,
  },
  avatarOverlap: {
    marginLeft: -16,
  },
  avatar: {
    width: 26,
    height: 24,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#fbf7e5',
  },
  avatarPlaceholder: {
    backgroundColor: '#d8e4d6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 12,
    fontWeight: '700',
    color: '#001137',
  },
  saveButton: {
    backgroundColor: '#fdfbee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: SPACING.MD,
    paddingVertical: 9,
    minHeight: 36,
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
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#001137',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fdfbee',
    lineHeight: 16,
    marginBottom: SPACING.XS,
  },
  dateBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 0,
    minHeight: 24,
    borderRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#d8e4d6',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
});

