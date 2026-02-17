import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { styles } from './styles';

export type TabItem<T extends string = string> = {
  id: T;
  label: string;
};

export type TabsProps<T extends string = string> = {
  items: readonly TabItem<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

function Tabs<T extends string = string>({ items, selectedId, onSelect, style, accessibilityLabel }: TabsProps<T>) {
  return (
    <View style={[styles.container, style]} accessibilityRole='tablist' accessibilityLabel={accessibilityLabel}>
      {items.map((tab) => {
        const isSelected = selectedId === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isSelected && styles.tabSelected]}
            onPress={() => onSelect(tab.id)}
            activeOpacity={0.7}
            accessibilityRole='tab'
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default Tabs;
