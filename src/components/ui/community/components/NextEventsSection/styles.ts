import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    paddingLeft: SPACING.MD,
    paddingRight: 0,
    paddingVertical: 0,
    marginTop: SPACING.MD,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: SPACING.MD,
    lineHeight: 18,
  },
  scrollView: {
    marginLeft: -SPACING.MD,
  },
  scrollContent: {
    paddingLeft: SPACING.MD,
    paddingRight: SPACING.MD,
    gap: SPACING.SM,
  },
});

