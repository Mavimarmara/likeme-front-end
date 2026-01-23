import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    gap: SPACING.SM,
  },
  scrollView: {
    marginHorizontal: -SPACING.MD,
  },
  scrollContent: {
    paddingHorizontal: SPACING.MD,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: SPACING.SM,
  },
  paginationDot: {
    borderRadius: 5,
    backgroundColor: '#B2B2B2',
  },
  paginationDotSmall: {
    width: 7,
    height: 6,
  },
  paginationDotLarge: {
    width: 10,
    height: 9,
  },
  paginationDotActive: {
    backgroundColor: '#0154f8',
  },
});
