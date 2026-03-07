import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IconButton } from '@/components/ui/buttons';
import { FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { useProviderAds, useCategories } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice, handleAdNavigation, mapProductToCartItem } from '@/utils';
import { storageService } from '@/services';
import type { Ad } from '@/types/ad';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

/** Modo com advertiserId: busca e lista produtos do provider. Modo com ads: lista controlada pelo pai (ex: MarketplaceScreen). */
type ProductsListProps = {
  navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  title?: string;
  /** Modo provider: lista produtos deste advertiser. */
  advertiserId?: string | undefined;
  /** Modo controlado: usa estes dados em vez de useProviderAds. */
  ads?: Ad[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  /** Estilo do container da lista (ex: styles.productsList no Marketplace). */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Modo marketplace: exibe "Todos os produtos" + FilterMenu ordenação + layout da tela Marketplace. */
  orderOptions?: ButtonCarouselOption<string>[];
  selectedOrder?: string;
  onOrderSelect?: (id: string) => void;
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

const ProductsList: React.FC<ProductsListProps> = ({
  navigation,
  title,
  advertiserId,
  ads: controlledAds,
  loading: controlledLoading,
  hasMore: controlledHasMore,
  onLoadMore,
  contentContainerStyle,
  orderOptions,
  selectedOrder,
  onOrderSelect,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const { categories } = useCategories({ enabled: true });
  const providerAds = useProviderAds({
    advertiserId,
    page,
    limit: 20,
  });

  const isControlled = controlledAds !== undefined;
  const ads = isControlled ? controlledAds : providerAds.ads;
  const loading = isControlled ? controlledLoading ?? false : providerAds.loading;
  const hasMore = isControlled ? controlledHasMore ?? false : providerAds.hasMore;
  const loadAds = providerAds.loadAds;

  useEffect(() => {
    if (advertiserId) {
      setPage(1);
    }
  }, [advertiserId]);

  useEffect(() => {
    if (advertiserId) {
      loadAds();
    }
  }, [advertiserId, page, loadAds]);

  const handleAdPress = (ad: Ad) => {
    handleAdNavigation(ad, navigation);
  };

  const handleAddToCart = async (ad: Ad, event?: any) => {
    if (event) event.stopPropagation();
    if (!ad.product) return;
    try {
      const cartItem = mapProductToCartItem(ad.product);
      await storageService.addToCart(cartItem);
      navigation.navigate('Cart');
    } catch {
      // error handling
    }
  };

  if (!isControlled && !advertiserId) {
    return null;
  }

  const isMarketplaceMode = isControlled && orderOptions != null;

  if (isMarketplaceMode) {
    if (loading && ads.length === 0) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#2196F3' />
          <Text style={styles.loadingText}>{t('marketplace.loadingAds')}</Text>
        </View>
      );
    }
    return (
      <View style={[styles.section, styles.sectionMarketplace, contentContainerStyle]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('marketplace.allProducts')}</Text>
        </View>
        <View style={styles.mOrderFilterMenuContainer}>
          <FilterMenu
            filterButtonLabel={t('marketplace.orderBy')}
            onFilterButtonPress={() => undefined}
            carouselOptions={orderOptions ?? []}
            selectedCarouselId={selectedOrder ?? ''}
            onCarouselSelect={onOrderSelect ?? (() => undefined)}
          />
        </View>
        <View style={styles.mProductsList}>
          {ads.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('marketplace.noAdsFound')}</Text>
            </View>
          ) : (
            <>
              {ads.map((ad) => {
                const product = ad.product;
                const displayTitle = product?.name || t('marketplace.product', { defaultValue: 'Product' });
                const displayImage = product?.image || DEFAULT_IMAGE;
                const displayCategory = product?.categoryId
                  ? categories.find((c) => c.categoryId === product.categoryId)?.name
                  : undefined;
                const productPrice = product?.price;
                return (
                  <TouchableOpacity
                    key={ad.id}
                    style={styles.mProductRow}
                    onPress={() => handleAdPress(ad)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: displayImage }} style={styles.mProductRowImage} />
                    <View style={styles.mProductRowContent}>
                      {displayCategory && (
                        <View style={styles.mProductRowCategory}>
                          <Text style={styles.mProductRowCategoryText}>{displayCategory}</Text>
                        </View>
                      )}
                      <Text style={styles.mProductRowTitle}>{displayTitle}</Text>
                      <View style={styles.mProductRowFooter}>
                        {productPrice !== undefined && (
                          <Text style={styles.mProductRowPrice}>{formatPrice(productPrice)}</Text>
                        )}
                        {product?.status === 'out_of_stock' && (
                          <Text style={styles.outOfStockText}>{t('marketplace.outOfStock')}</Text>
                        )}
                      </View>
                    </View>
                    {product && !product.externalUrl && (
                      <TouchableOpacity
                        style={styles.mProductRowAddButton}
                        activeOpacity={0.7}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleAddToCart(ad, e);
                        }}
                      >
                        <Icon name='add' size={24} color='#000' />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}
              {loading && (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator size='small' color='#2196F3' />
                </View>
              )}
              {hasMore && !loading && (
                <TouchableOpacity
                  style={styles.loadMoreButton}
                  onPress={onLoadMore ?? (() => undefined)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loadMoreText}>{t('marketplace.loadMore')}</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    );
  }

  const displayTitle = title ?? t('marketplace.productsRecommend', { defaultValue: 'Products I recommend' });

  const handleLoadMore = isControlled ? onLoadMore : () => setPage((p) => p + 1);
  const isLoadingFirstPage = isControlled ? loading && ads.length === 0 : loading && page === 1;

  const listContent = (
    <>
      {ads.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('marketplace.noAdsFound', { defaultValue: 'No products found' })}</Text>
        </View>
      ) : (
        <View style={styles.productsList}>
          {ads.map((ad) => {
            const product = ad.product;
            const displayName = product?.name || t('marketplace.product', { defaultValue: 'Product' });
            const displayImage = product?.image || DEFAULT_IMAGE;
            const displayCategory = product?.categoryId
              ? categories.find((c) => c.categoryId === product.categoryId)?.name
              : undefined;
            const productPrice = product?.price;

            return (
              <TouchableOpacity
                key={ad.id}
                style={styles.productRow}
                onPress={() => handleAdPress(ad)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: displayImage }} style={styles.productRowImage} />
                <View style={styles.productRowContent}>
                  <View style={styles.productRowTopRow}>
                    {displayCategory ? (
                      <View style={styles.productRowCategory}>
                        <Text style={styles.productRowCategoryText}>{displayCategory}</Text>
                      </View>
                    ) : (
                      <View />
                    )}
                    <View style={styles.productRowRating}>
                      <Text style={styles.productRowRatingText}>{(product as any)?.rating ?? '–'}</Text>
                      <Icon name='star' size={18} color='#001137' />
                    </View>
                  </View>
                  <View style={styles.productRowBottomRow}>
                    <View style={styles.productRowTextBlock}>
                      <Text style={styles.productRowTitle} numberOfLines={1}>
                        {displayName}
                      </Text>
                      <View>
                        {product?.status === 'out_of_stock' ? (
                          <Text style={styles.outOfStockText}>
                            {t('marketplace.outOfStock', { defaultValue: 'Out of stock' })}
                          </Text>
                        ) : (
                          productPrice !== undefined && (
                            <Text style={styles.productRowPrice}>{formatPrice(productPrice)}</Text>
                          )
                        )}
                      </View>
                    </View>
                    {product && !product.externalUrl && (
                      <IconButton
                        icon='add'
                        iconColor='#001137'
                        iconSize={24}
                        backgroundSize='large'
                        onPress={() => handleAddToCart(ad)}
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {loading && !isControlled && page > 1 && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size='small' color='#2196F3' />
            </View>
          )}
          {isControlled && loading && ads.length > 0 && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size='small' color='#2196F3' />
            </View>
          )}
          {hasMore && !loading && (
            <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore} activeOpacity={0.7}>
              <Text style={styles.loadMoreText}>{t('marketplace.loadMore', { defaultValue: 'Load more' })}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );

  return (
    <View style={[styles.section, contentContainerStyle]}>
      {!isControlled && <Text style={styles.sectionTitle}>{displayTitle}</Text>}

      {isLoadingFirstPage ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='small' color='#2196F3' />
        </View>
      ) : (
        listContent
      )}
    </View>
  );
};

export default ProductsList;
