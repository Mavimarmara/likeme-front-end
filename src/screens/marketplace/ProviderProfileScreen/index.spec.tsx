import { render, fireEvent } from '@testing-library/react-native';
import ProviderProfileScreen from './index';

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

jest.mock('@/components/ui/layout', () => {
  const { View, TouchableOpacity, Text } = require('react-native');
  return {
    Header: ({ onBackPress }: any) => (
      <View>
        <TouchableOpacity onPress={onBackPress} testID='back-button'>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    ),
    Background: () => null,
    HeroImage: ({ name, title, badges = [], ...rest }: any) => (
      <View testID='hero-image'>
        {name != null && <Text>{name}</Text>}
        {title != null && <Text>{title}</Text>}
        {(badges || []).map((b: string, i: number) => (
          <Text key={i}>{b}</Text>
        ))}
      </View>
    ),
  };
});

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

jest.mock('@/components/ui/tabs', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    ToggleTabs: ({ tabs, activeTabId, onTabPress }: any) => (
      <View testID='toggle-tabs'>
        {(tabs || []).map((tab: { id: string; label: string }) => (
          <TouchableOpacity key={tab.id} onPress={() => onTabPress?.(tab.id)}>
            <Text>{tab.label}</Text>
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

jest.mock('@/components/sections/community', () => {
  const { View, Text } = require('react-native');
  return {
    PostCard: ({ post }: any) => (
      <View testID={`post-${post.id}`}>
        <Text>{post.content}</Text>
      </View>
    ),
    JoinCommunityCard: () => <View testID='join-community-card' />,
    NextEventsSection: ({ events }: any) => <View testID='next-events' />,
  };
});

jest.mock('@/components/sections/product', () => ({
  Product: {},
}));

jest.mock('@/components/sections/marketplace', () => {
  const { View } = require('react-native');
  return {
    AdsList: () => <View testID='ads-list' />,
  };
});

jest.mock('@/hooks', () => ({
  useCommunities: () => ({
    communities: [],
    categories: [],
    loading: false,
    loadCommunities: jest.fn(),
  }),
  useAdvertiser: jest.fn(
    (opts: { initialAdvertiser?: { id: string; name: string; description?: string; logo?: string } }) => {
      if (opts?.initialAdvertiser) {
        return { advertiser: undefined, loading: false };
      }
      return {
        advertiser: {
          id: 'provider-1',
          name: 'Marcela Ferraz',
          description: '',
          logo: undefined,
        },
        loading: false,
      };
    },
  ),
  useProviderAds: () => ({
    ads: [],
    loading: false,
    hasMore: false,
    loadAds: jest.fn(),
  }),
  useCategories: () => ({ categories: [] }),
}));

jest.mock('@/utils', () => ({
  formatPrice: jest.fn((price: number) => `$${price?.toFixed(2) || '0.00'}`),
}));

jest.mock('@/analytics', () => ({
  useAnalyticsScreen: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  CommonActions: {
    navigate: jest.fn((params: any) => ({ type: 'NAVIGATE', payload: params })),
  },
}));

jest.mock('@/assets', () => ({
  BackgroundIconButton: require('react-native').Image.resolveAssetSource({ uri: 'test' }),
}));

const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  getParent: jest.fn(() => ({
    navigate: jest.fn(),
  })),
} as any;

const mockRouteWithProvider = {
  params: {
    providerId: 'provider-1',
    provider: {
      name: 'Dr. Avery Parker',
      title: 'Therapist & Wellness Coach',
      description: 'Specialized in mental health and wellness coaching.',
      rating: 4.8,
      specialties: ['Mental Health', 'Wellness Coaching', 'Therapy'],
      avatar: 'https://example.com/avatar.jpg',
    },
  },
} as any;

const mockRouteWithoutProvider = {
  params: {
    providerId: 'provider-1',
  },
} as any;

describe('ProviderProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  it('renders correctly with provider data', () => {
    const { getByText } = render(<ProviderProfileScreen navigation={mockNavigation} route={mockRouteWithProvider} />);

    expect(getByText('Dr. Avery Parker')).toBeTruthy();
    expect(getByText('Therapist & Wellness Coach')).toBeTruthy();
    expect(getByText('Mental Health')).toBeTruthy();
    expect(getByText('Wellness Coaching')).toBeTruthy();
    expect(getByText('Therapy')).toBeTruthy();
  });

  it('renders correctly with default provider data when not provided', () => {
    const { getByText } = render(
      <ProviderProfileScreen navigation={mockNavigation} route={mockRouteWithoutProvider} />,
    );

    expect(getByText('Marcela Ferraz')).toBeTruthy();
  });

  it('calls goBack when back button is pressed', () => {
    const { getByTestId } = render(<ProviderProfileScreen navigation={mockNavigation} route={mockRouteWithProvider} />);

    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('renders correctly when provider has no avatar', () => {
    const routeWithoutAvatar = {
      params: {
        providerId: 'provider-1',
        provider: {
          name: 'Dr. Test',
          title: 'Test Title',
        },
      },
    } as any;

    const { getByText } = render(<ProviderProfileScreen navigation={mockNavigation} route={routeWithoutAvatar} />);

    expect(getByText('Dr. Test')).toBeTruthy();
    expect(getByText('Test Title')).toBeTruthy();
  });
});
