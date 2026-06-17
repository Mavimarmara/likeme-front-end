import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Toggle, { type ToggleVariant } from '@/components/ui/buttons/Toggle';
import { styles } from './styles';

export type ToggleTabItem = {
  id: string;
  label: string;
};

type ToggleTabsProps = {
  tabs: ToggleTabItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  fixedWidth?: boolean;
  variant?: ToggleVariant;
};

const ToggleTabs: React.FC<ToggleTabsProps> = ({
  tabs,
  selectedId,
  onSelect,
  containerStyle,
  fixedWidth = true,
  variant = 'default',
}) => {
  const options = tabs.map((tab) => tab.label);
  const selectedLabel = tabs.find((tab) => tab.id === selectedId)?.label ?? tabs[0]?.label ?? '';

  const handleSelect = (label: string) => {
    const tab = tabs.find((t) => t.label === label);
    if (tab) onSelect(tab.id);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Toggle
        options={options}
        selected={selectedLabel}
        onSelect={handleSelect}
        fixedWidth={fixedWidth}
        variant={variant}
      />
    </View>
  );
};

export default ToggleTabs;
