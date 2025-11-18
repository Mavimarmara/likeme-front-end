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
    backgroundColor: '#FFEB3B',
    borderRadius: BORDER_RADIUS.ROUND,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    marginBottom: SPACING.SM,
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
  title: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
    lineHeight: 24,
  },
  description: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 20,
    marginBottom: SPACING.MD,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  commentsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
  },
  commentsCount: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
    fontWeight: '600',
  },
});

