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
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 0,
  },
  avatarPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
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
  },
  metaColumn: {
    width: 110,
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
  },
  metaTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.XS,
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
    paddingLeft: 0,
  },
  verMore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#001137',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6E6A6A',
    letterSpacing: 0.2,
    lineHeight: 20,
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
