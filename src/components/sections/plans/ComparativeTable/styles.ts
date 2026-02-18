import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '@/constants';

// Figma node 116635-14032: tabela comparativa #001137
const TABLE_BG = COLORS.NEUTRAL.LOW.PURE;
const HEADER_PADDING_V = 14;
const HEADER_PADDING_H = 16;
const ROW_PADDING_V = 12;
const ROW_PADDING_H = 16;
const ROW_MIN_HEIGHT = 44;
// Coluna de features menor para as células de valores (planos) ficarem maiores
const FEATURE_COL_WIDTH = '50%';

export const styles = StyleSheet.create({
  table: {
    backgroundColor: TABLE_BG,
    borderTopLeftRadius: 64,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    marginBottom: SPACING.XXL,
    marginHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: HEADER_PADDING_V,
    paddingHorizontal: HEADER_PADDING_H,
  },

  featureCol: {
    width: FEATURE_COL_WIDTH,
    minWidth: 0,
  },

  headerCell: {
    color: COLORS.WHITE,
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '700',
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: ROW_MIN_HEIGHT,
    paddingVertical: ROW_PADDING_V,
    paddingHorizontal: ROW_PADDING_H,
  },

  featureCell: {
    width: FEATURE_COL_WIDTH,
    minWidth: 0,
    color: COLORS.WHITE,
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    lineHeight: 20,
  },

  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },

  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButtonContainer: {
    padding: 0,
  },

  iconButtonBackground: {
    width: 20,
    height: 16,
  },

  cellText: {
    color: COLORS.WHITE,
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
  },
});
