import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ProgramSelector, ModuleAccordion } from '@/components/ui';
import { styles } from './styles';
import type { Program, ProgramDetail } from '@/types/program';

type Props = {
  programs: Program[];
  programDetails?: ProgramDetail;
  onProgramPress: (program: Program) => void;
  selectedProgramId?: string;
};

const ProgramsList: React.FC<Props> = ({
  programs,
  programDetails,
  onProgramPress,
  selectedProgramId,
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  const handleModuleToggle = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);

  return (
    <View style={styles.container}>
      {programs.length > 0 && (
        <View style={styles.selectorContainer}>
          <ProgramSelector
            programs={programs}
            selectedProgramId={selectedProgramId}
            onSelect={(program) => {
              if (program) {
                onProgramPress(program);
              }
            }}
          />
        </View>
      )}

      {programDetails && selectedProgram ? (
        <ScrollView
          contentContainerStyle={styles.detailsContent}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          nestedScrollEnabled={true}
        >
          <View style={styles.programHeader}>
            <Text style={styles.programTitle}>{programDetails.name}</Text>
            <View style={styles.descriptionContainer}>
              <Text style={styles.programDescription}>
                {programDetails.description}
              </Text>
            </View>
          </View>

          <View style={styles.modulesContainer}>
            {programDetails.modules.map((module) => (
              <ModuleAccordion
                key={module.id}
                module={{
                  ...module,
                  isExpanded: expandedModules.has(module.id),
                }}
                onToggle={handleModuleToggle}
      />
            ))}
          </View>
        </ScrollView>
      ) : selectedProgramId ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Detalhes do programa não disponíveis
          </Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Selecione um programa para ver os detalhes
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProgramsList;

