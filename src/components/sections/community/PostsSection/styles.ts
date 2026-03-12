import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  header: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  title: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT,
  },
  listContent: {
    paddingBottom: SPACING.XL,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XXL,
  },
  loadingFooter: {
    paddingVertical: SPACING.MD,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XXL,
  },
  emptyText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
});
