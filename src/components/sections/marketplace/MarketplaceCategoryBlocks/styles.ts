import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  section: {
    marginBottom: SPACING.XL,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: SPACING.MD,
    fontFamily: 'DM Sans',
  },
  productsList: {
    gap: SPACING.MD,
  },
  programScrollContent: {
    gap: SPACING.MD,
  },
});
