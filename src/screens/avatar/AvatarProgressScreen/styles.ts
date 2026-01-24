import { StyleSheet } from 'react-native';
import { FONT_SIZES, SPACING, COLORS, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
  },
  topSection: {
    backgroundColor: COLORS.SECONDARY.PURE,
    paddingHorizontal: SPACING.XL,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.LG,
    borderBottomLeftRadius: 64,
    borderBottomRightRadius: 64,
    marginBottom: SPACING.LG,
  },
  headerContainer: {
    alignItems: 'center',
    gap: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  title: {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 23,
    fontWeight: '400',
    color: COLORS.TEXT,
    textAlign: 'center',
    letterSpacing: -1.38,
  },
  markersListContainer: {
    gap: SPACING.SM,
    marginBottom: SPACING.LG,
  },
  markerItem: {
    gap: SPACING.SM,
    paddingVertical: SPACING.SM,
  },
  markerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  markerName: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    color: COLORS.TEXT,
    letterSpacing: 0.2,
  },
  markerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
  },
  markerProgressContainer: {
    flex: 1,
  },
  markerTrend: {
    width: 34,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonContainer: {
    alignItems: 'flex-end',
  },
  biomarkersSection: {
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.XL,
  },
  biomarkersTitle: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
    color: COLORS.TEXT,
    marginBottom: SPACING.MD,
    paddingLeft: SPACING.MD,
  },
  biomarkerCard: {
    backgroundColor: COLORS.SECONDARY.PURE,
    paddingTop: SPACING.XXL,
    paddingBottom: SPACING.LG,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.XL,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    gap: SPACING.LG,
  },
  biomarkerCardTitle: {
    fontFamily: 'Bricolage Grotesque',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.TEXT,
    textTransform: 'uppercase',
  },
  biomarkerCardMessage: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XL,
    fontWeight: '400',
    color: COLORS.TEXT,
  },
  biomarkerCardDescription: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    color: COLORS.TEXT,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  biomarkerProgressContainer: {
    marginTop: SPACING.MD,
  },
  productsSection: {
    marginBottom: SPACING.XL,
  },
  addWidgetsContainer: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XL,
    alignItems: 'center',
    alignSelf: 'center',
  },
  addWidgetsButton: {
    alignSelf: 'center',
  },
});
