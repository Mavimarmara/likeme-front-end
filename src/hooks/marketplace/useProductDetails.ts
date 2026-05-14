import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from '@/hooks/i18n';
import { MARKETPLACE_PRODUCT_PLACEHOLDER_IMAGE_URI } from '@/constants';
import { productService, adService, storageService } from '@/services';
import { mapProductToCartItem, formatPrice } from '@/utils';
import type { Product as ApiProduct } from '@/types/product';
import { PRODUCT_CATALOG_TYPE } from '@/types/product';
import type { Ad } from '@/types/ad';
import type { ApiError } from '@/types/infrastructure';
import { logger } from '@/utils/logger';
import { buildApiProductFromRouteFallback, type RouteFallbackProduct } from '@/utils/marketplace/routeProductFallback';
import {
  enrichAdsProductsWithCategoriesFromByProductApi,
  enrichProductsWithCategoriesFromByProductApi,
} from './productCategoryEnrichment';

function isAdRequestNotFound(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  return (error as ApiError).status === 404;
}

async function redirectAmazonProductToAffiliateScreen(
  navigation: { replace: (screen: string, params: Record<string, unknown>) => void },
  productData: ApiProduct,
  productId: string,
): Promise<void> {
  const adsResponse = await adService.listAds({
    productId,
    activeOnly: true,
    limit: 1,
  });

  let firstAdId: string | undefined;
  if (adsResponse.success && adsResponse.data?.ads.length) {
    const [a] = await enrichAdsProductsWithCategoriesFromByProductApi([adsResponse.data.ads[0]]);
    firstAdId = a.id;
  }

  navigation.replace('AffiliateProduct', {
    productId,
    adId: firstAdId,
    product: {
      id: productData.id,
      title: productData.name,
      price: formatPrice(productData.price),
      image: productData.image || MARKETPLACE_PRODUCT_PLACEHOLDER_IMAGE_URI,
      type: productData.type,
      description: productData.description,
    },
  });
}

interface UseProductDetailsParams {
  productId: string | undefined;
  adId?: string;
  fallbackProduct?: RouteFallbackProduct;
  navigation: any;
  skipAmazonRedirect?: boolean;
  supplementalExternalUrl?: string;
}

interface UseProductDetailsReturn {
  product: ApiProduct | null;
  ad: Ad | null;
  /** ID do advertiser (parceiro) para navegação à ProviderProfile. */
  advertiserId: string | undefined;
  relatedProducts: ApiProduct[];
  loading: boolean;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  handleAddToCart: (quantity?: number) => Promise<void>;
  loadAd: () => Promise<void>;
}

export const useProductDetails = ({
  productId,
  adId,
  fallbackProduct,
  navigation,
  skipAmazonRedirect = false,
  supplementalExternalUrl,
}: UseProductDetailsParams): UseProductDetailsReturn => {
  const { t } = useTranslation();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [ad, setAd] = useState<Ad | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const advertiserId = product?.advertiserId ?? ad?.advertiserId;

  const mergeSupplementalExternalUrl = useCallback(
    (p: ApiProduct): ApiProduct => {
      const url = supplementalExternalUrl?.trim();
      if (!url || p.externalUrl) {
        return p;
      }
      return { ...p, externalUrl: url };
    },
    [supplementalExternalUrl],
  );

  const loadProduct = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const response = await productService.getProductById(productId);

      if (!response.success || !response.data) {
        return;
      }

      const [productData] = await enrichProductsWithCategoriesFromByProductApi([response.data]);

      if (productData.type === PRODUCT_CATALOG_TYPE.AMAZON && !skipAmazonRedirect) {
        await redirectAmazonProductToAffiliateScreen(navigation, productData, productId);
        return;
      }

      setProduct(mergeSupplementalExternalUrl(productData));
    } catch (error) {
      logger.error('[useProductDetails] Erro ao carregar produto', error);
      Alert.alert(t('errors.error'), t('errors.loadProductError'));
    } finally {
      setLoading(false);
    }
  }, [productId, navigation, skipAmazonRedirect, mergeSupplementalExternalUrl]);

  const loadRelatedProducts = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await productService.listProducts({
        limit: 5,
        type: fallbackProduct?.type,
      });

      if (response.success && response.data) {
        const enriched = await enrichProductsWithCategoriesFromByProductApi(response.data.products);
        setRelatedProducts(enriched.filter((p) => p.id !== productId));
      }
    } catch (error) {
      logger.error('[useProductDetails] Erro ao carregar produtos relacionados', error);
    }
  }, [productId, fallbackProduct?.type]);

  const loadAd = useCallback(async () => {
    try {
      if (adId) {
        try {
          const adDetailResponse = await adService.getAdById(adId);
          if (adDetailResponse.success && adDetailResponse.data) {
            const [adData] = await enrichAdsProductsWithCategoriesFromByProductApi([adDetailResponse.data]);
            setAd(adData);
            const nested = adData.product;
            if (nested) {
              setProduct((prev) => (prev ? prev : mergeSupplementalExternalUrl({ ...nested })));
            }
          } else {
            setAd(null);
          }
        } catch (error) {
          if (isAdRequestNotFound(error)) {
            logger.debug('[useProductDetails] Anúncio não encontrado (404)', { adId });
            setAd(null);
          } else {
            logger.error('[useProductDetails] Erro ao carregar ad', error);
          }
        }
        return;
      }

      if (!productId) return;

      const response = await adService.listAds({
        productId,
        activeOnly: true,
        limit: 1,
      });

      if (!response.success || !response.data?.ads.length) {
        setAd(null);
        return;
      }

      const [adData] = await enrichAdsProductsWithCategoriesFromByProductApi([response.data.ads[0]]);
      try {
        const adDetailResponse = await adService.getAdById(adData.id);
        if (adDetailResponse.success && adDetailResponse.data) {
          const [detailAd] = await enrichAdsProductsWithCategoriesFromByProductApi([adDetailResponse.data]);
          setAd(detailAd);
          return;
        }
        setAd(adData);
      } catch (error) {
        if (isAdRequestNotFound(error)) {
          logger.debug('[useProductDetails] Detalhe do anúncio indisponível (404), usando dados da listagem', {
            adId: adData.id,
          });
          setAd(adData);
          return;
        }
        logger.error('[useProductDetails] Erro ao carregar ad', error);
      }
    } catch (error) {
      if (isAdRequestNotFound(error)) {
        logger.debug('[useProductDetails] Anúncio não encontrado (404)', { productId });
        setAd(null);
        return;
      }
      logger.error('[useProductDetails] Erro ao carregar ad', error);
    }
  }, [productId, adId, mergeSupplementalExternalUrl]);

  const handleAddToCart = useCallback(
    async (quantity: number = 1) => {
      if (!product) return;

      if (product.status === 'out_of_stock' || product.quantity === 0) {
        Alert.alert(t('marketplace.outOfStock'), t('marketplace.productOutOfStockMessage'));
        return;
      }

      try {
        const cartItem = mapProductToCartItem(product);
        await storageService.addToCart(cartItem, quantity);
        navigation.navigate('Cart');
      } catch (error) {
        logger.error('[useProductDetails] Erro ao adicionar ao carrinho', error);
        Alert.alert(t('errors.error'), t('errors.addToCartError'));
      }
    },
    [product, navigation, t],
  );

  useEffect(() => {
    if (productId) {
      loadProduct();
      loadRelatedProducts();
    } else if (fallbackProduct) {
      const timestampsIso = new Date().toISOString();
      setProduct(mergeSupplementalExternalUrl(buildApiProductFromRouteFallback(fallbackProduct, timestampsIso)));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [
    productId,
    fallbackProduct?.id,
    fallbackProduct?.title,
    fallbackProduct?.price,
    fallbackProduct?.image,
    fallbackProduct?.type,
    fallbackProduct?.description,
    loadProduct,
    loadRelatedProducts,
    mergeSupplementalExternalUrl,
  ]);

  useEffect(() => {
    if (productId || adId) {
      void loadAd();
    }
  }, [productId, adId, loadAd]);

  return {
    product,
    ad,
    advertiserId,
    relatedProducts,
    loading,
    isFavorite,
    setIsFavorite,
    handleAddToCart,
    loadAd,
  };
};
