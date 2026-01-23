import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BACKGROUND,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFEB3B',
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    marginBottom: SPACING.MD,
    shadowColor: '#FFEB3B',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryText: {
    fontSize: FONT_SIZES.XS,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.SM,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SM,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  timeAgo: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.SM,
    lineHeight: 28,
  },
  description: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT,
    lineHeight: 22,
    marginBottom: SPACING.MD,
  },
  commentsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
    paddingTop: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.BACKGROUND,
  },
  commentsCount: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    fontWeight: '600',
  },
});
