import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants';

export const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING.XL,
  },
  sectionMarketplace: {
    paddingHorizontal: SPACING.MD,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: SPACING.MD,
  },
  sectionName: {
    ...TYPOGRAPHY.sectionName,
    color: COLORS.TEXT,
    marginBottom: SPACING.MD,
  },
  shopChrome: {
    gap: SPACING.MD,
  },
  shopRecommendedByLabel: {
    ...TYPOGRAPHY.sectionName,
    color: COLORS.TEXT,
    lineHeight: 18,
  },
  shopOrderFilterRow: {
    marginBottom: 0,
    gap: SPACING.MD,
  },
  shopOrderCarouselContent: {
    gap: SPACING.XS,
  },
  loadingContainer: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XXL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.MD,
    fontSize: 16,
    color: '#666666',
  },
  loadingMoreContainer: {
    padding: SPACING.MD,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: SPACING.XL,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
  loadMoreButton: {
    padding: SPACING.MD,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginTop: SPACING.MD,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  mOrderFilterMenuContainer: {
    marginBottom: SPACING.MD,
  },
  mAdsList: {
    gap: SPACING.MD,
    paddingBottom: SPACING.MD,
  },
  shopAdsList: {
    gap: SPACING.LG,
    paddingBottom: 0,
  },
  solutionTabsRow: {
    marginTop: 0,
    width: '100%',
    alignSelf: 'stretch',
  },
  emptySection: {
    marginTop: SPACING.MD,
  },
});
