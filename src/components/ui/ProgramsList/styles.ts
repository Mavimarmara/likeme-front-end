import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.MD,
    paddingBottom: SPACING.XL,
  },
  programCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  programCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  programContent: {
    gap: SPACING.XS,
  },
  programName: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  programDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 20,
  },
  programInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.XS,
  },
  programDuration: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    fontWeight: '500',
  },
  programParticipants: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
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

