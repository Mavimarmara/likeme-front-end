import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from './styles';

type Props<T extends string> = {
  options: readonly T[];
  selected: T;
  onSelect: (option: T) => void;
  fixedWidth?: boolean;
};

const Toggle = <T extends string>({ options, selected, onSelect, fixedWidth = true }: Props<T>) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <TouchableOpacity
            key={option}
            style={[fixedWidth ? styles.option : styles.optionVariableWidth, isSelected && styles.optionSelected]}
            onPress={() => onSelect(option)}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Toggle;
