import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import { Card, Chip, Avatar, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CommunityScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newPost, setNewPost] = useState('');

  const filters = [
    { id: 'all', name: 'Todos', icon: 'apps' },
    { id: 'tips', name: 'Dicas', icon: 'lightbulb' },
    { id: 'experiences', name: 'Experiências', icon: 'favorite' },
    { id: 'questions', name: 'Perguntas', icon: 'help' },
    { id: 'achievements', name: 'Conquistas', icon: 'emoji-events' },
  ];

  const posts = [
    {
      id: 1,
      user: {
        name: 'Maria Silva',
        avatar: '👩',
        level: 'Expert',
      },
      content: 'Compartilhando minha jornada de perda de peso: 15kg em 6 meses! O segredo foi consistência e paciência.',
      category: 'experiences',
      likes: 24,
      comments: 8,
      time: '2 horas atrás',
      tags: ['perda de peso', 'motivação'],
    },
    {
      id: 2,
      user: {
        name: 'Dr. João Santos',
        avatar: '👨‍⚕️',
        level: 'Profissional',
      },
      content: 'Dica importante: A hidratação é fundamental para o funcionamento do metabolismo. Bebam pelo menos 2L de água por dia!',
      category: 'tips',
      likes: 18,
      comments: 5,
      time: '4 horas atrás',
      tags: ['hidratação', 'saúde'],
    },
    {
      id: 3,
      user: {
        name: 'Ana Costa',
        avatar: '👩',
        level: 'Iniciante',
      },
      content: 'Alguém pode me ajudar com dicas para começar a meditar? Estou tendo dificuldades para manter o foco.',
      category: 'questions',
      likes: 12,
      comments: 15,
      time: '6 horas atrás',
      tags: ['meditação', 'bem-estar'],
    },
    {
      id: 4,
      user: {
        name: 'Carlos Oliveira',
        avatar: '👨',
        level: 'Avançado',
      },
      content: 'Conquista do dia: Completei minha primeira corrida de 5km sem parar! 🏃‍♂️',
      category: 'achievements',
      likes: 31,
      comments: 12,
      time: '1 dia atrás',
      tags: ['corrida', 'conquista'],
    },
    {
      id: 5,
      user: {
        name: 'Dra. Fernanda Lima',
        avatar: '👩‍⚕️',
        level: 'Profissional',
      },
      content: 'Lembrem-se: O sono é tão importante quanto a alimentação e exercícios. Priorizem 7-8 horas de sono por noite.',
      category: 'tips',
      likes: 22,
      comments: 7,
      time: '1 dia atrás',
      tags: ['sono', 'saúde'],
    },
  ];

  const filteredPosts = selectedFilter === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedFilter);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante': return '#4CAF50';
      case 'Avançado': return '#2196F3';
      case 'Expert': return '#FF9800';
      case 'Profissional': return '#9C27B0';
      default: return '#666';
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <Card style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Avatar.Text 
            size={40} 
            label={item.user.avatar}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <View style={styles.userLevel}>
              <Chip 
                style={[styles.levelChip, { backgroundColor: getLevelColor(item.user.level) + '20' }]}
                textStyle={{ color: getLevelColor(item.user.level), fontSize: 12 }}
              >
                {item.user.level}
              </Chip>
            </View>
          </View>
        </View>
        <Text style={styles.postTime}>{item.time}</Text>
      </View>

      <Text style={styles.postContent}>{item.content}</Text>

      <View style={styles.tagsContainer}>
        {item.tags.map((tag: string, index: number) => (
          <Chip key={index} style={styles.tag} textStyle={styles.tagText}>
            #{tag}
          </Chip>
        ))}
      </View>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="favorite-border" size={20} color="#666" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chat-bubble-outline" size={20} color="#666" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="share" size={20} color="#666" />
          <Text style={styles.actionText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comunidade</Text>
        <Text style={styles.subtitle}>Conecte-se com outras pessoas</Text>
      </View>

      {/* Create Post */}
      <Card style={styles.createPostCard}>
        <View style={styles.createPostHeader}>
          <Avatar.Text size={32} label="👤" />
          <TextInput
            style={styles.postInput}
            placeholder="Compartilhe algo com a comunidade..."
            value={newPost}
            onChangeText={setNewPost}
            multiline
          />
        </View>
        <View style={styles.createPostActions}>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="attach-file" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachButton}>
            <Icon name="photo-camera" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.postButton}>
            <Text style={styles.postButtonText}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              selectedFilter === filter.id && styles.selectedFilter
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Icon 
              name={filter.icon} 
              size={16} 
              color={selectedFilter === filter.id ? '#fff' : '#4CAF50'} 
            />
            <Text style={[
              styles.filterText,
              selectedFilter === filter.id && styles.selectedFilterText
            ]}>
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Posts List */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
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
  createPostCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    maxHeight: 80,
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachButton: {
    padding: 8,
  },
  postButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
  },
  selectedFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  selectedFilterText: {
    color: '#fff',
  },
  postsList: {
    padding: 16,
  },
  postCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userLevel: {
    alignSelf: 'flex-start',
  },
  levelChip: {
    height: 24,
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: '#E8F5E8',
  },
  tagText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default CommunityScreen;
