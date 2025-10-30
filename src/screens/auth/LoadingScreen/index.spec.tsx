import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';
import LoadingScreen from './index';

jest.mock('@/assets', () => ({
  PartialLogo: 'PartialLogo',
  GradientEffect: 'GradientEffect',
}));

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
  };
});

describe('LoadingScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(Animated, 'timing').mockImplementation((value: any, config: any) => {
      return {
        start: (cb?: any) => {
          if (value && typeof value.setValue === 'function' && config && typeof config.toValue === 'number') {
            value.setValue(config.toValue);
          }
          if (cb) cb({ finished: true });
        },
      } as any;
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    (Animated.timing as unknown as jest.Mock).mockRestore?.();
  });

  it('navega para Unauthenticated ao concluir o loading', () => {
    const replace = jest.fn();
    const navigate = jest.fn();

    render(<LoadingScreen navigation={{ replace, navigate }} />);

    jest.advanceTimersByTime(5000);

    expect(replace).toHaveBeenCalledWith('Unauthenticated');
  });
});


