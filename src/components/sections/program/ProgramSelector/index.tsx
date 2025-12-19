import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SecondaryButton } from '@/components/ui';
import { styles } from './styles';
import type { Program } from '@/types/program';

type Props = {
  programs: Program[];
  selectedProgramId?: string;
  onSelect: (program: Program | null) => void;
  onMarkerPress?: () => void;
  showMarker?: boolean;
  showAll?: boolean;
};

const MARKER_ID = '__MARKER__';
const ALL_ID = '__ALL__';

const ProgramSelector: React.FC<Props> = ({
  programs,
  selectedProgramId,
  onSelect,
  onMarkerPress,
  showMarker = false,
  showAll = false,
}) => {
  const handleMarkerPress = () => {
    if (onMarkerPress) {
      onMarkerPress();
    }
  };

  const handleAllPress = () => {
    // Passa null para indicar que "All" foi selecionado
    onSelect(null);
  };

  const handleProgramPress = (program: Program) => {
    onSelect(program);
  };

  // Se não há seleção, considera "All" como selecionado
  const isAllSelected = !selectedProgramId || selectedProgramId === ALL_ID;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {showMarker && (
          <SecondaryButton
            label="Marker"
            onPress={handleMarkerPress}
            icon="expand-more"
            iconPosition="right"
            style={styles.markerButton}
          />
        )}
        {showAll && (
          <TouchableOpacity
            style={[
              styles.button,
              isAllSelected ? styles.buttonSelected : styles.buttonUnselected,
            ]}
            onPress={handleAllPress}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                isAllSelected
                  ? styles.buttonTextSelected
                  : styles.buttonTextUnselected,
              ]}
            >
              All
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

