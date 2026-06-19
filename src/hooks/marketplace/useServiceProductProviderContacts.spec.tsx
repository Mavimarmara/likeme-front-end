import { renderHook, waitFor } from '@testing-library/react-native';
import { useProductDetails } from './useProductDetails';
import { useProductPartner } from './useProductPartner';
import { productService, adService } from '@/services';
import advertiserService from '@/services/advertiser/advertiserService';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';

jest.mock('@/hooks/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@/services', () => ({
  productService: {
    getProductById: jest.fn(),
    listProducts: jest.fn(),
  },
  adService: {
    getAdById: jest.fn(),
    listAds: jest.fn(),
  },
}));

jest.mock('@/services/advertiser/advertiserService', () => ({
  __esModule: true,
  default: {
    getAdvertiserById: jest.fn(),
  },
}));

jest.mock('@/services/auth/storageService', () => ({
  __esModule: true,
  default: { addToCart: jest.fn() },
  PROGRAM_ALREADY_IN_CART_ERROR: 'PROGRAM_ALREADY_IN_CART',
}));

jest.mock('@/utils/profile/protocolProduct', () => ({
  isProtocolProductCatalogType: jest.fn(() => false),
  userHasActiveProtocolProduct: jest.fn(),
}));

jest.mock('@/utils/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

function useServiceProductProviderContacts(params: {
  productId: string;
  navigation: { navigate: jest.Mock; replace: jest.Mock };
}) {
  const details = useProductDetails(params);
  const partner = useProductPartner({
    product: details.product,
    ad: details.ad,
    advertiserId: details.advertiserId,
  });

  return {
    loading: details.loading,
    ad: details.ad,
    advertiserId: details.advertiserId,
    partnerContacts: partner.partnerContacts,
  };
}

describe('useServiceProductProviderContacts', () => {
  const navigation = {
    navigate: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (productService.listProducts as jest.Mock).mockResolvedValue({
      success: true,
      data: { products: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0 } },
    });

    (adService.listAds as jest.Mock).mockImplementation(
      () =>
        new Promise(() => {
          /* ad ainda carregando */
        }),
    );

    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'svc-1',
        name: 'Consulta',
        type: PRODUCT_CATALOG_TYPE.SERVICE,
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        ads: [
          {
            id: 'ad-embedded',
            advertiserId: 'adv-embedded',
            status: 'active',
            createdAt: '',
            updatedAt: '',
          },
        ],
      },
    });

    (advertiserService.getAdvertiserById as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'adv-embedded',
        name: 'Provider Real',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        contacts: [{ type: 'email', value: 'real@provider.com' }],
      },
    });
  });

  it('carrega contatos do provider a partir de product.ads antes do ad detalhado', async () => {
    const { result } = renderHook(() =>
      useServiceProductProviderContacts({
        productId: 'svc-1',
        navigation,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 8000 });

    expect(result.current.ad).toBeNull();
    expect(result.current.advertiserId).toBe('adv-embedded');

    await waitFor(() => {
      expect(result.current.partnerContacts).toEqual([{ type: 'email', value: 'real@provider.com' }]);
    });

    expect(advertiserService.getAdvertiserById).toHaveBeenCalledWith('adv-embedded');
  });
});
