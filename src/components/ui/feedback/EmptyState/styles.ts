import { StyleSheet } from 'react-native';
import { SPACING, COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.MD,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT,
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT,
    textAlign: 'center',
    lineHeight: 24,
  },
});
