import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.XXL,
  },

  title: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.LG,
  },

  betaCard: {
    backgroundColor: COLORS.SECONDARY.PURE,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },

  betaTitle: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.SM,
  },

  betaText: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: SPACING.SM,
  },

  tabsRow: {
    marginBottom: SPACING.LG,
  },

  planCard: {
    backgroundColor: COLORS.PRIMARY.LIGHT,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    marginBottom: SPACING.LG,
  },

  planTitle: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },

  planSlogan: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: SPACING.SM,
  },

  planDescription: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: SPACING.MD,
  },

  planPrice: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },

  planPriceAnnual: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: SPACING.LG,
  },

  startButton: {
    width: '100%',
  },

  includesSection: {
    marginBottom: SPACING.XL,
  },

  includesTitle: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.SM,
  },

  includeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.SM,
  },

  bullet: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 14,
    marginRight: SPACING.SM,
  },

  includeText: {
    flex: 1,
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
  },

  compareTable: {
    backgroundColor: COLORS.TEXT,
    borderRadius: BORDER_RADIUS.LG,
    overflow: 'hidden',
    marginBottom: SPACING.XXL,
  },

  compareHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },

  compareFeatureCol: {
    width: '40%',
  },

  compareHeaderCell: {
    flex: 1,
    color: COLORS.WHITE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },

  compareFeatureCell: {
    width: '40%',
    color: COLORS.WHITE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
  },

  compareCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  compareCellText: {
    color: COLORS.WHITE,
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '400',
  },
});
