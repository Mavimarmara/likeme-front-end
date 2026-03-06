import { StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES } from '@/constants';
import { COLORS } from '@/constants';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.MD,
  },
  modalContainer: {
    backgroundColor: 'rgba(251, 247, 229, 0.96)',
    borderRadius: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    width: '100%',
    maxWidth: 340,
    maxHeight: '85%',
    paddingTop: SPACING.SM,
    paddingBottom: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: FONT_SIZES.SM,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.NEUTRAL.LOW.PURE,
    letterSpacing: 0.2,
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.MD,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.NEUTRAL.LOW.PURE,
    marginBottom: SPACING.MD,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XS,
    marginBottom: SPACING.MD,
  },
  chipWidth: {
    width: '48%',
  },
  categoryIconSmall: {
    transform: [{ scale: 0.85 }],
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.NEUTRAL.LOW.LIGHT,
    marginVertical: SPACING.MD,
  },
  solutionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.XS,
    marginBottom: SPACING.MD,
  },
  footerButtons: {
    gap: SPACING.SM,
  },
});
