import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.XXL,
  },

  title: {
    color: COLORS.TEXT,
    fontFamily: 'DM Sans',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.LG,
    paddingHorizontal: SPACING.MD,
  },

  tabsRow: {
    marginBottom: SPACING.LG,
    paddingHorizontal: SPACING.MD,
  },

  planCardWrapper: {
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.LG,
  },
});
