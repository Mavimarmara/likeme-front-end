import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  table: {
    backgroundColor: COLORS.TEXT,
    borderRadius: BORDER_RADIUS.LG,
    overflow: 'hidden',
    marginBottom: SPACING.XXL,
    marginHorizontal: SPACING.MD,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },

  featureCol: {
    width: '40%',
  },

  headerCell: {
    flex: 1,
    color: COLORS.WHITE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  featureCell: {
    width: '40%',
    color: COLORS.WHITE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
  },

  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cellText: {
    color: COLORS.WHITE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
  },
});
