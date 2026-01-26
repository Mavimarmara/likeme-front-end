import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from '@/hooks/i18n';
import { styles } from './styles';

export type SymptomLevel = 'grave' | 'moderado' | 'leve' | 'sem' | 'plena';

interface SymptomOption {
  value: SymptomLevel;
  label: string;
  sublabel: string;
}

interface SymptomSliderProps {
  selectedValue?: SymptomLevel;
  onValueChange: (value: SymptomLevel) => void;
}

const SymptomSlider: React.FC<SymptomSliderProps> = ({ selectedValue, onValueChange }) => {
  const { t } = useTranslation();
  
  const SYMPTOM_OPTIONS: SymptomOption[] = useMemo(() => [
    { value: 'grave', label: t('anamnesis.symptomLevelGrave'), sublabel: t('anamnesis.symptomsSublabel') },
    { value: 'moderado', label: t('anamnesis.symptomLevelModerado'), sublabel: t('anamnesis.symptomsSublabel') },
    { value: 'leve', label: t('anamnesis.symptomLevelLeve'), sublabel: t('anamnesis.symptomsSublabel') },
    { value: 'sem', label: t('anamnesis.symptomLevelSem'), sublabel: t('anamnesis.symptomsSublabel') },
    { value: 'plena', label: t('anamnesis.symptomLevelPlena'), sublabel: t('anamnesis.healthSublabel') },
  ], [t]);

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
