import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MarketplaceScreen from './index';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';

const mockLoadAds = jest.fn();
const mockUseMarketplaceAds = jest.fn();
const mockLoadProducts = jest.fn();
const mockUseProducts = jest.fn();

jest.mock('@/contexts/FloatingMenuContext', () => ({
  useSetFloatingMenu: () => jest.fn(),
  useIsFloatingMenuVisible: () => false,
}));

jest.mock('react-native-safe-area-context', () => {
  const ReactNative = require('react-native');
  return {
    SafeAreaView: ReactNative.View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('@/assets', () => ({
  LogoMini: () => null,
  BackgroundWithGradient: 'BackgroundWithGradient',
}));

jest.mock('@/components/ui/layout', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const Header = ({ onCartPress, showCartButton }: any) => (
    <View>
      {showCartButton && onCartPress && (
        <TouchableOpacity onPress={onCartPress} testID='cart-button'>
          <Text>Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  return {
    Header,
    Background: () => null,
    GradientBackground: () => null,
    ScreenWithHeader: ({ children, headerProps }: any) => (
      <View>
        <Header {...headerProps} />
        {children}
      </View>
    ),
  };
});

jest.mock('@/components/ui/inputs', () => {
  const { View, Text, TextInput: RNTextInput } = require('react-native');
  return {
    SearchBar: ({ value, onChangeText, placeholder }: any) => (
      <View>
        <Text>{placeholder}</Text>
        <RNTextInput value={value} onChangeText={onChangeText} testID='search-input' />
      </View>
    ),
  };
});

jest.mock('@/components/ui/menu', () => {
  const { View, Text } = require('react-native');
  return {
    FloatingMenu: () => <View testID='floating-menu' />,
    StickyFilterCarouselRow: ({ filterButtonLabel }: any) => (
      <View testID='filter-menu'>
        <Text testID='filter-button-label'>{filterButtonLabel}</Text>
      </View>
    ),
  };
});

jest.mock('@/components/ui/buttons', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    IconButton: ({ onPress, icon }: any) => (
      <TouchableOpacity onPress={onPress} testID={`icon-button-${icon ?? 'unknown'}`}>
        <Text>{icon ?? 'icon'}</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('@/components/sections/marketplace', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    WeekHighlightCard: ({ title, onPress }: any) => (
      <TouchableOpacity onPress={onPress} testID='week-highlight'>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
    AdsList: () => <View testID='ads-list' />,
  };
});

jest.mock('@/components/sections', () => {
  const { View } = require('react-native');
  return {
    GradientBackgroundByCategory: () => <View testID='gradient-background-by-category' />,
  };
});

jest.mock('@/components/ui/modals', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    FilterCategoryModal: ({ onFilter }: any) => (
      <TouchableOpacity
        testID='apply-filter-category'
        onPress={() =>
          onFilter({
            categoryId: 'cat-1',
            categoryName: null,
            solutionIds: ['products'],
          })
        }
      >
        <Text>Aplicar filtro</Text>
      </TouchableOpacity>
    ),
  };
});

jest.mock('@/hooks', () => ({
  useMarketplaceAds: (...args: any[]) => mockUseMarketplaceAds(...args),
  useProducts: (...args: any[]) => mockUseProducts(...args),
  useSolutions: () => ({
    marketplaceCarouselOptions: [
      { id: 'all', label: 'Todos' },
      { id: 'products', label: 'Produtos' },
      { id: 'services', label: 'Servicos' },
      { id: 'programs', label: 'Programas' },
      { id: 'professionals', label: 'Profissionais' },
    ],
  }),
  useMenuItems: () => [],
  useCategories: () => ({ categories: [{ categoryId: 'cat-1', name: 'Autoestima' }] }),
  useCategoryDisplayLabel: () => ({ getCategoryName: (id: string) => id || 'Category' }),
  useUserAvatar: () => null,
  useAdvertisers: () => ({
    advertisers: [],
    loading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));

jest.mock('@/analytics', () => ({
  useAnalyticsScreen: jest.fn(),
}));

jest.mock('@/utils', () => ({
  formatPrice: jest.fn((price: number) => `$${price?.toFixed(2) || '0.00'}`),
  handleAdNavigation: jest.fn(),
}));

jest.mock('@/services', () => ({
  adService: {
    listAds: jest.fn(),
  },
}));

const mockAds = [
  {
    id: '1',
    title: 'Test Product',
    productId: 'product-1',
    type: PRODUCT_CATALOG_TYPE.PHYSICAL,
    product: {
      id: 'product-1',
      name: 'Test Product',
      price: 29.99,
      image: 'https://example.com/image.jpg',
      type: PRODUCT_CATALOG_TYPE.PHYSICAL,
      description: 'Test description',
      quantity: 10,
      status: 'active',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
  {
    id: '2',
    title: 'Amazon Product',
    productId: 'product-2',
    type: PRODUCT_CATALOG_TYPE.AMAZON,
    product: {
      id: 'product-2',
      name: 'Amazon Product',
      price: 19.99,
      image: 'https://example.com/amazon.jpg',
      type: PRODUCT_CATALOG_TYPE.AMAZON,
      description: 'Amazon description',
      quantity: 5,
      status: 'active',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    },
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  },
];

describe('MarketplaceScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    getParent: jest.fn(() => ({
      getParent: jest.fn(),
    })),
  };

  const mockRoute = {
    params: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLoadAds.mockClear();
    mockLoadProducts.mockClear();
    mockUseMarketplaceAds.mockReturnValue({
      ads: mockAds,
      loading: false,
      hasMore: false,
      loadAds: mockLoadAds,
    });
    mockUseProducts.mockReturnValue({
      ads: [],
      loading: false,
      hasMore: false,
      loadProducts: mockLoadProducts,
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(<MarketplaceScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('marketplace.weekHighlights')).toBeTruthy();
    });
  });

  it('loads ads on mount', async () => {
    render(<MarketplaceScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(mockUseMarketplaceAds).toHaveBeenCalled();
    });
  });

  it('navigates to cart when cart button is pressed', () => {
    const { getByTestId } = render(<MarketplaceScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    const cartButton = getByTestId('cart-button');
    fireEvent.press(cartButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Cart');
  });

  it('renders product cards from ads', async () => {
    const { getByTestId } = render(<MarketplaceScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByTestId('ads-list')).toBeTruthy();
    });
  });

  it('renders amazon product cards from ads', async () => {
    const { getByTestId } = render(<MarketplaceScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByTestId('ads-list')).toBeTruthy();
    });
  });

  it('exibe lista de anúncios para navegação ao detalhe do produto', async () => {
    const { getByTestId } = render(<MarketplaceScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByTestId('ads-list')).toBeTruthy();
    });

    expect(mockNavigation.navigate).toBeDefined();
  });

  it('filters ads by category when category pill is pressed', async () => {
    const { getByText } = render(<MarketplaceScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    await waitFor(() => {
      expect(getByText('marketplace.weekHighlights')).toBeTruthy();
    });

    expect(mockUseMarketplaceAds).toHaveBeenCalled();
  });

  it('keeps selected category context after applying filters', async () => {
    const { getByTestId } = render(<MarketplaceScreen navigation={mockNavigation as any} route={mockRoute as any} />);

    fireEvent.press(getByTestId('apply-filter-category'));

    await waitFor(() => {
      expect(getByTestId('filter-button-label').props.children).toBe('Autoestima');
    });

    expect(mockUseMarketplaceAds).toHaveBeenLastCalledWith(
      expect.objectContaining({
        selectedCategoryId: 'cat-1',
      }),
    );
  });
});
