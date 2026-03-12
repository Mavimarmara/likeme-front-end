import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ctaCardContainer: {
    paddingHorizontal: SPACING.MD,
  },
  ctaCard: {
    marginHorizontal: -SPACING.MD,
  },
  liveBannerContainer: {
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
    paddingHorizontal: SPACING.MD,
  },
  communityIntroContainer: {
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.XL,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.XL,
  },
  loadingFooter: {
    paddingVertical: SPACING.MD,
  },
});
