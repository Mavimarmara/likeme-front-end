import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../../components/ui';
import { styles } from './styles';
import { COLORS } from '../../../constants';

const WellnessScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Bem-estar</Text>
          <Text style={styles.subtitle}>Acompanhe sua jornada de saúde</Text>
        </View>

        <View style={styles.content}>
          <Card title="Métricas de Hoje" style={styles.metricCard}>
            <Text style={styles.metricText}>Peso: 70kg</Text>
            <Text style={styles.metricText}>Pressão: 120/80</Text>
            <Text style={styles.metricText}>Frequência Cardíaca: 72 bpm</Text>
          </Card>

          <Card title="Atividades Recentes" style={styles.activityCard}>
            <Text style={styles.activityText}>Caminhada matinal - 30min</Text>
            <Text style={styles.activityText}>Meditação - 15min</Text>
            <Text style={styles.activityText}>Hidratação - 2L</Text>
          </Card>

          <Card title="Objetivos" style={styles.goalCard}>
            <Text style={styles.goalText}>Meta de peso: 68kg</Text>
            <Text style={styles.goalText}>Meta de exercícios: 5x/semana</Text>
            <Text style={styles.goalText}>Meta de sono: 8h/dia</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WellnessScreen;
