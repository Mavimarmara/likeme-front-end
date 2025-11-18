import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
  },
  replyContainer: {
    marginLeft: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: SPACING.SM,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SM,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  timeAgo: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    marginTop: 2,
  },
  content: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    lineHeight: 20,
    marginBottom: SPACING.SM,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
  },
  actionCount: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    fontWeight: '600',
  },
  replyCount: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    marginLeft: 2,
  },
  hideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
    marginLeft: 'auto',
  },
  hideText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
  },
  repliesContainer: {
    marginTop: SPACING.MD,
    paddingLeft: SPACING.SM,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.BACKGROUND,
  },
});

