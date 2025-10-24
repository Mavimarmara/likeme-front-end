import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Card, Chip, ProgressBar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProtocolScreen: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  const protocols = [
    {
      id: 'diabetes',
      title: 'Protocolo Diabetes',
      description: 'Protocolo completo para controle do diabetes',
      duration: '12 semanas',
      difficulty: 'Médio',
      progress: 65,
      steps: [
        { id: 1, title: 'Avaliação inicial', completed: true },
        { id: 2, title: 'Plano alimentar', completed: true },
        { id: 3, title: 'Exercícios físicos', completed: true },
        { id: 4, title: 'Monitoramento glicêmico', completed: false },
        { id: 5, title: 'Acompanhamento médico', completed: false },
      ],
      color: '#4CAF50',
    },
    {
      id: 'hypertension',
      title: 'Protocolo Hipertensão',
      description: 'Protocolo para controle da pressão arterial',
      duration: '8 semanas',
      difficulty: 'Fácil',
      progress: 30,
      steps: [
        { id: 1, title: 'Avaliação cardiovascular', completed: true },
        { id: 2, title: 'Redução de sódio', completed: false },
        { id: 3, title: 'Exercícios aeróbicos', completed: false },
        { id: 4, title: 'Meditação', completed: false },
      ],
      color: '#2196F3',
    },
    {
      id: 'weight_loss',
      title: 'Protocolo Perda de Peso',
      description: 'Protocolo para perda de peso saudável',
      duration: '16 semanas',
      difficulty: 'Difícil',
      progress: 0,
      steps: [
        { id: 1, title: 'Avaliação nutricional', completed: false },
        { id: 2, title: 'Plano de exercícios', completed: false },
        { id: 3, title: 'Acompanhamento psicológico', completed: false },
        { id: 4, title: 'Monitoramento metabólico', completed: false },
      ],
      color: '#FF9800',
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return '#4CAF50';
      case 'Médio': return '#FF9800';
      case 'Difícil': return '#F44336';
      default: return '#666';
    }
  };

  const handleStartProtocol = (protocolId: string) => {
    setSelectedProtocol(protocolId);
    Alert.alert(
      'Protocolo Iniciado',
      'Você iniciou um novo protocolo. Siga as etapas para obter os melhores resultados.',
      [{ text: 'OK' }]
    );
  };

  const renderProtocol = (protocol: any) => (
    <Card key={protocol.id} style={styles.protocolCard}>
      <View style={styles.protocolHeader}>
        <View style={[styles.protocolIcon, { backgroundColor: protocol.color + '20' }]}>
          <Icon name="assignment" size={24} color={protocol.color} />
        </View>
        <View style={styles.protocolInfo}>
          <Text style={styles.protocolTitle}>{protocol.title}</Text>
          <Text style={styles.protocolDescription}>{protocol.description}</Text>
        </View>
      </View>

      <View style={styles.protocolDetails}>
        <Chip 
          style={[styles.chip, { backgroundColor: getDifficultyColor(protocol.difficulty) + '20' }]}
          textStyle={{ color: getDifficultyColor(protocol.difficulty) }}
        >
          {protocol.difficulty}
        </Chip>
        <Chip style={styles.chip}>
          {protocol.duration}
        </Chip>
        <Chip style={styles.chip}>
          {protocol.progress}% concluído
        </Chip>
      </View>

      {protocol.progress > 0 && (
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={protocol.progress / 100}
            color={protocol.color}
            style={styles.progressBar}
          />
        </View>
      )}

      {selectedProtocol === protocol.id && (
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Etapas do Protocolo:</Text>
          {protocol.steps.map((step: any) => (
            <View key={step.id} style={styles.stepItem}>
              <Icon
                name={step.completed ? 'check-circle' : 'radio-button-unchecked'}
                size={20}
                color={step.completed ? '#4CAF50' : '#ccc'}
              />
              <Text style={[
                styles.stepText,
                step.completed && styles.completedStepText
              ]}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.protocolActions}>
        {protocol.progress === 0 ? (
          <Button
            mode="contained"
            onPress={() => handleStartProtocol(protocol.id)}
            style={[styles.actionButton, { backgroundColor: protocol.color }]}
          >
            Iniciar Protocolo
          </Button>
        ) : (
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={() => setSelectedProtocol(
                selectedProtocol === protocol.id ? null : protocol.id
              )}
              style={styles.actionButton}
            >
              {selectedProtocol === protocol.id ? 'Ocultar' : 'Ver Detalhes'}
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                // Continue protocol
              }}
              style={[styles.actionButton, { backgroundColor: protocol.color }]}
            >
              Continuar
            </Button>
          </View>
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Protocolos</Text>
        <Text style={styles.subtitle}>
          Protocolos personalizados para sua saúde
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {protocols.map(renderProtocol)}

        {/* Add New Protocol Card */}
        <Card style={styles.addProtocolCard}>
          <TouchableOpacity style={styles.addProtocolButton}>
            <Icon name="add" size={24} color="#4CAF50" />
            <Text style={styles.addProtocolText}>Adicionar Novo Protocolo</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  protocolCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  protocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  protocolIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  protocolInfo: {
    flex: 1,
  },
  protocolTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  protocolDescription: {
    fontSize: 14,
    color: '#666',
  },
  protocolDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  stepsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  completedStepText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  protocolActions: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addProtocolCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  addProtocolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProtocolText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProtocolScreen;
