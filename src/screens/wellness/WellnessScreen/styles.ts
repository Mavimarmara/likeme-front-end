import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.PRIMARY,
  },
  title: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.WHITE,
    opacity: 0.9,
  },
  content: {
    padding: SPACING.MD,
  },
  metricCard: {
    marginBottom: SPACING.MD,
  },
  metricText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT,
    marginBottom: SPACING.SM,
  },
  activityCard: {
    marginBottom: SPACING.MD,
  },
  activityText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT,
    marginBottom: SPACING.SM,
  },
  goalCard: {
    marginBottom: SPACING.MD,
  },
  goalText: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT,
    marginBottom: SPACING.SM,
  },
});
