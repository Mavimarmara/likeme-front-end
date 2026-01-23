import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export type SymptomLevel = 'grave' | 'moderado' | 'leve' | 'sem' | 'plena';

interface SymptomOption {
  value: SymptomLevel;
  label: string;
  sublabel: string;
}

const SYMPTOM_OPTIONS: SymptomOption[] = [
  { value: 'grave', label: 'Graves', sublabel: 'sintomas' },
  { value: 'moderado', label: 'Moderados', sublabel: 'sintomas' },
  { value: 'leve', label: 'Leves', sublabel: 'sintomas' },
  { value: 'sem', label: 'Sem', sublabel: 'sintomas' },
  { value: 'plena', label: 'Plena', sublabel: 'saúde' },
];

interface SymptomSliderProps {
  selectedValue?: SymptomLevel;
  onValueChange: (value: SymptomLevel) => void;
}

const SymptomSlider: React.FC<SymptomSliderProps> = ({ selectedValue, onValueChange }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sliderTrack} />
      <View style={styles.optionsContainer}>
        {SYMPTOM_OPTIONS.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <View key={option.value} style={styles.optionWrapper}>
              <TouchableOpacity
                style={styles.radioButtonContainer}
                onPress={() => onValueChange(option.value)}
                activeOpacity={0.7}
              >
                <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
                  {isSelected && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>{option.label}</Text>
                <Text style={styles.sublabel}>{option.sublabel}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default SymptomSlider;
