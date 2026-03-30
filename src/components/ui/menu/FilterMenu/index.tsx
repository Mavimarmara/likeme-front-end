import React from 'react';
import { View, type ImageSourcePropType, type ImageStyle } from 'react-native';
import { FilterButton } from '@/components/ui/buttons';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { styles } from './styles';

type Props<T = string> = {
  filterButtonLabel?: string;
  filterButtonIcon?: string;
  filterButtonIconImage?: ImageSourcePropType;
  filterButtonIconImageStyle?: ImageStyle;
  /** Quando true, o botão de filtro de categoria fica azul (filtro ativo). */
  filterButtonSelected?: boolean;
  filterModalTitle?: string;
  filterModalContent?: React.ReactNode;
  onFilterButtonPress?: () => void;
  onFilterModalClose?: () => void;
  carouselOptions: ButtonCarouselOption<T>[];
  selectedCarouselId?: T | null;
  onCarouselSelect: (optionId: T) => void;
  /** Quando false, não exibe o carrossel de opções (ex.: quando as abas estão no conteúdo). */
  showCarousel?: boolean;
};

const FilterMenu = <T extends string | number = string>({
  filterButtonLabel,
  filterButtonIcon = 'arrow-drop-down',
  filterButtonIconImage,
  filterButtonIconImageStyle,
  filterButtonSelected = false,
  filterModalTitle,
  filterModalContent,
  onFilterButtonPress,
  onFilterModalClose,
  carouselOptions,
  selectedCarouselId,
  onCarouselSelect,
  showCarousel = true,
}: Props<T>) => {
  const hasFilterButton = !!filterButtonLabel;

  return (
    <View style={styles.container}>
      {hasFilterButton && (
        <FilterButton
          label={filterButtonLabel}
          icon={filterButtonIcon}
          iconImage={filterButtonIconImage}
          iconImageStyle={filterButtonIconImageStyle}
          iconPosition='right'
          selected={filterButtonSelected}
          modalTitle={filterModalTitle}
          modalContent={filterModalContent}
          onPress={onFilterButtonPress}
          onModalClose={onFilterModalClose}
        />
      )}
      {showCarousel && (
        <ButtonCarousel options={carouselOptions} selectedId={selectedCarouselId} onSelect={onCarouselSelect} />
      )}
    </View>
  );
};

export default FilterMenu;
