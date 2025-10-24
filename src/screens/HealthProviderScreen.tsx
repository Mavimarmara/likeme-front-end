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
import { Card, Chip, Searchbar, Button, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HealthProviderScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const specialties = [
    { id: 'all', name: 'Todos', icon: 'local-hospital' },
    { id: 'cardiology', name: 'Cardiologia', icon: 'favorite' },
    { id: 'endocrinology', name: 'Endocrinologia', icon: 'blood-type' },
    { id: 'nutrition', name: 'Nutrição', icon: 'restaurant' },
    { id: 'psychology', name: 'Psicologia', icon: 'psychology' },
    { id: 'physiotherapy', name: 'Fisioterapia', icon: 'fitness-center' },
  ];

  const providers = [
    {
      id: 1,
      name: 'Dr. Carlos Mendes',
      specialty: 'cardiology',
      specialtyName: 'Cardiologista',
      rating: 4.9,
      reviews: 127,
      experience: '15 anos',
      price: 180,
      image: '👨‍⚕️',
      location: 'São Paulo, SP',
      availability: 'Disponível hoje',
      description: 'Especialista em cardiologia preventiva e tratamento de doenças cardíacas.',
      languages: ['Português', 'Inglês'],
      insurance: ['SUS', 'Unimed', 'Bradesco'],
    },
    {
      id: 2,
      name: 'Dra. Ana Silva',
      specialty: 'nutrition',
      specialtyName: 'Nutricionista',
      rating: 4.8,
      reviews: 89,
      experience: '8 anos',
      price: 120,
      image: '👩‍⚕️',
      location: 'Rio de Janeiro, RJ',
      availability: 'Disponível amanhã',
      description: 'Nutricionista especializada em emagrecimento e nutrição esportiva.',
      languages: ['Português'],
      insurance: ['SUS', 'Amil'],
    },
    {
      id: 3,
      name: 'Dr. Roberto Santos',
      specialty: 'endocrinology',
      specialtyName: 'Endocrinologista',
      rating: 4.7,
      reviews: 156,
      experience: '12 anos',
      price: 200,
      image: '👨‍⚕️',
      location: 'Belo Horizonte, MG',
      availability: 'Disponível na próxima semana',
      description: 'Especialista em diabetes, tireoide e distúrbios hormonais.',
      languages: ['Português', 'Espanhol'],
      insurance: ['SUS', 'Unimed', 'SulAmérica'],
    },
    {
      id: 4,
      name: 'Dra. Maria Costa',
      specialty: 'psychology',
      specialtyName: 'Psicóloga',
      rating: 4.9,
      reviews: 98,
      experience: '10 anos',
      price: 150,
      image: '👩‍⚕️',
      location: 'São Paulo, SP',
      availability: 'Disponível hoje',
      description: 'Psicóloga clínica especializada em ansiedade e depressão.',
      languages: ['Português'],
      insurance: ['SUS', 'Unimed'],
    },
    {
      id: 5,
      name: 'Dr. João Oliveira',
      specialty: 'physiotherapy',
      specialtyName: 'Fisioterapeuta',
      rating: 4.6,
      reviews: 73,
      experience: '6 anos',
      price: 100,
      image: '👨‍⚕️',
      location: 'Brasília, DF',
      availability: 'Disponível amanhã',
      description: 'Fisioterapeuta especializado em reabilitação e prevenção de lesões.',
      languages: ['Português'],
      insurance: ['SUS', 'Bradesco'],
    },
  ];

  const filteredProviders = providers.filter(provider => {
    const matchesSpecialty = selectedSpecialty === 'all' || provider.specialty === selectedSpecialty;
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialtyName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('hoje')) return '#4CAF50';
    if (availability.includes('amanhã')) return '#FF9800';
    return '#666';
  };

  const renderProvider = ({ item }: { item: any }) => (
    <Card style={styles.providerCard}>
      <View style={styles.providerHeader}>
        <Avatar.Text 
          size={60} 
          label={item.image}
          style={styles.providerAvatar}
        />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.name}</Text>
          <Text style={styles.providerSpecialty}>{item.specialtyName}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews} avaliações)</Text>
          </View>
        </View>
        <View style={styles.providerActions}>
          <TouchableOpacity style={styles.favoriteButton}>
            <Icon name="favorite-border" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.providerDetails}>
        <View style={styles.detailRow}>
          <Icon name="location-on" size={16} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="schedule" size={16} color="#666" />
          <Text style={[styles.detailText, { color: getAvailabilityColor(item.availability) }]}>
            {item.availability}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="work" size={16} color="#666" />
          <Text style={styles.detailText}>{item.experience} de experiência</Text>
        </View>
      </View>

      <Text style={styles.providerDescription}>{item.description}</Text>

      <View style={styles.providerTags}>
        <Chip style={styles.priceChip}>
          R$ {item.price}/consulta
        </Chip>
        {item.languages.map((language: string, index: number) => (
          <Chip key={index} style={styles.tagChip}>
            {language}
          </Chip>
        ))}
      </View>

      <View style={styles.insuranceContainer}>
        <Text style={styles.insuranceTitle}>Convênios aceitos:</Text>
        <View style={styles.insuranceTags}>
          {item.insurance.map((insurance: string, index: number) => (
            <Chip key={index} style={styles.insuranceChip}>
              {insurance}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.providerButtons}>
        <Button
          mode="outlined"
          onPress={() => {
            // View profile
          }}
          style={styles.providerButton}
        >
          Ver Perfil
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            // Book appointment
          }}
          style={[styles.providerButton, styles.bookButton]}
        >
          Agendar
        </Button>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Provedores de Saúde</Text>
        <Text style={styles.subtitle}>Encontre o profissional ideal</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar profissionais..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Specialties */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.specialtiesContainer}
        contentContainerStyle={styles.specialtiesContent}
      >
        {specialties.map((specialty) => (
          <TouchableOpacity
            key={specialty.id}
            style={[
              styles.specialtyButton,
              selectedSpecialty === specialty.id && styles.selectedSpecialty
            ]}
            onPress={() => setSelectedSpecialty(specialty.id)}
          >
            <Icon 
              name={specialty.icon} 
              size={20} 
              color={selectedSpecialty === specialty.id ? '#fff' : '#4CAF50'} 
            />
            <Text style={[
              styles.specialtyText,
              selectedSpecialty === specialty.id && styles.selectedSpecialtyText
            ]}>
              {specialty.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Providers List */}
      <FlatList
        data={filteredProviders}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.providersList}
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  specialtiesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  specialtiesContent: {
    paddingHorizontal: 16,
  },
  specialtyButton: {
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
  selectedSpecialty: {
    backgroundColor: '#4CAF50',
  },
  specialtyText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  selectedSpecialtyText: {
    color: '#fff',
  },
  providersList: {
    padding: 16,
  },
  providerCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerAvatar: {
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  providerSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  providerActions: {
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 4,
  },
  providerDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  providerDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  providerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  priceChip: {
    backgroundColor: '#4CAF50',
    marginRight: 6,
    marginBottom: 4,
  },
  tagChip: {
    backgroundColor: '#E8F5E8',
    marginRight: 6,
    marginBottom: 4,
  },
  insuranceContainer: {
    marginBottom: 16,
  },
  insuranceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  insuranceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  insuranceChip: {
    backgroundColor: '#f0f0f0',
    marginRight: 6,
    marginBottom: 4,
  },
  providerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  bookButton: {
    backgroundColor: '#4CAF50',
  },
});

export default HealthProviderScreen;
