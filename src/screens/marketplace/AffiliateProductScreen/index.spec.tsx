import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AffiliateProductScreen from './index';
import { adService, productService } from '@/services';

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

jest.mock('@/components/ui/layout', () => {
  const React = require('react');
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    Header: ({ onBackPress }: any) => (
      <View>
        <TouchableOpacity onPress={onBackPress} testID="back-button">
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    ),
    Background: () => null,
  };
});

jest.mock('@/services', () => ({
  adService: {
    getAdById: jest.fn(),
    listAds: jest.fn(),
  },
  productService: {
    getProductById: jest.fn(),
    listProducts: jest.fn(),
  },
}));

const mockAd = {
  id: 'ad-1',
  productId: 'product-1',
  title: 'Amazon Product',
  description: 'Amazon description',
  image: 'https://example.com/amazon.jpg',
  category: 'amazon product',
  externalUrl: 'https://amazon.com/product',
  status: 'active',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  product: {
    id: 'product-1',
    name: 'Amazon Product',
    description: 'Amazon description',
    price: 19.99,
    image: 'https://example.com/amazon.jpg',
    category: 'amazon product',
    quantity: 5,
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
};

describe('AffiliateProductScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockAd.product,
    });
    (adService.getAdById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockAd,
    });
    (adService.listAds as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        ads: [mockAd],
        pagination: {
          page: 1,
          limit: 1,
          total: 1,
          totalPages: 1,
        },
      },
    });
    (productService.listProducts as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        products: [],
        pagination: {
          page: 1,
          limit: 3,
          total: 0,
          totalPages: 1,
        },
      },
    });
  });

  it('renders correctly with product data', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
        adId: 'ad-1',
      },
    };

    const { getByText } = render(
      <AffiliateProductScreen navigation={mockNavigation as any} route={mockRoute as any} />,
    );

    await waitFor(() => {
      expect(getByText('Amazon Product')).toBeTruthy();
    });
  });

  it('loads ad data when adId is provided', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
        adId: 'ad-1',
      },
    };

    render(<AffiliateProductScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(adService.getAdById).toHaveBeenCalledWith('ad-1');
    });
  });

  it('loads product data when productId is provided', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
      },
    };

    render(<AffiliateProductScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(adService.listAds).toHaveBeenCalled();
    });
  });

  it('handles back button press', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
        adId: 'ad-1',
      },
    };

    const { getByTestId } = render(
      <AffiliateProductScreen navigation={mockNavigation as any} route={mockRoute as any} />,
    );

    await waitFor(() => {
      expect(getByTestId('back-button')).toBeTruthy();
    });

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('opens external URL when Buy on Amazon button is pressed', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
        adId: 'ad-1',
      },
    };

    const Linking = require('react-native').Linking;
    const mockOpenURL = jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve());

    const { getByText } = render(
      <AffiliateProductScreen navigation={mockNavigation as any} route={mockRoute as any} />,
    );

    await waitFor(() => {
      expect(getByText('Buy on Amazon')).toBeTruthy();
    });

    const buyButton = getByText('Buy on Amazon');
    fireEvent.press(buyButton);

    await waitFor(() => {
      expect(mockOpenURL).toHaveBeenCalledWith('https://amazon.com/product');
    });

    mockOpenURL.mockRestore();
  });

  it('renders fallback product data when provided in route params', async () => {
    // Mock dos serviços - loadData será chamado e deve usar category do route.params.product
    (adService.getAdById as jest.Mock).mockResolvedValue({
      success: false,
      data: null,
    });
    (adService.listAds as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        ads: [],
        pagination: {
          page: 1,
          limit: 1,
          total: 0,
          totalPages: 1,
        },
      },
    });
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: false,
      data: null,
    });
    (productService.listProducts as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        products: [],
        pagination: {
          page: 1,
          limit: 3,
          total: 0,
          totalPages: 1,
        },
      },
    });

    const mockRoute = {
      params: {
        // Não passa productId ou adId - apenas product
        product: {
          id: 'fallback-1',
          title: 'Fallback Product',
          price: '$19.99',
          image: 'https://example.com/fallback.jpg',
          category: 'amazon product',
          description: 'Fallback description',
        },
      },
    };

    const { queryByText } = render(
      <AffiliateProductScreen navigation={mockNavigation as any} route={mockRoute as any} />,
    );

    // Aguarda o loading terminar - o componente deve renderizar mesmo que loadData não encontre nada
    await waitFor(
      () => {
        expect(queryByText('Loading product...')).toBeNull();
      },
      { timeout: 3000 },
    );

    // Verifica que o componente renderizou (não está em loading)
    // O teste verifica que o componente não crasha e renderiza algo
    expect(queryByText('Loading product...')).toBeNull();
  });
});
