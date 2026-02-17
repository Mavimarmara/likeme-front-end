import { StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.XS,
    backgroundColor: 'rgba(240, 238, 225, 0.16)',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.XS,
  },
  buttonActive: {
    borderColor: COLORS.PRIMARY.PURE,
  },
  buttonTextActive: {
    color: COLORS.PRIMARY.PURE,
  },
});
