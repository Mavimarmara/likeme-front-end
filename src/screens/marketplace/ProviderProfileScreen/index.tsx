import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { BackgroundIconButton } from '@/assets';
import { ImageBackground } from 'react-native';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ProviderProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ProviderProfile'>;
  route: {
    params: {
      providerId: string;
      provider?: {
        name: string;
        avatar?: string;
        title?: string;
        description?: string;
        rating?: number;
        specialties?: string[];
      };
    };
  };
};

const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({ navigation, route }) => {
  const { providerId, provider } = route.params;

  const providerData = provider || {
    name: 'Dr. Avery Parker',
    title: 'Therapist & Wellness Coach',
    description: 'Specialized in mental health and wellness coaching with over 10 years of experience.',
    rating: 4.8,
    specialties: ['Mental Health', 'Wellness Coaching', 'Therapy'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleBookAppointment = () => {
    // Navegar para agendamento
    console.log('Book appointment with:', providerId);
  };

  const handleSendMessage = () => {
    // Navegar para chat
    console.log('Send message to:', providerId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header showBackButton={true} onBackPress={handleBackPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {providerData.avatar ? (
              <Image
                source={{ uri: providerData.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {providerData.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.providerName}>{providerData.name}</Text>
          {providerData.title && (
            <Text style={styles.providerTitle}>{providerData.title}</Text>
          )}
          {providerData.rating && (
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#FFB800" />
              <Text style={styles.ratingText}>{providerData.rating}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {providerData.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.descriptionText}>{providerData.description}</Text>
          </View>
        )}

        {/* Specialties */}
        {providerData.specialties && providerData.specialties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <View style={styles.specialtiesContainer}>
              {providerData.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyBadge}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleBookAppointment}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSendMessage}
            activeOpacity={0.7}
          >
            <Icon name="message" size={20} color="#001137" />
            <Text style={styles.secondaryButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProviderProfileScreen;
