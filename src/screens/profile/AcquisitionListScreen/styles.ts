import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.XXL,
    gap: SPACING.MD,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'DM Sans',
    color: COLORS.TEXT,
    marginTop: SPACING.SM,
  },
  searchWrap: {
    marginBottom: SPACING.XS,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'DM Sans',
    color: COLORS.TEXT,
    marginTop: SPACING.SM,
  },
  horizontalList: {
    gap: SPACING.MD,
    paddingVertical: SPACING.XS,
  },
  emptySection: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    color: COLORS.TEXT_LIGHT,
    marginBottom: SPACING.SM,
  },
  centered: {
    paddingVertical: SPACING.XXL,
    alignItems: 'center',
  },
});
