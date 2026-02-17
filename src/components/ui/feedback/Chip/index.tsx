import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';
import { styles } from './styles';

interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected?: boolean;
  /** Cor de fundo quando selecionado (ex.: amarelo). Se não informado, usa o estilo padrão. */
  selectedBackgroundColor?: string;
  /** Cor do texto quando selecionado (para contraste com selectedBackgroundColor). */
  selectedTextColor?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  selectedBackgroundColor,
  selectedTextColor,
  style,
  ...props
}) => {
  const selectedStyle: ViewStyle | undefined =
    selected && selectedBackgroundColor
      ? { backgroundColor: selectedBackgroundColor }
      : selected
      ? styles.chipSelected
      : undefined;
  const selectedTextStyle: TextStyle | undefined =
    selected && selectedTextColor ? { color: selectedTextColor } : selected ? styles.chipTextSelected : undefined;
  return (
    <TouchableOpacity style={[styles.chip, selectedStyle, style]} {...props}>
      <Text style={[styles.chipText, selectedTextStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Chip;
