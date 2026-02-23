import { StyleSheet, Dimensions } from 'react-native';
import { SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - SPACING.MD * 2 - SPACING.SM;

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.MD,
  },
  scrollContent: {
    paddingHorizontal: SPACING.MD,
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
  seeMoreButton: {
    width: 54,
    height: 48,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    borderRadius: BORDER_RADIUS.MD,
  },
});
