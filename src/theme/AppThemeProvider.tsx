import React, { type ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';
import { likemePaperTheme } from '@/theme/likemePaperTheme';

type Props = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: Props) {
  return <PaperProvider theme={likemePaperTheme}>{children}</PaperProvider>;
}
