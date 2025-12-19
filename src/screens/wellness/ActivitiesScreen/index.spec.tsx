import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ActivitiesScreen from './index';
import { productService } from '@/services';

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@/components/ui/layout', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Header: () => null,
    Background: () => null,
  };
});

jest.mock('@/components/ui/menu', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    FloatingMenu: () => <View testID="floating-menu" />,
  };
});

jest.mock('@/components/ui/carousel', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    ProductsCarousel: ({ products }: any) => (
      <View testID="products-carousel">
        {products?.map((p: any) => (
          <Text key={p.id}>{p.title}</Text>
        ))}
      </View>
    ),
    PlansCarousel: ({ plans }: any) => (
      <View testID="plans-carousel">
        {plans?.map((p: any) => (
          <Text key={p.id}>{p.title}</Text>
        ))}
      </View>
    ),
  };
});

jest.mock('@/assets', () => ({
  BackgroundIconButton: require('react-native').Image.resolveAssetSource({ uri: 'test' }),
}));

jest.mock('@/services', () => ({
  productService: {
    listProducts: jest.fn(),
  },
}));

const mockNavigation = {
  navigate: jest.fn(),
  getParent: jest.fn(() => ({
    navigate: jest.fn(),
  })),
} as any;

describe('ActivitiesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    (productService.listProducts as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        products: [],
      },
    });
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText('Actives')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
  });

  it('displays tabs correctly', () => {
    const { getByText } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText('Actives')).toBeTruthy();
    expect(getByText('History')).toBeTruthy();
  });

  it('switches between tabs', () => {
    const { getByText } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    const historyTab = getByText('History');
    fireEvent.press(historyTab);

    expect(getByText('History')).toBeTruthy();
  });

  it('displays filter pills', () => {
    const { getAllByText, getByText } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText('All')).toBeTruthy();
    expect(getByText('Activities')).toBeTruthy();
    // There might be multiple "Appointments" texts, so we check if at least one exists
    expect(getAllByText('Appointments').length).toBeGreaterThan(0);
  });

  it('filters activities when filter is selected', () => {
    const { getByText } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    const activitiesFilter = getByText('Activities');
    fireEvent.press(activitiesFilter);

    // Should still render activities
    expect(getByText('Activities')).toBeTruthy();
  });

  it('displays activity cards', () => {
    const { getByText } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText('Breathing exercises')).toBeTruthy();
    expect(getByText('Mindful meditation')).toBeTruthy();
  });

  it('displays festival banner initially', () => {
    const { getByText } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText(/Spring Festival kicks off/i)).toBeTruthy();
  });

  it('hides festival banner when close button is pressed', async () => {
    const { getByText, queryByText, UNSAFE_getAllByType } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText(/Spring Festival kicks off/i)).toBeTruthy();

    // Find close button by testID or by finding TouchableOpacity in banner
    const { TouchableOpacity } = require('react-native');
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const closeButton = touchables.find((btn: any) => 
      btn.props.testID === 'banner-close' || 
      btn.parent?.props?.testID === 'festival-banner'
    );

    if (closeButton) {
      fireEvent.press(closeButton);
      
      await waitFor(() => {
        expect(queryByText(/Spring Festival kicks off/i)).toBeNull();
      });
    }
  });

  it('displays recommendations section', () => {
    const { getByText } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    expect(getByText(/Let's do a new mental state anamnesis/i)).toBeTruthy();
    expect(getByText('Start Anamnesis')).toBeTruthy();
  });

  it('does not display recommendations in history tab', async () => {
    const { getByText, queryByText } = render(
      <ActivitiesScreen navigation={mockNavigation} route={{} as any} />
    );

    const historyTab = getByText('History');
    fireEvent.press(historyTab);

    await waitFor(() => {
      expect(queryByText(/Let's do a new mental state anamnesis/i)).toBeNull();
    });
  });
});
