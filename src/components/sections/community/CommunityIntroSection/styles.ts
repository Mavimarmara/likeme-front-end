import { StyleSheet } from 'react-native';
import { SPACING, COLORS, FONT_SIZES } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.LG,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.SM,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: SPACING.MD,
    backgroundColor: COLORS.NEUTRAL.HIGH.PURE,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: COLORS.TEXT,
    lineHeight: 26,
  },
  description: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 20,
    marginBottom: SPACING.XS,
  },
  seeMoreTouchable: {
    alignSelf: 'flex-start',
  },
  seeMoreText: {
    fontSize: FONT_SIZES.SM,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
});
