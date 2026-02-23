import { render, act } from '@testing-library/react-native';
import { Animated, Image } from 'react-native';
import LoadingScreen from './index';

jest.mock('@/assets', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    PartialLogo: (props: any) => React.createElement(View, props),
    GradientSplash7: 1,
    GradientSplash8: 2,
    GradientSplash9: 3,
  };
});

jest.mock('@/analytics', () => ({
  useAnalyticsScreen: jest.fn(),
}));

jest.mock('@/services', () => ({
  storageService: {
    getToken: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('@/config', () => ({
  getApiUrl: (path: string) => `http://localhost${path}`,
}));

describe('LoadingScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (Image.resolveAssetSource as any) = jest.fn().mockReturnValue({ width: 100, height: 200, uri: 'mock' });
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

  it('navega para Unauthenticated ao concluir o loading', async () => {
    const replace = jest.fn();
    const navigate = jest.fn();

    render(<LoadingScreen navigation={{ replace, navigate }} />);

    for (let i = 0; i < 10; i++) {
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
    }

    expect(replace).toHaveBeenCalledWith('Unauthenticated');
  });
});
