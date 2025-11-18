import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toggle, SocialList, Community, ProgramsList, Program } from '@/components/ui';
import { styles } from './styles';

type CommunityMode = 'Social' | 'Programs';

const TOGGLE_OPTIONS: readonly [CommunityMode, CommunityMode] = ['Social', 'Programs'] as const;

// Dados mock - substituir por dados reais da API
const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Comunidade de Bem-Estar',
    description: 'Uma comunidade dedicada ao bem-estar físico e mental',
    membersCount: 1250,
  },
  {
    id: '2',
    name: 'Fitness & Saúde',
    description: 'Compartilhe suas rotinas de exercícios e dicas de saúde',
    membersCount: 890,
  },
  {
    id: '3',
    name: 'Mindfulness',
    description: 'Práticas de meditação e atenção plena',
    membersCount: 650,
  },
];

const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'Programa de 30 Dias',
    description: 'Um programa completo de transformação em 30 dias',
    duration: '30 dias',
    participantsCount: 450,
  },
  {
    id: '2',
    name: 'Desafio Semanal',
    description: 'Desafios semanais para melhorar sua qualidade de vida',
    duration: '7 dias',
    participantsCount: 320,
  },
  {
    id: '3',
    name: 'Programa Anual',
    description: 'Acompanhamento completo durante todo o ano',
    duration: '365 dias',
    participantsCount: 180,
  },
];

const CommunityScreen: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<CommunityMode>('Social');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | undefined>();
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>();

  const handleCommunityPress = (community: Community) => {
    setSelectedCommunityId(community.id);
    // Aqui você pode adicionar lógica para exibir detalhes da comunidade
  };

  const handleProgramPress = (program: Program) => {
    setSelectedProgramId(program.id);
    // Aqui você pode adicionar lógica para exibir detalhes do programa
  };

  const handleModeSelect = (mode: CommunityMode) => {
    setSelectedMode(mode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Toggle<CommunityMode>
          options={TOGGLE_OPTIONS}
          selected={selectedMode}
          onSelect={handleModeSelect}
        />
        
        {selectedMode === 'Social' ? (
          <SocialList
            communities={mockCommunities}
            onCommunityPress={handleCommunityPress}
            selectedCommunityId={selectedCommunityId}
          />
        ) : (
          <ProgramsList
            programs={mockPrograms}
            onProgramPress={handleProgramPress}
            selectedProgramId={selectedProgramId}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CommunityScreen;
