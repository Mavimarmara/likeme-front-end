import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  solutionsTabsRow: {
    marginTop: SPACING.MD,
    width: '100%',
    alignSelf: 'stretch',
  },
  list: {
    gap: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  professionalCardWrapper: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: 0,
  },
  professionalCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.MD,
  },
  professionalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: SPACING.MD,
  },
  professionalAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.NEUTRAL.HIGH.PURE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.MD,
  },
  professionalInfo: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: 2,
  },
  professionalProfession: {
    fontSize: 13,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '400',
  },
  professionalViewProfileButton: {
    alignSelf: 'center',
  },
  professionalCardSeparator: {
    height: 1,
    backgroundColor: COLORS.NEUTRAL.LOW.MEDIUM,
  },
  emptySection: {
    paddingVertical: SPACING.XL,
    alignItems: 'center',
    gap: SPACING.LG,
  },
});
