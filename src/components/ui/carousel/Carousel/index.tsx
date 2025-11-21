import React, { useState, useRef } from 'react';
import { View, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { styles } from './styles';

type Props = {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  keyExtractor: (item: any, index: number) => string;
  itemWidth?: number;
  gap?: number;
  showPagination?: boolean;
  paginationSize?: 'Small' | 'Large';
};

const Carousel: React.FC<Props> = ({
  data,
  renderItem,
  keyExtractor,
  itemWidth,
  gap = 10,
  showPagination = true,
  paginationSize = 'Large',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    if (!itemWidth) {
      return;
    }
    const index = Math.round(contentOffset.x / (itemWidth + gap));
    if (index >= 0 && index < data.length) {
      setActiveIndex(index);
    }
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(event);
  };

  const renderPagination = () => {
    if (!showPagination || data.length <= 1) {
      return null;
    }

    return (
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={keyExtractor(_, index)}
            style={[
              styles.paginationDot,
              paginationSize === 'Small' ? styles.paginationDotSmall : styles.paginationDotLarge,
              activeIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
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
}

export default Carousel;

