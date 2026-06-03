import { MD3LightTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { COLORS, FONT_FAMILY } from '@/constants';

const fontConfig = {
  fontFamily: FONT_FAMILY.DM_SANS_REGULAR,
};

export const likemePaperTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 12,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.PRIMARY.PURE,
    onPrimary: COLORS.WHITE,
    secondary: COLORS.HIGHLIGHT.PURE,
    onSecondary: COLORS.TEXT,
    background: COLORS.BACKGROUND,
    surface: COLORS.NEUTRAL.HIGH.PURE,
    onSurface: COLORS.TEXT,
    onSurfaceVariant: COLORS.TEXT_LIGHT,
    outline: COLORS.NEUTRAL.LOW.LIGHT,
    error: COLORS.ERROR,
  },
  fonts: configureFonts({ config: fontConfig }),
};
