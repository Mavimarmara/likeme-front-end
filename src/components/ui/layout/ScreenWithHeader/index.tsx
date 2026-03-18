import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/ui/layout';
import { COLORS } from '@/constants';

type HeaderProps = React.ComponentProps<typeof Header>;

type Props = React.PropsWithChildren<{
  headerProps?: HeaderProps;
  /** Fundo do conteúdo (abaixo do header). */
  contentBackgroundColor?: string;
  /** Estilo opcional extra para o container do conteúdo. */
  contentContainerStyle?: ViewStyle | ViewStyle[];
}>;

const ScreenWithHeader: React.FC<Props> = ({
  headerProps,
  contentBackgroundColor = COLORS.BACKGROUND,
  contentContainerStyle,
  children,
}) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_SECONDARY }} edges={['top']}>
      <Header {...headerProps} />
      <View style={[{ flex: 1, backgroundColor: contentBackgroundColor }, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenWithHeader;
