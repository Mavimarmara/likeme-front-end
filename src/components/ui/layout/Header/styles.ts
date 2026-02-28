import { StyleSheet } from 'react-native';
import { SPACING, COLORS } from '@/constants';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    position: 'relative',
  },
  menuWithAvatarPill: {
    position: 'absolute',
    left: SPACING.MD,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.SECONDARY.PURE,
    borderRadius: 24,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 6,
    zIndex: 1,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  menuIcon: {
    marginRight: 8,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.NEUTRAL.LOW.LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    position: 'absolute',
    left: SPACING.MD,
    zIndex: 1,
  },
  rightButton: {
    position: 'absolute',
    right: SPACING.MD,
    zIndex: 1,
  },
  rightLabelButton: {
    position: 'absolute',
    right: SPACING.MD,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.XS,
    zIndex: 1,
  },
  rightLabelText: {
    color: COLORS.NEUTRAL.LOW.PURE,
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: '600',
  },
});
