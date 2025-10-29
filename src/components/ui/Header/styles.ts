import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: SPACING.MD,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
