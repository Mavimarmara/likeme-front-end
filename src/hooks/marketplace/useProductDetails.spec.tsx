import { renderHook, waitFor } from '@testing-library/react-native';
import { useProductDetails } from './useProductDetails';
import { productService, adService } from '@/services';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import type { Product as ApiProduct } from '@/types/product';

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
  storageService: {
    addToCart: jest.fn(),
  },
}));

jest.mock('@/utils/logger', () => ({
  logger: { error: jest.fn(), warn: jest.fn(), debug: jest.fn() },
}));

const physicalProduct = (overrides: Partial<ApiProduct> = {}): ApiProduct => ({
  id: 'p-1',
  name: 'Produto físico',
  description: 'Desc',
  price: 29.99,
  image: 'https://img.example/p.jpg',
  type: PRODUCT_CATALOG_TYPE.PHYSICAL,
  quantity: 3,
  status: 'active',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('useProductDetails', () => {
  const navigation = {
    replace: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (productService.listProducts as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        products: [],
        pagination: { page: 1, limit: 5, total: 0, totalPages: 0 },
      },
    });
    (adService.listAds as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        ads: [],
        pagination: { page: 1, limit: 1, total: 0, totalPages: 0 },
      },
    });
    (adService.getAdById as jest.Mock).mockResolvedValue({ success: false, data: null });
  });

  it('carrega produto físico, chama API e encerra loading', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: physicalProduct(),
    });

    const { result } = renderHook(() =>
      useProductDetails({
        productId: 'p-1',
        navigation,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 8000 });
    expect(productService.getProductById).toHaveBeenCalledWith('p-1');
    expect(result.current.product?.name).toBe('Produto físico');
  });

  it('produto Amazon sem skipAmazonRedirect redireciona para AffiliateProduct', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: physicalProduct({
        id: 'amz-1',
        name: 'Amazon item',
        type: PRODUCT_CATALOG_TYPE.AMAZON,
        externalUrl: 'https://amazon.com/dp/TEST',
      }),
    });
    (adService.listAds as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        ads: [{ id: 'ad-42', productId: 'amz-1' }],
        pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
      },
    });

    renderHook(() =>
      useProductDetails({
        productId: 'amz-1',
        navigation,
        skipAmazonRedirect: false,
      }),
    );

    await waitFor(() => expect(navigation.replace).toHaveBeenCalled(), { timeout: 8000 });
    expect(navigation.replace).toHaveBeenCalledWith(
      'AffiliateProduct',
      expect.objectContaining({
        productId: 'amz-1',
        adId: 'ad-42',
      }),
    );
  });

  it('produto Amazon com skipAmazonRedirect não chama replace e expõe o produto', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: physicalProduct({
        id: 'amz-2',
        name: 'Só afiliado',
        type: PRODUCT_CATALOG_TYPE.AMAZON,
      }),
    });

    const { result } = renderHook(() =>
      useProductDetails({
        productId: 'amz-2',
        navigation,
        skipAmazonRedirect: true,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 8000 });
    expect(navigation.replace).not.toHaveBeenCalled();
    expect(result.current.product?.type).toBe(PRODUCT_CATALOG_TYPE.AMAZON);
    expect(result.current.product?.name).toBe('Só afiliado');
  });

  it('sem productId usa fallbackProduct e não chama getProductById', async () => {
    const { result } = renderHook(() =>
      useProductDetails({
        productId: undefined,
        navigation,
        fallbackProduct: {
          id: 'fb-1',
          title: 'Do card',
          price: '$9.00',
          image: 'https://img.example/fb.jpg',
          type: PRODUCT_CATALOG_TYPE.AMAZON,
        },
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 8000 });
    expect(productService.getProductById).not.toHaveBeenCalled();
    expect(result.current.product?.name).toBe('Do card');
    expect(result.current.product?.price).toBe(9);
  });

  it('supplementalExternalUrl preenche quando o produto da API não tem externalUrl', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: physicalProduct({ externalUrl: undefined }),
    });

    const { result } = renderHook(() =>
      useProductDetails({
        productId: 'p-1',
        navigation,
        supplementalExternalUrl: 'https://amazon.com/p/reserva',
      }),
    );

    await waitFor(() => expect(result.current.product?.externalUrl).toBe('https://amazon.com/p/reserva'), {
      timeout: 8000,
    });
  });

  it('com adId chama getAdById', async () => {
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: physicalProduct(),
    });
    (adService.getAdById as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        id: 'ad-1',
        productId: 'p-1',
        status: 'active',
        createdAt: '',
        updatedAt: '',
        product: physicalProduct({ name: 'Do anúncio' }),
      },
    });

    renderHook(() =>
      useProductDetails({
        productId: 'p-1',
        adId: 'ad-1',
        navigation,
      }),
    );

    await waitFor(() => expect(adService.getAdById).toHaveBeenCalledWith('ad-1'), { timeout: 8000 });
  });
});
