import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from './styles';

export interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  participantsCount: number;
  image?: string;
}

type Props = {
  programs: Program[];
  onProgramPress: (program: Program) => void;
  selectedProgramId?: string;
};

const ProgramsList: React.FC<Props> = ({
  programs,
  onProgramPress,
  selectedProgramId,
}) => {
  const renderProgram = ({ item }: { item: Program }) => {
    const isSelected = item.id === selectedProgramId;

    return (
      <TouchableOpacity
        style={[styles.programCard, isSelected && styles.programCardSelected]}
        onPress={() => onProgramPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.programContent}>
          <Text style={styles.programName}>{item.name}</Text>
          <Text style={styles.programDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.programInfo}>
            <Text style={styles.programDuration}>{item.duration}</Text>
            <Text style={styles.programParticipants}>
              {item.participantsCount} participantes
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={programs}
        renderItem={renderProgram}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum programa encontrado</Text>
          </View>
        }
      />
    </View>
  );
};

export default ProgramsList;

