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
          <SecondaryButton
            label="Marker"
            onPress={handleMarkerPress}
            icon="expand-more"
            iconPosition="right"
            style={styles.markerButton}
          />
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

