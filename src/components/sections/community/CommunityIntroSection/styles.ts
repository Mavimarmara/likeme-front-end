import { StyleSheet } from 'react-native';
import { SPACING, COLORS, FONT_SIZES, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  avatarWrapper: {
    marginRight: SPACING.MD,
  },
  avatar: {
    borderRadius: BORDER_RADIUS.XL,
    overflow: 'hidden',
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: COLORS.TEXT,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 4,
  },
  description: {
    flex: 1,
    minWidth: 0,
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 20,
  },
  seeMoreTouchable: {
    flexShrink: 0,
  },
  seeMoreText: {
    fontSize: FONT_SIZES.XS,
    fontWeight: '500',
    color: COLORS.TEXT,
    lineHeight: 20,
  },
});
