import { Platform, StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

const PRICE_LINE_HEIGHT = 28;

const textVerticalAlign: { includeFontPadding?: boolean; textAlignVertical?: 'center' } =
  Platform.OS === 'android' ? { includeFontPadding: false, textAlignVertical: 'center' } : {};

export const styles = StyleSheet.create({
  heroPrice: {
    fontSize: 24,
    fontFamily: 'DM Sans',
    fontStyle: 'normal',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: PRICE_LINE_HEIGHT,
    marginTop: 0,
    paddingVertical: 0,
    ...textVerticalAlign,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: PRICE_LINE_HEIGHT,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  heroPriceSuffix: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: PRICE_LINE_HEIGHT,
    marginLeft: 8,
    paddingVertical: 0,
    ...textVerticalAlign,
  },
  heroFooter: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.MD,
  },
});
