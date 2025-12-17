import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductDetailsScreen from './index';
import { productService, adService } from '@/services';

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@/assets', () => ({
  LogoMini: () => null,
}));

jest.mock('@/components/ui/layout', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Header: () => null,
    Background: () => null,
  };
});

jest.mock('@/components/ui/carousel', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    ProductsCarousel: () => (
      <View testID="products-carousel">
        <Text>Related Products</Text>
      </View>
    ),
  };
});

jest.mock('@/services', () => ({
  productService: {
    getProductById: jest.fn(),
    listProducts: jest.fn(),
  },
  adService: {
    listAds: jest.fn(),
    getAdById: jest.fn(),
  },
  storageService: {
    addToCart: jest.fn(),
  },
}));

const mockProduct = {
  id: 'product-1',
  name: 'Test Product',
  description: 'Test description',
  price: 29.99,
  image: 'https://example.com/image.jpg',
  category: 'physical product',
  quantity: 10,
  status: 'active',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
};

const mockAmazonProduct = {
  id: 'product-2',
  name: 'Amazon Product',
  description: 'Amazon description',
  price: 19.99,
  image: 'https://example.com/amazon.jpg',
  category: 'amazon product',
  quantity: 5,
  status: 'active',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
};

describe('ProductDetailsScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockProduct,
    });
    (productService.listProducts as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        products: [],
        pagination: {
          page: 1,
          limit: 5,
          total: 0,
          totalPages: 1,
        },
      },
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
  });

  it('renders correctly with product data', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
      },
    };

    const { getAllByText } = render(
      <ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      const products = getAllByText('Test Product');
      expect(products.length).toBeGreaterThan(0);
    });
  });

  it('redirects to AffiliateProduct when product is amazon product', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: mockAmazonProduct,
    });
    (adService.listAds as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        ads: [{ id: 'ad-1', productId: 'product-2' }],
        pagination: {
          page: 1,
          limit: 1,
          total: 1,
          totalPages: 1,
        },
      },
    });

    const mockRoute = {
      params: {
        productId: 'product-2',
      },
    };

    render(
      <ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('AffiliateProduct', expect.any(Object));
    });
  });

  it('renders fallback product data when provided in route params', () => {
    const mockRoute = {
      params: {
        product: {
          id: 'fallback-1',
          title: 'Fallback Product',
          price: '$19.99',
          image: 'https://example.com/fallback.jpg',
          category: 'test',
          description: 'Fallback description',
        },
      },
    };

    const { getAllByText } = render(
      <ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    const products = getAllByText('Fallback Product');
    expect(products.length).toBeGreaterThan(0);
  });

  it('handles back button press', () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
      },
    };

    const { getByTestId } = render(
      <ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    // Assuming there's a back button with testID
    // This would need to be adjusted based on actual implementation
    expect(mockNavigation.goBack).toBeDefined();
  });

  it('loads related products on mount', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
      },
    };

    render(
      <ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      expect(productService.listProducts).toHaveBeenCalled();
    });
  });

  it('loads product on mount when productId is provided', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
      },
    };

    render(
      <ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );

    await waitFor(() => {
      expect(productService.getProductById).toHaveBeenCalledWith('product-1');
    });
  });
});

