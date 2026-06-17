import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';
import { TYPOGRAPHY } from '@/constants/typography';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    gap: SPACING.SM,
  },
  title: {
    ...TYPOGRAPHY.title3,
    color: '#000000',
  },
  card: {
    width: '100%',
  },
});
