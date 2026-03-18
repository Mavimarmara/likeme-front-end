import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  replyContainer: {
    marginLeft: SPACING.LG,
    marginTop: SPACING.SM,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: SPACING.XS,
  },
  avatarPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.XS,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6E6A6A',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  content: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6E6A6A',
    lineHeight: 20,
    letterSpacing: 0.2,
    marginBottom: SPACING.SM,
  },
  verMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#001137',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.SM,
    marginTop: SPACING.XS,
  },
  footerLeft: {
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6E6A6A',
    letterSpacing: 0.2,
    lineHeight: 20,
    marginBottom: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#001137',
    letterSpacing: 0.2,
  },
  actionTextSelected: {
    color: '#0154f8',
  },
  likeBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  likeCount: {
    fontSize: 10,
    fontWeight: '400',
    color: '#0154f8',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  hideButton: {
    marginTop: SPACING.XS,
  },
  hideText: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  repliesContainer: {
    marginTop: SPACING.SM,
  },
});
