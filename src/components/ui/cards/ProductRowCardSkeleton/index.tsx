import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/feedback';
import { COLORS, SPACING } from '@/constants';

/**
 * Placeholder com a silhueta de um ProductRowCard. Usado no loading inicial
 * da AdsList (Marketplace/Community shop), no lugar do ActivityIndicator
 * de tela cheia.
 */
const ProductRowCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <Skeleton width={88} height={88} borderRadius={12} />

      <View style={styles.bodyColumn}>
        <Skeleton width='85%' height={14} borderRadius={6} />
        <Skeleton width='55%' height={12} borderRadius={6} />

        <View style={styles.badgesRow}>
          <Skeleton width={48} height={16} borderRadius={8} />
          <Skeleton width={48} height={16} borderRadius={8} />
        </View>

        <Skeleton width={88} height={16} borderRadius={6} style={styles.priceMark} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.NEUTRAL.HIGH.LIGHT,
    borderRadius: 16,
    padding: SPACING.SM,
    gap: SPACING.MD,
  },
  bodyColumn: {
    flex: 1,
    gap: SPACING.XS,
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
