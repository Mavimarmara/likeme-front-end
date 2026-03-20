import React from 'react';
import { View, Text } from 'react-native';
import { IconButton } from '@/components/ui/buttons';
import { formatPrice } from '@/utils';
import { styles } from './styles';

type ProductHeroFooterProps = {
  isOutOfStock: boolean;
  price: number | null | undefined;
  onCartPress: () => void;
};

export const ProductHeroFooter: React.FC<ProductHeroFooterProps> = ({ isOutOfStock, price, onCartPress }) => {
  return (
    <View style={styles.heroFooter}>
      {!isOutOfStock && price != null ? <Text style={styles.heroPrice}>{formatPrice(price)}</Text> : <View />}

      {!isOutOfStock ? (
        <IconButton
          icon='shopping-cart'
          variant='light'
          onPress={onCartPress}
          containerStyle={{ alignSelf: 'flex-end' }}
        />
      ) : null}
    </View>
  );
};
