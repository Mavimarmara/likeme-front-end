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
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#616161',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: FONT_SIZES.SM,
    color: '#424242',
    fontWeight: '500',
    marginBottom: 2,
  },
  overline: {
    fontSize: FONT_SIZES.XS,
    color: '#757575',
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 10,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  seeMoreButton: {
    borderWidth: 1,
    borderColor: '#1565C0',
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  seeMoreText: {
    fontSize: FONT_SIZES.SM,
    color: '#1565C0',
    fontWeight: '500',
  },
  commentsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentsCount: {
    fontSize: FONT_SIZES.SM,
    color: '#1565C0',
    fontWeight: '600',
  },
});

