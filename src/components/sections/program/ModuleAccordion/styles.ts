import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.MD,
  },
  moduleItem: {
    paddingTop: SPACING.LG,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: SPACING.MD,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.SM,
    flex: 1,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.NEUTRAL.LOW.MEDIUM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: COLORS.PRIMARY.PURE,
    borderColor: COLORS.PRIMARY.PURE,
  },
  moduleTitle: {
    fontSize: 20,
    fontFamily: 'DM Sans',
    fontWeight: '700',
    color: COLORS.NEUTRAL.LOW.PURE,
    lineHeight: 24,
  },
  moduleBody: {
    paddingBottom: SPACING.MD,
    paddingLeft: 36,
  },
  moduleBodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.NEUTRAL.LOW.MEDIUM,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.NEUTRAL.LOW.LIGHT,
  },
});
