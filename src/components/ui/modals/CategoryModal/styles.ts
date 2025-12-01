import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: SPACING.XL,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.LG,
    paddingBottom: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: COLORS.TEXT,
  },
  closeButton: {
    padding: SPACING.XS,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.LG,
    paddingTop: SPACING.MD,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.SM,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  categoryItemSelected: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  categoryName: {
    fontSize: FONT_SIZES.MD,
    fontWeight: '400',
    color: COLORS.TEXT,
    flex: 1,
  },
  categoryNameSelected: {
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  emptyContainer: {
    paddingVertical: SPACING.XL,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_LIGHT,
  },
});

