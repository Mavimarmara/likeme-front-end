import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { ProductItemCard } from '@/components/ui/cards';
import { FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { useCategories } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { formatPrice, handleAdNavigation, mapProductToCartItem } from '@/utils';
import { storageService } from '@/services';
import type { Ad } from '@/types/ad';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

type ProductsListProps = {
  navigation: StackNavigationProp<RootStackParamList, keyof RootStackParamList>;
  ads: Ad[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  orderOptions?: ButtonCarouselOption<string>[];
  selectedOrder?: string;
  onOrderSelect?: (id: string) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
  title?: string;
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

const ProductsList: React.FC<ProductsListProps> = ({
  navigation,
  ads,
  loading,
  hasMore,
  onLoadMore,
  orderOptions = [],
  selectedOrder = '',
  onOrderSelect,
  contentContainerStyle,
  title,
}) => {
  const { t } = useTranslation();
  const { categories } = useCategories({ enabled: true });

  const handleAdPress = (ad: Ad) => {
    handleAdNavigation(ad, navigation);
  };

  const handleAddToCart = async (ad: Ad) => {
    if (!ad.product) return;
    try {
      const cartItem = mapProductToCartItem(ad.product);
      await storageService.addToCart(cartItem);
      navigation.navigate('Cart');
    } catch {}
  };

  const sectionTitle = title ?? t('marketplace.allProducts');

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
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      </View>
      {orderOptions.length > 0 && (
        <View style={styles.mOrderFilterMenuContainer}>
          <FilterMenu
            filterButtonLabel={t('marketplace.orderBy')}
            onFilterButtonPress={() => undefined}
            carouselOptions={orderOptions}
            selectedCarouselId={selectedOrder}
            onCarouselSelect={onOrderSelect ?? (() => undefined)}
          />
        </View>
      )}
      <View style={styles.mProductsList}>
        {ads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('marketplace.noAdsFound')}</Text>
          </View>
        ) : (
          <>
            {ads.map((ad) => {
              const product = ad.product;
              const displayName = product?.name || t('marketplace.product', { defaultValue: 'Product' });
              const displayImage = product?.image || DEFAULT_IMAGE;
              const displayCategory = product?.categoryId
                ? categories.find((c) => c.categoryId === product.categoryId)?.name
                : undefined;
              const productPrice = product?.price;
              return (
                <ProductItemCard
                  key={ad.id}
                  image={displayImage}
                  title={displayName}
                  badges={[displayCategory]}
                  price={productPrice}
                  outOfStock={product?.status === 'out_of_stock'}
                  outOfStockLabel={t('marketplace.outOfStock', { defaultValue: 'Out of stock' })}
                  onPress={() => handleAdPress(ad)}
                  onAddPress={product && !product.externalUrl ? () => handleAddToCart(ad) : undefined}
                  showAddButton={!!(product && !product.externalUrl)}
                  formatPrice={formatPrice}
                />
              );
            })}
            {loading && (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size='small' color='#2196F3' />
              </View>
            )}
            {hasMore && !loading && (
              <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore} activeOpacity={0.7}>
                <Text style={styles.loadMoreText}>{t('marketplace.loadMore')}</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default ProductsList;
