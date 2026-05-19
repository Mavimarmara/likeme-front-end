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
    marginTop: SPACING.XS,
    marginBottom: SPACING.XS,
    paddingVertical: SPACING.XS,
  },
  containerWithReplies: {
    marginBottom: SPACING.SM,
    paddingBottom: SPACING.SM,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  avatarPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageColumn: {
    marginRight: SPACING.MD,
    paddingTop: 2,
  },
  contentColumn: {
    flex: 1,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  authorName: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6E6A6A',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  content: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6E6A6A',
    lineHeight: 20,
    letterSpacing: 0.2,
    marginBottom: SPACING.XS,
  },
  verMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#001137',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6E6A6A',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  likeBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  likeCount: {
    fontSize: 10,
    fontWeight: '400',
    color: '#0154f8',
    letterSpacing: 0.2,
    lineHeight: 14,
  },
  hideButton: {
    paddingVertical: 0,
  },
  hideText: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  repliesContainer: {
    marginTop: SPACING.XS,
    width: '100%',
  },
});
