import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    gap: SPACING.MD,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 39,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.NEUTRAL.LOW.LIGHT,
  },
  info: {
    flex: 1,
    marginLeft: 6,
  },
  name: {
    fontSize: 14,
    fontFamily: 'DM Sans',
    fontWeight: '400',
    color: COLORS.NEUTRAL.LOW.PURE,
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  role: {
    fontSize: 12,
    fontFamily: 'DM Sans',
    fontWeight: '500',
    color: COLORS.NEUTRAL.LOW.DARK,
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  profileButton: {
    width: '100%',
    borderColor: COLORS.NEUTRAL.LOW.PURE,
  },
});
