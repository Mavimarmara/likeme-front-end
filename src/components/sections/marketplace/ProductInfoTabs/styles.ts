import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  infoTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: SPACING.LG,
  },
  infoTab: {
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  infoTabActive: {
    borderBottomColor: '#2196F3',
  },
  infoTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  infoTabTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
});
