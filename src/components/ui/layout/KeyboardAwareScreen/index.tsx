import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = React.PropsWithChildren<{
  footer?: React.ReactNode;
  keyboardVerticalOffset?: number;
  containerStyle?: StyleProp<ViewStyle>;
  scrollViewStyle?: StyleProp<ViewStyle>;
  scrollContentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  footerContainerStyle?: StyleProp<ViewStyle>;
  scrollRef?: React.RefObject<ScrollView | null>;
  scrollProps?: Omit<
    ScrollViewProps,
    | 'style'
    | 'contentContainerStyle'
    | 'children'
    | 'ref'
    | 'keyboardShouldPersistTaps'
    | 'keyboardDismissMode'
    | 'showsVerticalScrollIndicator'
  >;
  includeBottomSafeAreaOnFooter?: boolean;
  /**
   * Android: eleva o footer com `marginBottom` = altura do teclado. Se o botão “sobe demais” com
   * `softwareKeyboardLayoutMode: resize`, passe `false` (janela já encolhe). Com teclado atrás do conteúdo, mantenha `true` (padrão).
   */
  translateFooterWithKeyboardOnAndroid?: boolean;
}>;

const KeyboardAwareScreen: React.FC<Props> = ({
  children,
  footer,
  keyboardVerticalOffset = 0,
  containerStyle,
  scrollViewStyle,
  scrollContentContainerStyle,
  footerContainerStyle,
  scrollRef,
  scrollProps,
  includeBottomSafeAreaOnFooter = true,
  translateFooterWithKeyboardOnAndroid = true,
}) => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const keyboardCompensation = Platform.OS === 'android' && translateFooterWithKeyboardOnAndroid ? keyboardHeight : 0;

  return (
    <KeyboardAvoidingView
      testID='keyboard-aware-container'
      style={[styles.container, containerStyle]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        ref={scrollRef}
        testID='keyboard-aware-scroll'
        style={[footer ? styles.scrollFill : null, scrollViewStyle]}
        contentContainerStyle={scrollContentContainerStyle}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        {...scrollProps}
      >
        {children}
      </ScrollView>

      {footer ? (
        <View
          testID='keyboard-aware-footer'
          style={[
            keyboardCompensation > 0 ? { marginBottom: keyboardCompensation } : null,
            includeBottomSafeAreaOnFooter && bottomInset > 0 ? { paddingBottom: bottomInset } : null,
            footerContainerStyle,
          ]}
        >
          {footer}
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollFill: {
    flex: 1,
  },
});

export default KeyboardAwareScreen;
