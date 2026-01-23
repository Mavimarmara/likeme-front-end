import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

const COLORS = {
  TEXT_LIGHT: '#666666',
};

export const styles = StyleSheet.create({
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 0,
  },
  emptyContainer: {
    paddingVertical: SPACING.XL,
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_LIGHT,
  },
});
