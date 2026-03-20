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
  scrollProps?: Omit<
    ScrollViewProps,
    | 'style'
    | 'contentContainerStyle'
    | 'children'
    | 'keyboardShouldPersistTaps'
    | 'keyboardDismissMode'
    | 'showsVerticalScrollIndicator'
  >;
  includeBottomSafeAreaOnFooter?: boolean;
}>;

const KeyboardAwareScreen: React.FC<Props> = ({
  children,
  footer,
  keyboardVerticalOffset = 0,
  containerStyle,
  scrollViewStyle,
  scrollContentContainerStyle,
  footerContainerStyle,
  scrollProps,
  includeBottomSafeAreaOnFooter = true,
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

  const keyboardCompensation = Platform.OS === 'android' ? keyboardHeight : 0;

  return (
    <KeyboardAvoidingView
      testID='keyboard-aware-container'
      style={[styles.container, containerStyle]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        testID='keyboard-aware-scroll'
        style={scrollViewStyle}
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
});

export default KeyboardAwareScreen;
