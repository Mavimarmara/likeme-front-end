import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  programsContainer: {
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
