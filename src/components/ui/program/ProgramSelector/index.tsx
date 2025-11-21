import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import type { Program } from '@/types/program';

type Props = {
  programs: Program[];
  selectedProgramId?: string;
  onSelect: (program: Program) => void;
};

const ProgramSelector: React.FC<Props> = ({
  programs,
  selectedProgramId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {programs.map((program) => {
          const isSelected = program.id === selectedProgramId;
          return (
            <TouchableOpacity
              key={program.id}
              style={[
                styles.button,
                isSelected ? styles.buttonSelected : styles.buttonUnselected,
              ]}
              onPress={() => onSelect(program)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.buttonText,
                  isSelected
                    ? styles.buttonTextSelected
                    : styles.buttonTextUnselected,
                ]}
              >
                {program.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ProgramSelector;

