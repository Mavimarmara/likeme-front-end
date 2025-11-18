import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  liveBannerContainer: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
});
