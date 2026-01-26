import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from '@/hooks/i18n';
import { productService, adService, storageService } from '@/services';
import { mapProductToCartItem, formatPrice } from '@/utils';
import type { Product as ApiProduct } from '@/types/product';
import type { Ad } from '@/types/ad';

interface UseProductDetailsParams {
  productId: string | undefined;
  fallbackProduct?: {
    id: string;
    title: string;
    price: string;
    image: string;
    category?: string;
    description?: string;
  };
  navigation: any;
}

interface UseProductDetailsReturn {
  product: ApiProduct | null;
  ad: Ad | null;
  relatedProducts: ApiProduct[];
  loading: boolean;
  isFavorite: boolean;
  setIsFavorite: (value: boolean) => void;
  handleAddToCart: () => Promise<void>;
  loadAd: () => Promise<void>;
}

export const useProductDetails = ({
  productId,
  fallbackProduct,
  navigation,
}: UseProductDetailsParams): UseProductDetailsReturn => {
  const { t } = useTranslation();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [ad, setAd] = useState<Ad | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const loadProduct = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const response = await productService.getProductById(productId);

      if (!response.success || !response.data) {
        setLoading(false);
        return;
      }

      const productData = response.data;

      if (productData.category === 'amazon product') {
        await handleAmazonProductRedirect(productData, productId, navigation);
        return;
      }

      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert(t('errors.error'), t('errors.loadProductError'));
    } finally {
      setLoading(false);
    }
  }, [productId, navigation]);

  const handleAmazonProductRedirect = async (
    productData: ApiProduct,
    productId: string,
    nav: any
  ) => {
    const adsResponse = await adService.listAds({
      productId,
      activeOnly: true,
      limit: 1,
    });

    const adId =
      adsResponse.success && adsResponse.data?.ads.length > 0
        ? adsResponse.data.ads[0].id
        : undefined;

    nav.replace('AffiliateProduct', {
      productId,
      adId,
      product: {
        id: productData.id,
        title: productData.name,
        price: formatPrice(productData.price),
        image:
          productData.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        category: productData.category,
        description: productData.description,
      },
    });
  };

  const loadRelatedProducts = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await productService.listProducts({
        limit: 5,
        category: fallbackProduct?.category,
      });

      if (response.success && response.data) {
        setRelatedProducts(response.data.products.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error('Error loading related products:', error);
    }
  }, [productId, fallbackProduct?.category]);

  const loadAd = useCallback(async () => {
    if (!productId) return;

    try {
      const response = await adService.listAds({
        productId,
        activeOnly: true,
        limit: 1,
      });

      if (!response.success || !response.data?.ads.length) return;

      const adData = response.data.ads[0];
      const adDetailResponse = await adService.getAdById(adData.id);

      if (adDetailResponse.success && adDetailResponse.data) {
        setAd(adDetailResponse.data);
        return;
      }

      setAd(adData);
    } catch (error) {
      console.error('Error loading ad:', error);
    }
  }, [productId]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;

    if (product.status === 'out_of_stock' || product.quantity === 0) {
      Alert.alert(t('marketplace.outOfStock'), t('marketplace.productOutOfStockMessage'));
      return;
    }

    try {
      const cartItem = mapProductToCartItem(product);
      await storageService.addToCart(cartItem);
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert(t('errors.error'), t('errors.addToCartError'));
    }
  }, [product, navigation]);

  useEffect(() => {
    if (productId) {
      loadProduct();
      loadRelatedProducts();
      return;
    }

    if (fallbackProduct) {
      setProduct({
        id: fallbackProduct.id,
        name: fallbackProduct.title,
        description: fallbackProduct.description,
        price: parseFloat(fallbackProduct.price.replace('$', '').replace(',', '')),
        image: fallbackProduct.image,
        category: fallbackProduct.category,
        quantity: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [productId, fallbackProduct, loadProduct, loadRelatedProducts]);

  return {
    product,
    ad,
    relatedProducts,
    loading,
    isFavorite,
    setIsFavorite,
    handleAddToCart,
    loadAd,
  };
};
