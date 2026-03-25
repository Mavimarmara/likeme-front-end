import React from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KEYBOARD_AWARE_SCROLL } from '@/constants';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import {
  resolveBaseScrollContentPaddingBottom,
  resolveKeyboardFooterOptions,
  resolveScrollContentPaddingBottom,
  type KeyboardFooterOverrides,
} from '@/utils/layout/keyboardAwareLayout';

type Props = React.PropsWithChildren<{
  footer?: React.ReactNode;
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
  keyboardFooterOverrides?: KeyboardFooterOverrides;
  translateFooterWithKeyboard?: boolean;
  keyboardFooterLiftExtra?: number;
  includeFooterHeightInKeyboardLift?: boolean;
}>;

const KeyboardAwareScreen: React.FC<Props> = ({
  children,
  footer,
  containerStyle,
  scrollViewStyle,
  scrollContentContainerStyle,
  footerContainerStyle,
  scrollRef,
  scrollProps,
  includeBottomSafeAreaOnFooter = true,
  keyboardFooterOverrides,
  translateFooterWithKeyboard = true,
  keyboardFooterLiftExtra = 0,
  includeFooterHeightInKeyboardLift = false,
}) => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const keyboardInset = useKeyboardInset();
  const [footerLayoutHeight, setFooterLayoutHeight] = React.useState(0);

  const footerKeyboard = resolveKeyboardFooterOptions(
    {
      translateFooterWithKeyboard,
      keyboardFooterLiftExtra,
      includeFooterHeightInKeyboardLift,
    },
    keyboardFooterOverrides,
  );

  const manualLift =
    footerKeyboard.keyboardFooterLiftExtra +
    (footerKeyboard.includeFooterHeightInKeyboardLift ? footerLayoutHeight : 0);

  const applyManualFooterLift = keyboardInset > 0 && footerKeyboard.translateFooterWithKeyboard;

  const footerBottom = applyManualFooterLift ? keyboardInset + manualLift : 0;

  const isFooterDockedToScreenBottom = footerBottom === 0;
  const shouldPadFooterWithBottomSafeArea =
    includeBottomSafeAreaOnFooter && bottomInset > 0 && isFooterDockedToScreenBottom;

  const baseScrollPad = React.useMemo(
    () =>
      resolveBaseScrollContentPaddingBottom(
        scrollContentContainerStyle,
        KEYBOARD_AWARE_SCROLL.CONTENT_FALLBACK_PADDING_BOTTOM,
      ),
    [scrollContentContainerStyle],
  );

  const scrollPadBottom = resolveScrollContentPaddingBottom({
    basePaddingBottom: baseScrollPad,
    hasFooter: Boolean(footer),
    keyboardInset,
  });

  const scrollContentMerged: ScrollViewProps['contentContainerStyle'] = [
    scrollContentContainerStyle,
    { paddingBottom: scrollPadBottom },
  ];

  return (
    <View testID='keyboard-aware-container' style={[styles.container, containerStyle]}>
      <ScrollView
        ref={scrollRef}
        testID='keyboard-aware-scroll'
        style={[footer ? styles.scrollFill : null, scrollViewStyle]}
        contentContainerStyle={scrollContentMerged}
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
          onLayout={(e) => setFooterLayoutHeight(e.nativeEvent.layout.height)}
          style={[
            styles.footerAbsolute,
            { bottom: footerBottom },
            shouldPadFooterWithBottomSafeArea ? { paddingBottom: bottomInset } : null,
            footerContainerStyle,
          ]}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollFill: {
    flex: 1,
  },
  footerAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
  },
});

export default KeyboardAwareScreen;

export type { KeyboardFooterOverrides };
