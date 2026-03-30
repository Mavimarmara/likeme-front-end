import { StyleSheet, Dimensions } from 'react-native';
import { SPACING, FONT_SIZES } from '@/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - SPACING.MD * 2 - SPACING.SM;

export const styles = StyleSheet.create({
  container: {},
  scrollContent: {
    gap: SPACING.SM,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    height: 164,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 32,
    marginRight: 0,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
  },
  badge: {
    backgroundColor: 'rgba(0, 17, 55, 0.64)',
    paddingHorizontal: 14,
    minHeight: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 11,
    borderBottomRightRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XS,
    fontWeight: '500',
    color: '#F6DEA9',
    lineHeight: 22,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: SPACING.SM,
  },
  title: {
    flex: 1,
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XL,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  ctaIconButton: {
    alignSelf: 'flex-end',
  },
});
