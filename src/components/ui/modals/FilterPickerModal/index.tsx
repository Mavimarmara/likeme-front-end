import { View, ScrollView } from 'react-native';
import { FilterModalButton } from '@/components/ui/buttons';
import type { ButtonCarouselOption } from '@/components/ui/carousel';
import { styles } from './styles';

type Props<T extends string | number = string> = {
  options: ButtonCarouselOption<T>[];
  selectedId?: T | null;
  onOptionPress: (optionId: T) => void;
};

export function FilterPickerModal<T extends string | number = string>({
  options,
  selectedId,
  onOptionPress,
}: Props<T>) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          const isSelected = String(opt.id) === String(selectedId ?? '');
          return (
            <FilterModalButton
              key={String(opt.id)}
              label={opt.label}
              selected={isSelected}
              onPress={() => onOptionPress(opt.id)}
              style={styles.chipWidth}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
