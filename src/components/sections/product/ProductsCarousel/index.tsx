import React from 'react';
import { View, Text } from 'react-native';
import Carousel from '../Carousel';
import ProductCard, { Product } from '../ProductCard';
import PaginationActive from '../../../../../assets/home-mvp/pagination-active.svg';
import PaginationDefault from '../../../../../assets/home-mvp/pagination-default.svg';
import { styles } from './styles';

const VISIBLE_PRODUCTS_PER_PAGE = 2;

const PAGINATION_DOT_LARGE = { width: 10 as const, height: 9 as const };

type Props = {
  title: string;
  subtitle: string;
  products: Product[];
  onProductPress?: (product: Product) => void;
  onProductLike?: (product: Product) => void;
};

const ProductsCarousel: React.FC<Props> = ({ title, subtitle, products, onProductPress, onProductLike }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}

      <View style={styles.carouselContainer}>
        <Carousel
          data={products}
          renderItem={(product) => <ProductCard product={product} onPress={onProductPress} onLike={onProductLike} />}
          keyExtractor={(product) => product.id}
          itemWidth={170}
          gap={10}
          itemsPerPage={VISIBLE_PRODUCTS_PER_PAGE}
          showPagination={true}
          paginationSize='Large'
          renderPaginationDot={(isActive) =>
            isActive ? <PaginationActive {...PAGINATION_DOT_LARGE} /> : <PaginationDefault {...PAGINATION_DOT_LARGE} />
          }
        />
      </View>
    </View>
  );
};

export default ProductsCarousel;
