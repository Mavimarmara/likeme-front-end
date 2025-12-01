import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import type { Program } from '@/types/program';

type Props = {
  programs: Program[];
  selectedProgramId?: string;
  onSelect: (program: Program | null) => void;
  onMarkerPress?: () => void;
  showMarker?: boolean;
};

const MARKER_ID = '__MARKER__';

const ProgramSelector: React.FC<Props> = ({
  programs,
  selectedProgramId,
  onSelect,
  onMarkerPress,
  showMarker = false,
}) => {
  const handleMarkerPress = () => {
    if (onMarkerPress) {
      onMarkerPress();
    }
  };

  const handleProgramPress = (program: Program) => {
    onSelect(program);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {showMarker && (
          <TouchableOpacity
            style={[
              styles.button,
              selectedProgramId === MARKER_ID
                ? styles.buttonSelected
                : styles.buttonUnselected,
            ]}
            onPress={handleMarkerPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                selectedProgramId === MARKER_ID
                  ? styles.buttonTextSelected
                  : styles.buttonTextUnselected,
              ]}
            >
              Marker
            </Text>
          </TouchableOpacity>
        )}
        {programs.map((program) => {
          const isSelected = program.id === selectedProgramId;
          return (
            <TouchableOpacity
              key={program.id}
              style={[
                styles.button,
                isSelected ? styles.buttonSelected : styles.buttonUnselected,
              ]}
              onPress={() => handleProgramPress(program)}
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

