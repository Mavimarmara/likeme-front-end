import { StyleSheet } from 'react-native';
import { FONT_SIZES, SPACING, COLORS, BORDER_RADIUS } from '@/constants';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: SPACING.MD,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.SM,
  },
  title: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.XL,
    fontWeight: '700',
    color: COLORS.TEXT,
    textAlign: 'left',
  },
  weekDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 17, 55, 0.8)',
    paddingLeft: SPACING.MD,
    borderRadius: 22,
    gap: SPACING.SM,
    position: 'absolute',
    right: 0,
    maxHeight: 36,
  },
  weekText: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '500',
    color: COLORS.SECONDARY.LIGHT,
  },
  periodIconContainer: {
    padding: 0,
  },
  periodIconBackground: {
    width: 42,
    height: 36,
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: '#001137',
  },
  avatarsContainer: {
    alignItems: 'center',
    opacity: 0.4,
    width: '100%',
  },
  avatarsContainerActive: {
    opacity: 1,
    borderRadius: BORDER_RADIUS.XL,
    paddingTop: SPACING.XL,
    paddingBottom: SPACING.LG,
  },
  avatarsContent: {
    alignItems: 'center',
    gap: SPACING.LG,
  },
  avatarItem: {
    alignItems: 'center',
    gap: SPACING.SM,
  },
  avatarLabel: {
    fontFamily: 'DM Sans',
    fontSize: FONT_SIZES.SM,
    fontWeight: '400',
    color: COLORS.TEXT,
    textAlign: 'center',
    width: 280,
    letterSpacing: 0.2,
  },
  mindAvatar: {},
  bodyAvatar: {},
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: SPACING.MD,
  },
});
