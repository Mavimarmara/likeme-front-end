import React, { useMemo } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { FloatingMenu } from '@/components/ui/menu';
import { NextEventsSection } from '@/components/ui/community';
import type { Event } from '@/types/event';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Home Mobility Challenge',
    date: '04 June',
    time: '08:30 am',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    participants: [
      { id: '1', name: 'A', color: 'Green' },
      { id: '2', name: 'B', color: 'Blue' },
      { id: '3', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    ],
    participantsCount: 8,
  },
  {
    id: '2',
    title: 'Trail Run - United State',
    date: '05 June',
    time: '06:30 am',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    participants: [
      { id: '1', name: 'A', color: 'Green' },
      { id: '2', name: 'B', color: 'Pink' },
      { id: '3', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    ],
    participantsCount: 25,
  },
  {
    id: '3',
    title: 'Yoga Session - Morning Flow',
    date: '06 June',
    time: '07:00 am',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
    participants: [
      { id: '1', name: 'A', color: 'Blue' },
      { id: '2', name: 'B', color: 'Light Pink' },
      { id: '3', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
    ],
    participantsCount: 15,
  },
];

const SummaryScreen: React.FC<Props> = ({ navigation }) => {
  const rootNavigation = navigation.getParent() ?? navigation;

  const menuItems = useMemo(
    () => [
      {
        id: 'activities',
        icon: 'fitness-center',
        label: 'Atividades',
        fullLabel: 'Atividades',
        onPress: () => rootNavigation.navigate('Activities' as never),
      },
      {
        id: 'marketplace',
        icon: 'store',
        label: 'Marketplace',
        fullLabel: 'Marketplace',
        onPress: () => rootNavigation.navigate('Marketplace' as never),
      },
      {
        id: 'community',
        icon: 'group',
        label: 'Comunidade',
        fullLabel: 'Comunidade',
        onPress: () => rootNavigation.navigate('Community' as never),
      },
      {
        id: 'profile',
        icon: 'person',
        label: 'Perfil',
        fullLabel: 'Perfil',
        onPress: () => rootNavigation.navigate('Profile' as never),
      },
    ],
    [rootNavigation]
  );

  const handleEventPress = (event: Event) => {
    console.log('Evento pressionado:', event.id);
    // Adicionar navegação para detalhes do evento se necessário
  };

  const handleEventSave = (event: Event) => {
    console.log('Salvar evento:', event.id);
    // Adicionar lógica para salvar evento
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.eventsContainer}>
          <NextEventsSection
            events={mockEvents}
            onEventPress={handleEventPress}
            onEventSave={handleEventSave}
          />
        </View>
      </ScrollView>
      <FloatingMenu items={menuItems} selectedId="home" />
    </SafeAreaView>
  );
};

export default SummaryScreen;

