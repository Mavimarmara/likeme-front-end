import React from 'react';
import { FlatList, StyleSheet, View, type FlatListProps, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KEYBOARD_AWARE_SCROLL } from '@/constants';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import {
  resolveBaseScrollContentPaddingBottom,
  resolveDockedFooterReserveHeight,
  resolveKeyboardFooterOptions,
  resolveScrollContentPaddingBottom,
  type KeyboardFooterOverrides,
} from '@/utils/layout/keyboardAwareLayout';

/**
 * Versao virtualizada do KeyboardAwareScreen para telas com listas longas
 * (chat, etc.). API espelha a do irmao: `footer` flutua acima do teclado,
 * `bottomInset`/insets seguros sao respeitados, e o teclado faz dismiss em
 * drag. O conteudo da lista vem por `data` + `renderItem` (FlatList).
 */
type Props<T> = Omit<
  FlatListProps<T>,
  | 'keyboardShouldPersistTaps'
  | 'keyboardDismissMode'
  | 'showsVerticalScrollIndicator'
  | 'style'
  | 'contentContainerStyle'
  | 'ref'
> & {
  footer?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
  listContentContainerStyle?: FlatListProps<T>['contentContainerStyle'];
  footerContainerStyle?: StyleProp<ViewStyle>;
  listRef?: React.RefObject<FlatList<T> | null>;
  includeBottomSafeAreaOnFooter?: boolean;
  keyboardFooterOverrides?: KeyboardFooterOverrides;
  translateFooterWithKeyboard?: boolean;
  keyboardFooterLiftExtra?: number;
  includeFooterHeightInKeyboardLift?: boolean;
};

function KeyboardAwareList<T>({
  footer,
  containerStyle,
  listStyle,
  listContentContainerStyle,
  footerContainerStyle,
  listRef,
  includeBottomSafeAreaOnFooter = true,
  keyboardFooterOverrides,
  translateFooterWithKeyboard = true,
  keyboardFooterLiftExtra = 0,
  includeFooterHeightInKeyboardLift = false,
  ...flatListProps
}: Props<T>) {
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

  const dockedFooterReserveHeight = resolveDockedFooterReserveHeight({
    hasFooter: Boolean(footer),
    footerLayoutHeight,
    fallbackReserveHeight: KEYBOARD_AWARE_SCROLL.CONTENT_FALLBACK_PADDING_BOTTOM,
  });

  const baseScrollPad = React.useMemo(
    () =>
      resolveBaseScrollContentPaddingBottom(
        listContentContainerStyle,
        KEYBOARD_AWARE_SCROLL.CONTENT_FALLBACK_PADDING_BOTTOM,
      ),
    [listContentContainerStyle],
  );

  const scrollPadBottom = resolveScrollContentPaddingBottom({
    basePaddingBottom: baseScrollPad,
    hasFooter: Boolean(footer),
    keyboardInset,
  });

  const listContentMerged: FlatListProps<T>['contentContainerStyle'] = [
    listContentContainerStyle,
    { paddingBottom: scrollPadBottom },
  ];

  return (
    <View testID='keyboard-aware-list-container' style={[styles.container, containerStyle]}>
      <FlatList<T>
        ref={listRef}
        testID='keyboard-aware-list'
        style={[
          footer ? styles.listFill : null,
          isFooterDockedToScreenBottom ? { marginBottom: dockedFooterReserveHeight } : null,
          listStyle,
        ]}
        contentContainerStyle={listContentMerged}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        {...flatListProps}
      />

      {footer ? (
        <View
          testID='keyboard-aware-list-footer'
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  listFill: {
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

export default KeyboardAwareList;

export type { KeyboardFooterOverrides };
