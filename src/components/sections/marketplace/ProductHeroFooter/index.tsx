import React from 'react';
import { View, Text } from 'react-native';
import { IconButton } from '@/components/ui/buttons';
import { formatPrice } from '@/utils';
import { styles } from './styles';

type ProductHeroFooterProps = {
  isOutOfStock: boolean;
  price: number | null | undefined;
  priceSuffix?: string;
  onCartPress: () => void;
};

export const ProductHeroFooter: React.FC<ProductHeroFooterProps> = ({
  isOutOfStock,
  price,
  priceSuffix,
  onCartPress,
}) => {
  return (
    <View style={styles.heroFooter}>
      {!isOutOfStock && price != null ? (
        <View style={styles.priceRow}>
          <Text style={styles.heroPrice}>{formatPrice(price)}</Text>
          {priceSuffix?.trim() ? <Text style={styles.heroPriceSuffix}>{priceSuffix.trim()}</Text> : null}
        </View>
      ) : (
        <View />
      )}

      {!isOutOfStock && price != null ? (
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
