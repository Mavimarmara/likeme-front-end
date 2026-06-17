import { renderHook, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
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
}));

jest.mock('@/services/auth/storageService', () => ({
  __esModule: true,
  default: {
    addToCart: jest.fn(),
  },
  PROGRAM_ALREADY_IN_CART_ERROR: 'PROGRAM_ALREADY_IN_CART',
}));

jest.mock('@/utils/profile/protocolProduct', () => ({
  isProtocolProductCatalogType: jest.fn((type?: string | null) => type === 'program'),
  userHasActiveProtocolProduct: jest.fn(),
}));

import storageService, { PROGRAM_ALREADY_IN_CART_ERROR } from '@/services/auth/storageService';
import { userHasActiveProtocolProduct } from '@/utils/profile/protocolProduct';

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

  it('protocolo já no carrinho exibe alerta e não navega', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    (userHasActiveProtocolProduct as jest.Mock).mockResolvedValue(false);
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: physicalProduct({
        id: 'prog-1',
        type: PRODUCT_CATALOG_TYPE.PROGRAM,
      }),
    });
    (storageService.addToCart as jest.Mock).mockRejectedValue(new Error(PROGRAM_ALREADY_IN_CART_ERROR));

    const { result } = renderHook(() =>
      useProductDetails({
        productId: 'prog-1',
        navigation,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 8000 });

    await result.current.handleAddToCart(1);

    expect(Alert.alert).toHaveBeenCalledWith('errors.error', 'marketplace.programAlreadyInCart');
    expect(navigation.navigate).not.toHaveBeenCalled();
  });

  it('protocolo adiciona ao carrinho com quantidade 1', async () => {
    (userHasActiveProtocolProduct as jest.Mock).mockResolvedValue(false);
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: physicalProduct({
        id: 'prog-2',
        type: PRODUCT_CATALOG_TYPE.PROGRAM,
      }),
    });
    (storageService.addToCart as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useProductDetails({
        productId: 'prog-2',
        navigation,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 8000 });

    await result.current.handleAddToCart(5);

    expect(storageService.addToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 'prog-2' }), 1);
    expect(navigation.navigate).toHaveBeenCalledWith('Cart');
  });

  it('protocolo já assinado exibe alerta e não adiciona ao carrinho', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    (userHasActiveProtocolProduct as jest.Mock).mockResolvedValue(true);
    (productService.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: physicalProduct({
        id: 'prog-owned',
        type: PRODUCT_CATALOG_TYPE.PROGRAM,
      }),
    });

    const { result } = renderHook(() =>
      useProductDetails({
        productId: 'prog-owned',
        navigation,
      }),
    );

    await waitFor(() => expect(result.current.loading).toBe(false), { timeout: 8000 });

    await result.current.handleAddToCart(1);

    expect(Alert.alert).toHaveBeenCalledWith('errors.error', 'marketplace.programAlreadySubscribed');
    expect(storageService.addToCart).not.toHaveBeenCalled();
    expect(navigation.navigate).not.toHaveBeenCalled();
  });
});
