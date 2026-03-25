import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { computeKeyboardInset } from '@/utils/layout/keyboardAwareLayout';

export function useKeyboardInset(): number {
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      const { height, screenY } = event.endCoordinates;
      setKeyboardInset(computeKeyboardInset({ keyboardHeight: height, screenY }));
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardInset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return keyboardInset;
}
