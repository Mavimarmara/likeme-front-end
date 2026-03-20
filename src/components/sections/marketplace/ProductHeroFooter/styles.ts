import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  heroPrice: {
    fontSize: 24,
    fontFamily: 'DM Sans',
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 24,
    marginTop: 0,
  },
  heroFooter: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.MD,
  },
});
