import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XL,
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
  },
  solutionTabsRow: {
    marginTop: SPACING.MD,
    width: '100%',
    alignSelf: 'stretch',
  },
  emptySection: {
    marginTop: SPACING.MD,
  },
});
