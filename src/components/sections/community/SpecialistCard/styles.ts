import { StyleSheet } from 'react-native';
import { SPACING, COLORS, FONT_SIZES, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SPACING.XS,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.NEUTRAL.HIGH.PURE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.XS,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    marginBottom: 2,
  },
  name: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    color: COLORS.TEXT,
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  subtitle: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    paddingVertical: SPACING.SM,
    fontWeight: '500',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XS,
  },
  tag: {
    backgroundColor: COLORS.NEUTRAL.LOW.PURE,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.MD,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});
