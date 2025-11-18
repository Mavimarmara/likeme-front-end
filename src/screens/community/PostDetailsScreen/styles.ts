import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  listContent: {
    paddingBottom: SPACING.XXL,
  },
  commentsHeader: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BACKGROUND,
  },
  commentsTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT,
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
    paddingHorizontal: SPACING.MD,
  },
  emptyText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
    textAlign: 'center',
  },
  seeAllButton: {
    marginHorizontal: SPACING.MD,
    marginVertical: SPACING.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderWidth: 1,
    borderColor: COLORS.TEXT,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  seeAllText: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
});

