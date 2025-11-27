import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

const SOFT_BEIGE = '#FBF7E5';
const DARK_BLUE = '#001137';
const ACCENT_BLUE = '#0154F8';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SPACING.XL,
    right: SPACING.MD,
    zIndex: 1000,
  },
  menuWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.MD,
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SOFT_BEIGE,
    borderRadius: 28,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    gap: SPACING.SM,
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    width: 56,
    height: 56,
  },
  selectedLabel: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    color: ACCENT_BLUE,
  },
  actionsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SOFT_BEIGE,
    borderRadius: 28,
    paddingHorizontal: SPACING.MD,
    paddingVertical: 6,
    gap: SPACING.SM,
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0000000A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 2,
  },
});

