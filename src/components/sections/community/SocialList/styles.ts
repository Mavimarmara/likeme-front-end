import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  programsContainer: {
    marginBottom: SPACING.MD,
    gap: SPACING.SM,
    paddingLeft: SPACING.MD,
  },
  liveBannerContainer: {
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
    paddingHorizontal: SPACING.MD,
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
