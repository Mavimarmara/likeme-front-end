import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventBannerContainer: {
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    width: '100%',
    alignSelf: 'stretch',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.MD,
    rowGap: SPACING.MD,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.XL,
  },
  recommendedSection: {
    marginTop: SPACING.XL,
  },
});
