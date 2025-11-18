import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.MD,
    paddingBottom: SPACING.XL,
    paddingTop: 0,
  },
  communityCard: {
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
  communityCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  communityContent: {
    gap: SPACING.XS,
  },
  communityName: {
    fontSize: FONT_SIZES.LG,
    fontWeight: '600',
    color: COLORS.TEXT,
  },
  communityDescription: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_LIGHT,
    lineHeight: 20,
  },
  communityMembers: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_LIGHT,
    marginTop: SPACING.XS,
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
  liveBannerContainer: {
    marginTop: SPACING.MD,
    marginBottom: SPACING.SM,
  },
});

