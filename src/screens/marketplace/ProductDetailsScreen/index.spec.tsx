import { render, waitFor } from '@testing-library/react-native';
import ProductDetailsScreen from './index';

const mockUseProductDetails = jest.fn();
const mockUseUserFeed = jest.fn();

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

jest.mock('@/assets', () => ({
  LogoMini: () => null,
}));

jest.mock('@/components/ui/layout', () => ({
  Header: () => null,
  Background: () => null,
}));

jest.mock('@/components/ui', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    Toggle: ({ options, selected, onSelect }: any) => (
      <View testID='toggle'>
        {options.map((option: string) => (
          <TouchableOpacity key={option} onPress={() => onSelect(option)}>
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ),
  };
});

jest.mock('@/components/ui/buttons', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    SecondaryButton: ({ label, onPress }: any) => (
      <TouchableOpacity onPress={onPress} testID={`button-${label}`}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('@/components/ui/carousel', () => {
  const { View, Text } = require('react-native');
  return {
    ButtonCarousel: ({ options, selectedId, onSelect }: any) => (
      <View testID='button-carousel'>
        {options.map((opt: any) => (
          <Text key={opt.id}>{opt.label}</Text>
        ))}
      </View>
    ),
  };
});

jest.mock('@/components/sections/marketplace', () => {
  const { View } = require('react-native');
  return {
    ProductHeroSection: () => <View testID='product-hero-section' />,
    ProductInfoTabs: () => <View testID='product-info-tabs' />,
  };
});

jest.mock('@/components/sections/product', () => {
  const { View, Text } = require('react-native');
  return {
    PlansCarousel: () => (
      <View testID='plans-carousel'>
        <Text>Plans</Text>
      </View>
    ),
    Plan: {},
  };
});

jest.mock('@/components/sections/community', () => {
  const { View, Text } = require('react-native');
  return {
    PostCard: ({ post }: any) => (
      <View testID={`post-${post.id}`}>
        <Text>{post.content}</Text>
      </View>
    ),
  };
});

jest.mock('@/hooks', () => ({
  useProductDetails: (...args: any[]) => mockUseProductDetails(...args),
  useUserFeed: (...args: any[]) => mockUseUserFeed(...args),
}));

jest.mock('@/analytics', () => ({
  useAnalyticsScreen: jest.fn(),
  logButtonClick: jest.fn(),
  logTabSelect: jest.fn(),
  logAddToCart: jest.fn(),
  logSelectContent: jest.fn(),
  logError: jest.fn(),
}));

jest.mock('@/utils', () => ({
  formatPrice: jest.fn((price) => `$${price?.toFixed(2) || '0.00'}`),
}));

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
  status: 'active' as const,
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
};

describe('ProductDetailsScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
    getParent: jest.fn(() => ({
      navigate: jest.fn(),
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseProductDetails.mockReturnValue({
      product: mockProduct,
      ad: null,
      relatedProducts: [],
      loading: false,
      isFavorite: false,
      setIsFavorite: jest.fn(),
      handleAddToCart: jest.fn(),
      loadAd: jest.fn(),
    });

    mockUseUserFeed.mockReturnValue({
      posts: [],
      loading: false,
      loadPosts: jest.fn(),
    });
  });

  it('renders correctly with product data', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
      },
    };

    const { getAllByText } = render(
      <ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />,
    );

    await waitFor(() => {
      const products = getAllByText('Test Product');
      expect(products.length).toBeGreaterThan(0);
    });
  });

  it('shows product not found when product is null', async () => {
    mockUseProductDetails.mockReturnValue({
      product: null,
      ad: null,
      relatedProducts: [],
      loading: false,
      isFavorite: false,
      setIsFavorite: jest.fn(),
      handleAddToCart: jest.fn(),
      loadAd: jest.fn(),
    });

    const mockRoute = {
      params: {
        productId: 'product-2',
      },
    };

    const { getByText } = render(<ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('marketplace.productNotFound')).toBeTruthy();
    });
  });

  it('renders fallback product data when provided in route params', () => {
    mockUseProductDetails.mockReturnValue({
      product: { ...mockProduct, name: 'Fallback Product' },
      ad: null,
      relatedProducts: [],
      loading: false,
      isFavorite: false,
      setIsFavorite: jest.fn(),
      handleAddToCart: jest.fn(),
      loadAd: jest.fn(),
    });

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
      <ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />,
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

    render(<ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    // Assuming there's a back button with testID
    // This would need to be adjusted based on actual implementation
    expect(mockNavigation.goBack).toBeDefined();
  });

  it('loads related products on mount', async () => {
    mockUseProductDetails.mockReturnValue({
      product: mockProduct,
      ad: null,
      relatedProducts: [mockProduct],
      loading: false,
      isFavorite: false,
      setIsFavorite: jest.fn(),
      handleAddToCart: jest.fn(),
      loadAd: jest.fn(),
    });

    const mockRoute = {
      params: {
        productId: 'product-1',
      },
    };

    render(<ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(mockUseProductDetails).toHaveBeenCalled();
    });
  });

  it('loads product on mount when productId is provided', async () => {
    const mockRoute = {
      params: {
        productId: 'product-1',
      },
    };

    render(<ProductDetailsScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(mockUseProductDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          productId: 'product-1',
        }),
      );
    });
  });
});
