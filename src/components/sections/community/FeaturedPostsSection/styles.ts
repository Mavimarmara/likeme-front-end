import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  section: {
    marginTop: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    width: '100%',
    gap: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: '#001137',
  },
});
