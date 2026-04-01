import React, { useState, useRef } from 'react';
import { View, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { styles } from './styles';

type Props = {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  keyExtractor: (item: any, index: number) => string;
  itemWidth?: number;
  gap?: number;
  /** Quantos itens cabem por “página” visual; bolinhas = ceil(length / itemsPerPage). Padrão 1 = uma bolinha por item. */
  itemsPerPage?: number;
  showPagination?: boolean;
  paginationSize?: 'Small' | 'Large';
  /** Se definido, substitui as bolinhas padrão (ex.: arte do Figma). */
  renderPaginationDot?: (isActive: boolean) => React.ReactNode;
};

const Carousel: React.FC<Props> = ({
  data,
  renderItem,
  keyExtractor,
  itemWidth,
  gap = 10,
  itemsPerPage: itemsPerPageProp = 1,
  showPagination = true,
  paginationSize = 'Large',
  renderPaginationDot,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const itemStride = itemWidth != null ? itemWidth + gap : 0;
  const itemsPerPage = Math.max(1, Math.floor(itemsPerPageProp));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    if (!itemWidth || itemStride <= 0) {
      return;
    }
    if (itemsPerPage <= 1) {
      const index = Math.round(contentOffset.x / itemStride);
      if (index >= 0 && index < data.length) {
        setActiveIndex(index);
      }
      return;
    }
    const pageCount = Math.max(1, Math.ceil(data.length / itemsPerPage));
    const pageWidth = itemsPerPage * itemStride;
    const page = Math.min(pageCount - 1, Math.max(0, Math.floor(contentOffset.x / pageWidth)));
    setActiveIndex(page);
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(event);
  };

  const renderPagination = () => {
    if (!showPagination || data.length <= 1) {
      return null;
    }

    const dotCount = itemsPerPage <= 1 ? data.length : Math.ceil(data.length / itemsPerPage);
    if (dotCount <= 1) {
      return null;
    }

    const dotStyle = paginationSize === 'Small' ? styles.paginationDotSmall : styles.paginationDotLarge;

    return (
      <View style={styles.paginationContainer}>
        {Array.from({ length: dotCount }, (_, pageIndex) =>
          renderPaginationDot != null ? (
            <React.Fragment key={`carousel-page-${pageIndex}`}>
              {renderPaginationDot(activeIndex === pageIndex)}
            </React.Fragment>
          ) : (
            <View
              key={`carousel-page-${pageIndex}`}
              style={[styles.paginationDot, dotStyle, activeIndex === pageIndex && styles.paginationDotActive]}
            />
          ),
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        nestedScrollEnabled
        directionalLockEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {data.map((item, index) => (
          <View
            key={keyExtractor(item, index)}
            style={[
              itemWidth ? { width: itemWidth } : undefined,
              index < data.length - 1 ? { marginRight: gap } : undefined,
            ]}
          >
            {renderItem(item, index)}
          </View>
        ))}
      </ScrollView>
      {renderPagination()}
    </View>
  );
};

export default Carousel;
