import type { TextStyle } from 'react-native';
import { FONT_FAMILY } from '@/constants/fonts';

/** Escalas de texto alinhadas aos frames Figma (DM Sans + Bricolage). */
export const TYPOGRAPHY = {
  displayLg: {
    fontFamily: FONT_FAMILY.BRICOLAGE_BOLD,
    fontSize: 40,
    lineHeight: 44,
  },
  displayMd: {
    fontFamily: FONT_FAMILY.BRICOLAGE_BOLD,
    fontSize: 32,
    lineHeight: 32,
  },
  displaySm: {
    fontFamily: FONT_FAMILY.BRICOLAGE_BOLD,
    fontSize: 24,
    lineHeight: 24,
  },
  titleScreen: {
    fontFamily: FONT_FAMILY.BRICOLAGE_BOLD,
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: -2,
  },
  titleScreenScaled: {
    fontFamily: FONT_FAMILY.BRICOLAGE_BOLD,
    fontSize: 48,
    lineHeight: 48,
    letterSpacing: -2,
    transform: [{ scaleX: 0.92 }],
  },
  bodyLg: {
    fontFamily: FONT_FAMILY.DM_SANS_REGULAR,
    fontSize: 20,
    lineHeight: 25,
  },
  bodyLgSemibold: {
    fontFamily: FONT_FAMILY.DM_SANS_SEMIBOLD,
    fontSize: 20,
    lineHeight: 25,
  },
  bodyMd: {
    fontFamily: FONT_FAMILY.DM_SANS_REGULAR,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  bodyMdMedium: {
    fontFamily: FONT_FAMILY.DM_SANS_MEDIUM,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  bodySm: {
    fontFamily: FONT_FAMILY.DM_SANS_MEDIUM,
    fontSize: 12,
    lineHeight: 20,
  },
  bodySmRegular: {
    fontFamily: FONT_FAMILY.DM_SANS_REGULAR,
    fontSize: 12,
    lineHeight: 20,
  },
  labelMd: {
    fontFamily: FONT_FAMILY.DM_SANS_MEDIUM,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  labelLg: {
    fontFamily: FONT_FAMILY.DM_SANS_MEDIUM,
    fontSize: 20,
    lineHeight: 24,
  },
  heroTitle: {
    fontFamily: FONT_FAMILY.DM_SANS_MEDIUM,
    fontSize: 20,
    lineHeight: 24,
  },
  heroPrice: {
    fontFamily: FONT_FAMILY.DM_SANS_REGULAR,
    fontSize: 24,
    lineHeight: 24,
  },
  badge: {
    fontFamily: FONT_FAMILY.DM_SANS_MEDIUM,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  /** Figma Title 3 — ex.: “Destaque da semana”. */
  title3: {
    fontFamily: FONT_FAMILY.DM_SANS_BOLD,
    fontSize: 20,
  },
  /** Figma Section Name — rótulo de bloco (Produtos, Serviços, …). */
  sectionName: {
    fontFamily: FONT_FAMILY.DM_SANS_MEDIUM,
    fontSize: 14,
  },
} as const satisfies Record<string, TextStyle>;
