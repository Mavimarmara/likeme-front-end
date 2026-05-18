import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/feedback';
import { COLORS, SPACING } from '@/constants';

/**
 * Placeholder com a mesma silhueta de um PostCard. Usado em ListEmptyComponent
 * enquanto o primeiro fetch do feed esta em voo — substitui o spinner
 * generico, reduzindo a sensacao de tela em branco.
 */
const PostCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <Skeleton width={120} height={20} borderRadius={10} />

      <View style={styles.authorRow}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <Skeleton width={140} height={14} borderRadius={7} />
      </View>

      <View style={styles.textColumn}>
        <Skeleton width='90%' height={16} borderRadius={8} />
        <Skeleton width='75%' height={12} borderRadius={6} />
        <Skeleton width='60%' height={12} borderRadius={6} />
      </View>

      <Skeleton width='100%' height={180} borderRadius={12} />

      <View style={styles.footerRow}>
        <Skeleton width={56} height={20} borderRadius={10} />
        <Skeleton width={56} height={20} borderRadius={10} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbf7e5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 32,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.LG,
    paddingHorizontal: SPACING.MD,
    gap: SPACING.SM,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
  },
  textColumn: {
    gap: SPACING.XS,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.SM,
    marginTop: SPACING.XS,
  },
});

export default PostCardSkeleton;
