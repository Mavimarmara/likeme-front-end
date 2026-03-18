import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../Header';
import { COLORS } from '@/constants';

type HeaderProps = React.ComponentProps<typeof Header>;

type Props = React.PropsWithChildren<{
  /** Navegação da tela (react-navigation). Usada para a ação padrão ao clicar na logo. */
  navigation?: any;
  headerProps?: HeaderProps;
  /** Fundo do conteúdo (abaixo do header). */
  contentBackgroundColor?: string;
  /** Estilo opcional extra para o container do conteúdo. */
  contentContainerStyle?: ViewStyle | ViewStyle[];
}>;

const ScreenWithHeader: React.FC<Props> = ({
  navigation,
  headerProps,
  contentBackgroundColor = COLORS.BACKGROUND,
  contentContainerStyle,
  children,
}) => {
  const rootNavigation = navigation?.getParent?.() ?? navigation;
  const defaultOnLogoPress = rootNavigation?.navigate != null ? () => rootNavigation.navigate('Summary') : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BACKGROUND_SECONDARY }} edges={['top']}>
      <Header {...headerProps} onLogoPress={headerProps?.onLogoPress ?? defaultOnLogoPress} />
      <View style={[{ flex: 1, backgroundColor: contentBackgroundColor, position: 'relative' }, contentContainerStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default ScreenWithHeader;
