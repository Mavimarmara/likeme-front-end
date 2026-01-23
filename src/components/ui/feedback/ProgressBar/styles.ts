import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  label: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.TEXT,
    lineHeight: 16,
  },
  progressContainer: {
    width: '100%',
    position: 'relative',
  },
  progressBackground: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 16,
  },
});

