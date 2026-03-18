import { COLORS, SPACING } from '@/constants';
import { StyleSheet } from 'react-native';

const ACCENT_BLUE = '#0154F8';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 12,
    paddingVertical: SPACING.SM,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 48,
    minWidth: 48,
  },
  pillSelected: {
    gap: 4,
    paddingHorizontal: 16,
    backgroundColor: COLORS.SECONDARY.PURE,
    borderRadius: 48,
  },
  pillLabel: {
    fontFamily: 'DM Sans',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    color: ACCENT_BLUE,
  },
  homeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  menuIconImage: {
    width: 32,
    height: 32,
  },

  shopIconWrap: {
    width: 32,
    height: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  shopIconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  shopIconOverlay: {
    // Pequeno ajuste para o overlay ficar visível sem cobrir tudo.
    opacity: 1,
  },

  communityIconWrap: {
    width: 32,
    height: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  communityIconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  communityWordmarkLayer: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    width: '100%',
    height: '100%',
  },
});
