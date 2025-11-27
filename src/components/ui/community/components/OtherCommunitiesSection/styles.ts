import { StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES, BORDER_RADIUS, COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    gap: SPACING.MD,
  },
  title: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
  },
  filterButton: {
    width: 40,
    height: 36,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  filterButtonBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonImage: {
    borderRadius: BORDER_RADIUS.MD,
  },
  communitiesList: {
    flex: 1,
  },
  communitiesListContent: {
    gap: SPACING.SM,
    paddingBottom: SPACING.MD,
  },
  card: {
    backgroundColor: COLORS.BACKGROUND_SECONDARY || '#FBF7E5',
    borderRadius: 22,
    flexDirection: 'row',
    gap: SPACING.SM,
    paddingRight: SPACING.MD,
    overflow: 'hidden',
  },
  cardImage: {
    width: 108,
    height: 122,
    borderRadius: 22,
  },
  cardContent: {
    flex: 1,
    paddingVertical: SPACING.SM,
    gap: 10,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: 'rgba(0, 17, 55, 0.64)',
    paddingHorizontal: 14,
    paddingVertical: 0,
    minHeight: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XS,
    fontWeight: '500',
    color: '#D8E4D6',
    lineHeight: 22,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    color: '#001137',
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: SPACING.SM,
  },
  cardTextContainer: {
    flex: 1,
    gap: SPACING.MD,
  },
  cardTitle: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    color: '#001137',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  cardPrice: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    color: '#001137',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  actionButton: {
    width: 53,
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

