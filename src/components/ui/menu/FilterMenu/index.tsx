import React from 'react';
import { View } from 'react-native';
import { FilterButton } from '@/components/ui/buttons';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { styles } from './styles';

type Props<T = string> = {
  filterButtonLabel?: string;
  filterButtonIcon?: string;
  filterModalTitle?: string;
  filterModalContent?: React.ReactNode;
  onFilterButtonPress?: () => void;
  onFilterModalClose?: () => void;
  carouselOptions: ButtonCarouselOption<T>[];
  selectedCarouselId?: T | null;
  onCarouselSelect: (optionId: T) => void;
};

const FilterMenu = <T extends string | number = string>({
  filterButtonLabel,
  filterButtonIcon = 'arrow-drop-down',
  filterModalTitle,
  filterModalContent,
  onFilterButtonPress,
  onFilterModalClose,
  carouselOptions,
  selectedCarouselId,
  onCarouselSelect,
}: Props<T>) => {
  const hasFilterButton = !!filterButtonLabel;

  return (
    <View style={styles.container}>
      {hasFilterButton && (
        <FilterButton
          label={filterButtonLabel}
          icon={filterButtonIcon}
          iconPosition="right"
          modalTitle={filterModalTitle}
          modalContent={filterModalContent}
          onPress={onFilterButtonPress}
          onModalClose={onFilterModalClose}
        />
      )}
      <ButtonCarousel
        options={carouselOptions}
        selectedId={selectedCarouselId}
        onSelect={onCarouselSelect}
      />
    </View>
  );
};

export default FilterMenu;
