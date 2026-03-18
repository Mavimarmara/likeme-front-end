import { StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES, COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  content: {
    flex: 1,
    zIndex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
  },
  searchAndFilters: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  sectionTitle: {
    paddingHorizontal: SPACING.MD,
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
    color: COLORS.NEUTRAL.LOW.PURE,
    marginBottom: SPACING.MD,
  },
  avatarContainer: {
    paddingTop: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  anamnesisPromptContainer: {
    paddingTop: SPACING.MD,
  },
  yourCommunitiesContainer: {
    paddingTop: SPACING.MD,
  },
  eventsContainer: {
    padding: SPACING.MD,
  },
  productsContainer: {
    paddingTop: SPACING.LG,
  },
  otherCommunitiesContainer: {
    paddingTop: SPACING.LG,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.MD,
  },
  sectionRetreatedContainer: {
    marginHorizontal: -SPACING.MD,
  },
  sectionDivider: {
    paddingBottom: SPACING.MD,
  },
  emptyStateContainer: {
    justifyContent: 'center',
  },
});
