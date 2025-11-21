import React from 'react';
import { View, Text } from 'react-native';
import Carousel from '../Carousel/index';
import ProductCard, { Product } from '../ProductCard';
import { styles } from './styles';

type Props = {
  title: string;
  subtitle: string;
  products: Product[];
  onProductPress?: (product: Product) => void;
  onProductLike?: (product: Product) => void;
};

const ProductsCarousel: React.FC<Props> = ({
  title,
  subtitle,
  products,
  onProductPress,
  onProductLike,
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      
      <View style={styles.carouselContainer}>
        <Carousel
          data={products}
          renderItem={(product) => (
            <ProductCard
              product={product}
              onPress={onProductPress}
              onLike={onProductLike}
            />
          )}
          keyExtractor={(product) => product.id}
          itemWidth={170}
          gap={10}
          showPagination={true}
          paginationSize="Large"
        />
      </View>
    </View>
  );
};

export default ProductsCarousel;

