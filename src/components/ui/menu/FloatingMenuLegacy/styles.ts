import { StyleSheet } from 'react-native';
import { SPACING } from '@/constants';

const SOFT_BEIGE = '#FBF7E5';
const ACCENT_BLUE = '#0154F8';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SPACING.XL,
    zIndex: 1000,
    width: '100%',
    backgroundColor: 'transparent',
  },
  menuWrapper: {
    flexDirection: 'row',
    gap: SPACING.SM,
    width: '100%',
    backgroundColor: 'transparent',
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedPillWithLabel: {
    gap: -SPACING.SM,
    backgroundColor: SOFT_BEIGE,
  },
  menuHomeButtonContainer: {
    padding: 0,
    margin: 0,
    gap: 0,
  },
  selectedPillLabel: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    color: ACCENT_BLUE,
  },
  selectedPillLabelTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SOFT_BEIGE,
    borderRadius: 28,
    padding: SPACING.MD,
    shadowColor: '#0000000A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIcon: {
    width: 62,
    height: 56,
  },
  menuHomeIconImage: {
    width: 16,
    height: 16,
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
    gap: SPACING.SM,
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
    height: 50,
  },
  iconButton: {
    minWidth: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonSelected: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.SM,
    gap: SPACING.XS,
    shadowColor: '#0000000A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 2,
  },
});
