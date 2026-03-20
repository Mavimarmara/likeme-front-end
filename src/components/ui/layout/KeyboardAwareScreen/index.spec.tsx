import React from 'react';
import { Keyboard, Platform, StyleSheet } from 'react-native';
import { act, render } from '@testing-library/react-native';
import KeyboardAwareScreen from './index';

let mockedInsets = { top: 0, bottom: 0, left: 0, right: 0 };

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => mockedInsets,
}));

describe('KeyboardAwareScreen', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Object.defineProperty(Platform, 'OS', { value: originalPlatform });
    mockedInsets = { top: 0, bottom: 0, left: 0, right: 0 };
  });

  it('usa comportamento height no Android', () => {
    Object.defineProperty(Platform, 'OS', { value: 'android' });

    const { UNSAFE_getByType } = render(<KeyboardAwareScreen />);
    const keyboardAvoidingView = UNSAFE_getByType(require('react-native').KeyboardAvoidingView);
    expect(keyboardAvoidingView.props.behavior).toBeUndefined();
  });

  it('usa comportamento padding no iOS', () => {
    Object.defineProperty(Platform, 'OS', { value: 'ios' });

    const { UNSAFE_getByType } = render(<KeyboardAwareScreen />);
    const keyboardAvoidingView = UNSAFE_getByType(require('react-native').KeyboardAvoidingView);
    expect(keyboardAvoidingView.props.behavior).toBe('padding');
  });

  it('aplica defaults seguros no ScrollView', () => {
    const { getByTestId } = render(<KeyboardAwareScreen />);
    const scroll = getByTestId('keyboard-aware-scroll');

    expect(scroll.props.keyboardShouldPersistTaps).toBe('handled');
    expect(scroll.props.keyboardDismissMode).toBe('on-drag');
  });

  it('aplica padding inferior no footer com safe area', () => {
    mockedInsets = { top: 0, bottom: 24, left: 0, right: 0 };

    const { getByTestId } = render(<KeyboardAwareScreen footer={null} />);
    expect(() => getByTestId('keyboard-aware-footer')).toThrow();

    const rendered = render(<KeyboardAwareScreen footer={<></>} />);
    const footerStyle = StyleSheet.flatten(rendered.getByTestId('keyboard-aware-footer').props.style);

    expect(footerStyle.paddingBottom).toBe(24);
  });

  it('compensa footer no Android quando teclado abre', () => {
    Object.defineProperty(Platform, 'OS', { value: 'android' });

    const listeners: Record<string, (event?: any) => void> = {};
    const addListenerSpy = jest.spyOn(Keyboard, 'addListener').mockImplementation((eventName: any, callback: any) => {
      listeners[eventName] = callback;
      return { remove: jest.fn() } as any;
    });

    const rendered = render(<KeyboardAwareScreen footer={<></>} />);
    act(() => {
      listeners.keyboardDidShow?.({ endCoordinates: { height: 180 } });
    });

    const footerStyle = StyleSheet.flatten(rendered.getByTestId('keyboard-aware-footer').props.style);
    expect(footerStyle.marginBottom).toBe(180);

    addListenerSpy.mockRestore();
  });
});
