import { useMemo, type ReactNode } from 'react';
import { View, type ImageSourcePropType, type ImageStyle } from 'react-native';
import { FilterButton } from '@/components/ui/buttons';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { styles } from './styles';

type ModalContentRender = (api: { close: () => void }) => ReactNode;

type Props<T = string> = {
  filterButtonLabel?: string;
  filterButtonIcon?: string;
  filterButtonIconImage?: ImageSourcePropType;
  filterButtonIconImageStyle?: ImageStyle;
  filterButtonSelected?: boolean;
  filterModalTitle?: string;
  filterModalContent?: ReactNode | ModalContentRender;
  onFilterButtonPress?: () => void;
  onFilterModalClose?: () => void;
  carouselOptions: ButtonCarouselOption<T>[];
  selectedCarouselId?: T | null;
  onCarouselSelect: (optionId: T) => void;
  showCarousel?: boolean;
  carouselDisplay?: 'all' | 'selectedOnly';
};

const StickyFilterCarouselRow = <T extends string | number = string>({
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
  carouselDisplay = 'all',
}: Props<T>) => {
  const hasFilterButton = !!filterButtonLabel;

  const carouselOptionsForDisplay = useMemo(() => {
    if (carouselDisplay !== 'selectedOnly') {
      return carouselOptions;
    }
    const selected = carouselOptions.find((o) => String(o.id) === String(selectedCarouselId ?? ''));
    return selected != null ? [selected] : [];
  }, [carouselDisplay, carouselOptions, selectedCarouselId]);

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
        <ButtonCarousel
          options={carouselOptionsForDisplay}
          selectedId={selectedCarouselId}
          onSelect={onCarouselSelect}
        />
      )}
    </View>
  );
};

export default StickyFilterCarouselRow;
