import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Card, ProgressBar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const WellnessScreen: React.FC = () => {
  const wellnessData = {
    overallScore: 75,
    categories: [
      { name: 'Físico', score: 80, color: '#4CAF50' },
      { name: 'Mental', score: 70, color: '#2196F3' },
      { name: 'Emocional', score: 75, color: '#FF9800' },
      { name: 'Social', score: 65, color: '#9C27B0' },
    ],
    recentActivities: [
      { name: 'Caminhada matinal', time: '30 min', date: 'Hoje' },
      { name: 'Meditação', time: '15 min', date: 'Ontem' },
      { name: 'Consulta médica', time: '45 min', date: '2 dias atrás' },
    ],
    tips: [
      'Mantenha uma rotina de sono regular',
      'Pratique exercícios pelo menos 3x por semana',
      'Beba pelo menos 2L de água por dia',
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Overall Score Card */}
        <Card style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Seu Bem-estar</Text>
            <Text style={styles.scoreValue}>{wellnessData.overallScore}%</Text>
          </View>
          <ProgressBar
            progress={wellnessData.overallScore / 100}
            color="#4CAF50"
            style={styles.progressBar}
          />
          <Text style={styles.scoreDescription}>
            Você está indo muito bem! Continue assim.
          </Text>
        </Card>

        {/* Categories */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Categorias</Text>
          {wellnessData.categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryScore}>{category.score}%</Text>
              </View>
              <ProgressBar
                progress={category.score / 100}
                color={category.color}
                style={styles.categoryProgress}
              />
            </View>
          ))}
        </Card>

        {/* Recent Activities */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Atividades Recentes</Text>
          {wellnessData.recentActivities.map((activity, index) => (
            <TouchableOpacity key={index} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Icon name="fitness-center" size={24} color="#4CAF50" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{activity.name}</Text>
                <Text style={styles.activityDetails}>
                  {activity.time} • {activity.date}
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#ccc" />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Tips */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Dicas de Bem-estar</Text>
          {wellnessData.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Icon name="lightbulb-outline" size={20} color="#FF9800" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Ações Rápidas</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="add" size={24} color="#4CAF50" />
              <Text style={styles.actionText}>Registrar Atividade</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="assessment" size={24} color="#2196F3" />
              <Text style={styles.actionText}>Ver Relatórios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="schedule" size={24} color="#FF9800" />
              <Text style={styles.actionText}>Agendar Consulta</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: 16,
  },
  scoreCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
  },
  categoryScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryProgress: {
    height: 6,
    borderRadius: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  activityDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default WellnessScreen;
