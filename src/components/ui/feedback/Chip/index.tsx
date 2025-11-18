import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { styles } from './styles';

interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected?: boolean;
}

const Chip: React.FC<ChipProps> = ({ label, selected = false, style, ...props }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected, style]}
      {...props}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;

