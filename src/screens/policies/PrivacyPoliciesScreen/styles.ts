import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.LG,
  },
  title: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XXL,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: SPACING.MD,
  },
  intro: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.MD,
    fontWeight: '400',
    color: COLORS.TEXT_LIGHT,
    lineHeight: 22,
    marginBottom: SPACING.SM,
  },
  inControl: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.MD,
    fontWeight: '700',
    color: COLORS.TEXT,
    marginBottom: SPACING.LG,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.NEUTRAL.HIGH.PURE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.XS,
    marginBottom: SPACING.LG,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.WHITE,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
    color: COLORS.TEXT_LIGHT,
  },
  tabTextActive: {
    color: COLORS.TEXT,
    fontWeight: '600',
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.NEUTRAL.LOW.LIGHT,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.MD,
    paddingRight: SPACING.SM,
  },
  accordionTitle: {
    flex: 1,
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.MD,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  accordionContent: {
    paddingBottom: SPACING.MD,
    paddingRight: SPACING.LG,
  },
  accordionBody: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    color: COLORS.TEXT_LIGHT,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  disclaimer: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XS,
    fontStyle: 'italic',
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.MD,
    textAlign: 'center',
  },
});
