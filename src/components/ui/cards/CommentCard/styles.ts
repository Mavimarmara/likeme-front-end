import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  replyContainer: {
    marginLeft: SPACING.LG,
    marginTop: SPACING.SM,
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
  authorName: {
    fontSize: 11,
    fontWeight: '400',
    color: '#9E9E9E',
    letterSpacing: 0.1,
  },
  content: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'normal',
    color: '#6E6A6A',
    lineHeight: 19,
    letterSpacing: 0.1,
    marginBottom: SPACING.XS,
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

