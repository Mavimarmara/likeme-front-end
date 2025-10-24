import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Card, Chip, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ActivitiesScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todas', icon: 'list' },
    { id: 'exercise', name: 'Exercícios', icon: 'fitness-center' },
    { id: 'nutrition', name: 'Nutrição', icon: 'restaurant' },
    { id: 'mental', name: 'Mental', icon: 'psychology' },
    { id: 'medical', name: 'Médico', icon: 'local-hospital' },
  ];

  const activities = [
    {
      id: 1,
      title: 'Caminhada Matinal',
      category: 'exercise',
      duration: '30 min',
      difficulty: 'Fácil',
      description: 'Caminhada leve para começar o dia',
      completed: true,
      date: 'Hoje',
    },
    {
      id: 2,
      title: 'Meditação Guiada',
      category: 'mental',
      duration: '15 min',
      difficulty: 'Fácil',
      description: 'Sessão de meditação para relaxamento',
      completed: true,
      date: 'Hoje',
    },
    {
      id: 3,
      title: 'Consulta Cardiologista',
      category: 'medical',
      duration: '45 min',
      difficulty: 'Médio',
      description: 'Consulta de rotina com cardiologista',
      completed: false,
      date: 'Amanhã',
    },
    {
      id: 4,
      title: 'Plano Alimentar',
      category: 'nutrition',
      duration: '20 min',
      difficulty: 'Fácil',
      description: 'Planejamento das refeições da semana',
      completed: false,
      date: 'Esta semana',
    },
    {
      id: 5,
      title: 'Yoga',
      category: 'exercise',
      duration: '45 min',
      difficulty: 'Médio',
      description: 'Sessão de yoga para flexibilidade',
      completed: false,
      date: 'Próxima semana',
    },
  ];

  const filteredActivities = selectedCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return '#4CAF50';
      case 'Médio': return '#FF9800';
      case 'Difícil': return '#F44336';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData?.icon || 'help';
  };

  const renderActivity = ({ item }: { item: any }) => (
    <Card style={[styles.activityCard, item.completed && styles.completedCard]}>
      <View style={styles.activityHeader}>
        <View style={styles.activityIcon}>
          <Icon 
            name={getCategoryIcon(item.category)} 
            size={24} 
            color={item.completed ? '#4CAF50' : '#666'} 
          />
        </View>
        <View style={styles.activityInfo}>
          <Text style={[styles.activityTitle, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          <Text style={styles.activityDescription}>{item.description}</Text>
        </View>
        {item.completed && (
          <Icon name="check-circle" size={24} color="#4CAF50" />
        )}
      </View>
      
      <View style={styles.activityDetails}>
        <Chip 
          style={[styles.chip, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}
          textStyle={{ color: getDifficultyColor(item.difficulty) }}
        >
          {item.difficulty}
        </Chip>
        <Chip style={styles.chip}>
          {item.duration}
        </Chip>
        <Chip style={styles.chip}>
          {item.date}
        </Chip>
      </View>

      {!item.completed && (
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Iniciar</Text>
        </TouchableOpacity>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Atividades</Text>
        <Text style={styles.subtitle}>Gerencie suas atividades de saúde</Text>
      </View>

      {/* Categories Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Icon 
              name={category.icon} 
              size={20} 
              color={selectedCategory === category.id ? '#fff' : '#4CAF50'} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activities List */}
      <FlatList
        data={filteredActivities}
        renderItem={renderActivity}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.activitiesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="add"
        onPress={() => {
          // Navigate to add activity screen
        }}
      />
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
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  activitiesList: {
    padding: 16,
  },
  activityCard: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#f8f9fa',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
  },
  activityDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 4,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
});

export default ActivitiesScreen;
