import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { Toggle } from '@/components/ui/buttons';
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
};

const ToggleTabs: React.FC<ToggleTabsProps> = ({ tabs, selectedId, onSelect, containerStyle }) => {
  const options = tabs.map((tab) => tab.label);
  const selectedLabel = tabs.find((tab) => tab.id === selectedId)?.label ?? tabs[0]?.label ?? '';

  const handleSelect = (label: string) => {
    const tab = tabs.find((t) => t.label === label);
    if (tab) onSelect(tab.id);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Toggle options={options} selected={selectedLabel} onSelect={handleSelect} />
    </View>
  );
};

export default ToggleTabs;
