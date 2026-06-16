import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/feedback';
import { COLORS, SPACING } from '@/constants';
import { PRODUCT_ROW_CARD_HEIGHT } from '@/components/ui/cards/ProductRowCard/styles';

/**
 * Placeholder com a silhueta de um ProductRowCard. Usado no loading inicial
 * da AdsList (Marketplace/Community shop), no lugar do ActivityIndicator
 * de tela cheia.
 */
const ProductRowCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <Skeleton width={108} height={PRODUCT_ROW_CARD_HEIGHT} borderRadius={22} />

      <View style={styles.contentColumn}>
        <Skeleton width='85%' height={14} borderRadius={6} />
        <Skeleton width='55%' height={12} borderRadius={6} />

        <View style={styles.badgesRow}>
          <Skeleton width={48} height={16} borderRadius={8} />
          <Skeleton width={48} height={16} borderRadius={8} />
        </View>

        <Skeleton width={88} height={16} borderRadius={6} style={styles.priceMark} />
      </View>

      <View style={styles.actionColumn}>
        <Skeleton width={44} height={44} borderRadius={22} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    height: PRODUCT_ROW_CARD_HEIGHT,
    overflow: 'hidden',
    backgroundColor: COLORS.NEUTRAL.HIGH.LIGHT,
    borderRadius: 22,
    paddingRight: SPACING.SM,
    gap: SPACING.MD,
  },
  contentColumn: {
    flex: 1,
    gap: SPACING.XS,
  },
  actionColumn: {
    justifyContent: 'flex-end',
    paddingVertical: SPACING.MD,
    marginRight: SPACING.SM,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: SPACING.XS,
    marginTop: 4,
  },
  priceMark: {
    marginTop: 4,
  },
});

export default ProductRowCardSkeleton;
