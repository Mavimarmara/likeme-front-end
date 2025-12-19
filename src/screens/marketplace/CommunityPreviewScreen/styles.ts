import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  headerSection: {
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
  screenTitle: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: SPACING.XS,
  },
  screenSubtitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
  },
  scrollContent: {
    paddingBottom: SPACING.XL,
    gap: SPACING.MD,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.XL,
  },
  emptyText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
});
