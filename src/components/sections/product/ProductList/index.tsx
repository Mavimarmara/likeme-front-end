import { View, type StyleProp, type ViewStyle } from 'react-native';
import { ProductRowCard } from '@/components/ui/cards';
import { buildMarketplaceCategoryBadgeLabels } from '@/utils/marketplace/buildMarketplaceCategoryBadgeLabels';
import type { Ad } from '@/types/ad';
import type { CommunityCategory } from '@/types/community';
import { styles } from './styles';

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

export type ProductListItemProps = {
  ad: Ad;
  categories: readonly CommunityCategory[];
  onAdPress: (ad: Ad) => void;
  fallbackTitle: string;
  outOfStockLabel: string;
};

export function ProductListItem({ ad, categories, onAdPress, fallbackTitle, outOfStockLabel }: ProductListItemProps) {
  const product = ad.product;
  const title = product?.name?.trim() || fallbackTitle;
  const image = product?.image?.trim() || DEFAULT_PRODUCT_IMAGE;
  const badges = buildMarketplaceCategoryBadgeLabels(product, categories);

  return (
    <ProductRowCard
      image={image}
      title={title}
      badges={badges}
      price={product?.price}
      outOfStock={product?.status === 'out_of_stock'}
      outOfStockLabel={outOfStockLabel}
      onPress={() => onAdPress(ad)}
      showTrailingChevron={!!product}
      testID={`marketplace-product-card-${ad.id}`}
    />
  );
}

export type ProductListProps = {
  ads: readonly Ad[];
  categories: readonly CommunityCategory[];
  onAdPress: (ad: Ad) => void;
  fallbackTitle: string;
  outOfStockLabel: string;
  listStyle?: StyleProp<ViewStyle>;
};

export function ProductList({
  ads,
  categories,
  onAdPress,
  fallbackTitle,
  outOfStockLabel,
  listStyle,
}: ProductListProps) {
  if (ads.length === 0) {
    return null;
  }

  return (
    <View style={[styles.list, listStyle]}>
      {ads.map((ad) => (
        <ProductListItem
          key={ad.id}
          ad={ad}
          categories={categories}
          onAdPress={onAdPress}
          fallbackTitle={fallbackTitle}
          outOfStockLabel={outOfStockLabel}
        />
      ))}
    </View>
  );
}

export default ProductList;
