import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  eventsContainer: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
  },
  productsContainer: {
    paddingTop: SPACING.LG,
  },
});

