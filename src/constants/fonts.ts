/**
 * Nomes PostScript das fontes carregadas via @expo-google-fonts (useFonts em App.tsx).
 * Não use fontWeight com essas famílias — o peso já está no arquivo da fonte.
 */
export const FONT_FAMILY = {
  DM_SANS_REGULAR: 'DMSans_400Regular',
  DM_SANS_MEDIUM: 'DMSans_500Medium',
  DM_SANS_SEMIBOLD: 'DMSans_600SemiBold',
  DM_SANS_BOLD: 'DMSans_700Bold',
  BRICOLAGE_REGULAR: 'BricolageGrotesque_400Regular',
  BRICOLAGE_BOLD: 'BricolageGrotesque_700Bold',
} as const;

export type DmSansWeight = 400 | 500 | 600 | 700;

const DM_SANS_BY_WEIGHT: Record<DmSansWeight, (typeof FONT_FAMILY)[keyof typeof FONT_FAMILY]> = {
  400: FONT_FAMILY.DM_SANS_REGULAR,
  500: FONT_FAMILY.DM_SANS_MEDIUM,
  600: FONT_FAMILY.DM_SANS_SEMIBOLD,
  700: FONT_FAMILY.DM_SANS_BOLD,
};

export function dmSansFontFamily(weight: DmSansWeight): string {
  return DM_SANS_BY_WEIGHT[weight];
}
