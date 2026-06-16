import React, { useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';
import { CachedImage } from '@/components/ui/media/CachedImage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { JoinCardList } from '@/components/ui/lists/JoinCardList';
import { ProductItemCard, type JoinCardItem } from '@/components/ui/cards';
import { SecondaryButton } from '@/components/ui/buttons';
import { COLORS } from '@/constants';
import { useTranslation } from '@/hooks/i18n';
import { adToJoinCardItem } from '@/utils/marketplace/adToJoinCardItem';
import { buildMarketplaceCategoryBadgeLabels } from '@/utils/marketplace/buildMarketplaceCategoryBadgeLabels';
import type { MarketplaceAdsBySolutionKind } from '@/utils/marketplace/groupMarketplaceAdsBySolutionKind';
import { styles as shoppingListStyles } from '@/components/sections/community/ShoppingList/styles';
import type { Ad, Advertiser } from '@/types/ad';
import type { CommunityCategory } from '@/types/community';
import { styles } from './styles';

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';

type MarketplaceProgramCardsRowProps = {
  ads: readonly Ad[];
  categories: readonly CommunityCategory[];
  onAdPress: (ad: Ad) => void;
  fallbackTitle: string;
};

export function MarketplaceProgramCardsRow({
  ads,
  categories,
  onAdPress,
  fallbackTitle,
}: MarketplaceProgramCardsRowProps) {
  const items = useMemo(
    (): JoinCardItem[] =>
      ads.map((ad) =>
        adToJoinCardItem(ad, {
          categories,
          includePrice: false,
          fallbackTitle,
        }),
      ),
    [ads, categories, fallbackTitle],
  );

  const handleItemPress = useCallback(
    (item: JoinCardItem) => {
      const ad = ads.find((entry) => entry.id === item.id);
      if (ad) {
        onAdPress(ad);
      }
    },
    [ads, onAdPress],
  );

  if (items.length === 0) {
    return null;
  }

  return <JoinCardList layout='list' items={items} onItemPress={handleItemPress} />;
}

type MarketplaceServiceCardsListProps = {
  ads: readonly Ad[];
  categories: readonly CommunityCategory[];
  onAdPress: (ad: Ad) => void;
  fallbackTitle: string;
};

export function MarketplaceServiceCardsList({
  ads,
  categories,
  onAdPress,
  fallbackTitle,
}: MarketplaceServiceCardsListProps) {
  const items = useMemo(
    (): JoinCardItem[] =>
      ads.map((ad) =>
        adToJoinCardItem(ad, {
          categories,
          includePrice: true,
          fallbackTitle,
        }),
      ),
    [ads, categories, fallbackTitle],
  );

  const handleItemPress = useCallback(
    (item: JoinCardItem) => {
      const ad = ads.find((entry) => entry.id === item.id);
      if (ad) {
        onAdPress(ad);
      }
    },
    [ads, onAdPress],
  );

  if (items.length === 0) {
    return null;
  }

  return <JoinCardList layout='list' square items={items} onItemPress={handleItemPress} />;
}

export type MarketplaceProductCardsListProps = {
  ads: readonly Ad[];
  categories: readonly CommunityCategory[];
  onAdPress: (ad: Ad) => void;
  fallbackTitle: string;
  outOfStockLabel: string;
};

export function MarketplaceProductCardsList({
  ads,
  categories,
  onAdPress,
  fallbackTitle,
  outOfStockLabel,
}: MarketplaceProductCardsListProps) {
  if (ads.length === 0) {
    return null;
  }

  return (
    <View style={styles.productsList}>
      {ads.map((ad) => {
        const product = ad.product;
        const title = product?.name?.trim() || fallbackTitle;
        const image = product?.image?.trim() || DEFAULT_PRODUCT_IMAGE;
        const badges = buildMarketplaceCategoryBadgeLabels(product, categories);

        return (
          <ProductItemCard
            key={ad.id}
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
      })}
    </View>
  );
}

export type MarketplaceProfessionalsBlockProps = {
  professionals: readonly Advertiser[];
  onProfessionalPress: (advertiser: Advertiser) => void;
  viewProfileLabel: string;
};

export function MarketplaceProfessionalsBlock({
  professionals,
  onProfessionalPress,
  viewProfileLabel,
}: MarketplaceProfessionalsBlockProps) {
  if (professionals.length === 0) {
    return null;
  }

  return (
    <View style={shoppingListStyles.list}>
      {professionals.map((advertiser) => (
        <View key={advertiser.id} style={shoppingListStyles.professionalCardWrapper}>
          <View style={shoppingListStyles.professionalCardContent}>
            {advertiser.logo ? (
              <CachedImage source={{ uri: advertiser.logo }} style={shoppingListStyles.professionalAvatar} />
            ) : (
              <View style={shoppingListStyles.professionalAvatarPlaceholder}>
                <Icon name='person' size={32} color={COLORS.NEUTRAL.LOW.MEDIUM} />
              </View>
            )}
            <View style={shoppingListStyles.professionalInfo}>
              <Text style={shoppingListStyles.professionalName} numberOfLines={1}>
                {advertiser.name ?? ''}
              </Text>
              {advertiser.description ? (
                <Text style={shoppingListStyles.professionalProfession}>{advertiser.description}</Text>
              ) : null}
            </View>
            <SecondaryButton
              label={viewProfileLabel}
              onPress={() => onProfessionalPress(advertiser)}
              size='medium'
              style={shoppingListStyles.professionalViewProfileButton}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

export type MarketplaceCategoryBlocksProps = {
  groupedAds: MarketplaceAdsBySolutionKind;
  programAds: readonly Ad[];
  professionals: readonly Advertiser[];
  categories: readonly CommunityCategory[];
  onAdPress: (ad: Ad) => void;
  onProfessionalPress: (advertiser: Advertiser) => void;
};

const MarketplaceCategoryBlocks: React.FC<MarketplaceCategoryBlocksProps> = ({
  groupedAds,
  programAds,
  professionals,
  categories,
  onAdPress,
  onProfessionalPress,
}) => {
  const { t } = useTranslation();
  const fallbackTitle = t('marketplace.product', { defaultValue: 'Product' });
  const outOfStockLabel = t('marketplace.outOfStock', { defaultValue: 'Out of stock' });
  const viewProfileLabel = t('community.viewProfile');

  return (
    <>
      {groupedAds.product.length > 0 ? (
        <View style={styles.section} testID='marketplace-block-products'>
          <Text style={styles.sectionTitle}>{t('filterCategory.solutions.products')}</Text>
          <MarketplaceProductCardsList
            ads={groupedAds.product}
            categories={categories}
            onAdPress={onAdPress}
            fallbackTitle={fallbackTitle}
            outOfStockLabel={outOfStockLabel}
          />
        </View>
      ) : null}

      {professionals.length > 0 ? (
        <View style={styles.section} testID='marketplace-block-professionals'>
          <Text style={styles.sectionTitle}>{t('filterCategory.solutions.professionals')}</Text>
          <MarketplaceProfessionalsBlock
            professionals={professionals}
            onProfessionalPress={onProfessionalPress}
            viewProfileLabel={viewProfileLabel}
          />
        </View>
      ) : null}

      {groupedAds.service.length > 0 ? (
        <View style={styles.section} testID='marketplace-block-services'>
          <Text style={styles.sectionTitle}>{t('filterCategory.solutions.services')}</Text>
          <MarketplaceServiceCardsList
            ads={groupedAds.service}
            categories={categories}
            onAdPress={onAdPress}
            fallbackTitle={fallbackTitle}
          />
        </View>
      ) : null}

      {programAds.length > 0 ? (
        <View style={styles.section} testID='marketplace-block-programs'>
          <Text style={styles.sectionTitle}>{t('filterCategory.solutions.programs')}</Text>
          <MarketplaceProgramCardsRow
            ads={programAds}
            categories={categories}
            onAdPress={onAdPress}
            fallbackTitle={fallbackTitle}
          />
        </View>
      ) : null}
    </>
  );
};

export default MarketplaceCategoryBlocks;
