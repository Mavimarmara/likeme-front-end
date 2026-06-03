import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { BricolageGrotesque_400Regular, BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque';

/** Mapa passado para `useFonts` no App — mantém DM Sans + Bricolage alinhados ao Figma. */
export const LIKEME_FONT_LOADER_MAP = {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_700Bold,
} as const;
