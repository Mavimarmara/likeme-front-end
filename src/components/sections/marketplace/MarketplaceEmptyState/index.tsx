import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SPACING, COLORS } from '@/constants';

export type MarketplaceEmptyStateProps = {
  title: string;
  description?: string;
};

const MarketplaceEmptyState: React.FC<MarketplaceEmptyStateProps> = ({ title, description }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.MD,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT,
    textAlign: 'center',
    marginBottom: SPACING.MD,
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MarketplaceEmptyState;
