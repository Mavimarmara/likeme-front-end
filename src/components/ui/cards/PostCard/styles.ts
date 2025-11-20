import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  overline: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
    lineHeight: 23,
  },
  description: {
    fontSize: 13,
    color: '#424242',
    lineHeight: 19,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  seeMoreButton: {
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  seeMoreText: {
    fontSize: 13,
    color: '#1565C0',
    fontWeight: '500',
  },
  commentsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentsCount: {
    fontSize: 13,
    color: '#1565C0',
    fontWeight: '600',
  },
});

