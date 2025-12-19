import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FloatingMenu } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { BackgroundIconButton } from '@/assets';
import { ProductsCarousel, PlansCarousel, type Product, type Plan } from '@/components/sections/product';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ActivitiesScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Activities'>;
};

type TabType = 'actives' | 'history';
type FilterType = 'all' | 'activities' | 'appointments';

interface ActivityItem {
  id: string;
  type: 'program' | 'appointment' | 'personal';
  title: string;
  description: string;
  dateTime?: string;
  providerName?: string;
  providerAvatar?: string;
  completed?: boolean;
  isFavorite?: boolean;
}

const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({ navigation }) => {
  const rootNavigation = navigation.getParent() ?? navigation;
  const [activeTab, setActiveTab] = useState<TabType>('actives');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFestivalBanner, setShowFestivalBanner] = useState(true);

  // Mock data - será substituído por dados reais do backend
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'program',
      title: 'Breathing exercises',
      description: 'Every evening, write down three moments of the day that triggered a strong emotion',
      completed: false,
      isFavorite: true,
    },
    {
      id: '2',
      type: 'program',
      title: 'Mindful meditation',
      description: 'Cultivate inner peace and balance to boost positivity',
      completed: false,
      isFavorite: false,
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Therapy Session',
      description: 'Therapy Session with',
      dateTime: '13 Nov. at 8:15 pm',
      providerName: 'Avery Parker',
      providerAvatar: 'A',
      completed: false,
    },
    {
      id: '4',
      type: 'program',
      title: 'Yoga practice',
      description: 'Engage in a 15-minute session to enhance flexibility and calmness',
      completed: true,
      isFavorite: true,
    },
    {
      id: '5',
      type: 'personal',
      title: 'Guided meditation',
      description: 'Start a journal and record daily affirmations for self-encouragement',
      completed: true,
      isFavorite: true,
    },
  ];

  const historyActivities = activities.filter(a => a.completed);
  const activeActivities = activities.filter(a => !a.completed);

  const filteredActivities = useMemo(() => {
    const source = activeTab === 'history' ? historyActivities : activeActivities;
    if (selectedFilter === 'all') {
      return source;
    }
    if (selectedFilter === 'activities') {
      return source.filter(a => a.type === 'program' || a.type === 'personal');
    }
    return source.filter(a => a.type === 'appointment');
  }, [activeTab, selectedFilter]);

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

  const handleMarkAsDone = (activityId: string) => {
    // Implementar lógica de marcar como concluído
    console.log('Mark as done:', activityId);
  };

  const handleViewActivity = (activity: ActivityItem) => {
    // Navegar para detalhes da atividade
    console.log('View activity:', activity.id);
  };

  const handleSkipAppointment = (activityId: string) => {
    // Implementar lógica de pular appointment
    console.log('Skip appointment:', activityId);
  };

  const handleOpenMeet = (activityId: string) => {
    // Abrir meet/appointment
    console.log('Open meet:', activityId);
  };

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'actives' && styles.tabActive]}
        onPress={() => setActiveTab('actives')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'actives' && styles.tabTextActive]}>
          Actives
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'history' && styles.tabActive]}
        onPress={() => setActiveTab('history')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
          History
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <TouchableOpacity
        style={styles.createButton}
        activeOpacity={0.7}
        onPress={() => console.log('Create activity')}
      >
        <Text style={styles.createButtonText}>Create activities +</Text>
      </TouchableOpacity>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScroll}
      >
        <TouchableOpacity style={styles.filterPill} activeOpacity={0.7}>
          <Text style={styles.filterText}>Day</Text>
          <Icon name="arrow-drop-down" size={16} color="#001137" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, selectedFilter === 'all' && styles.filterPillSelected]}
          onPress={() => setSelectedFilter('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextSelected]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, selectedFilter === 'activities' && styles.filterPillSelected]}
          onPress={() => setSelectedFilter('activities')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedFilter === 'activities' && styles.filterTextSelected]}>
            Activities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, selectedFilter === 'appointments' && styles.filterPillSelected]}
          onPress={() => setSelectedFilter('appointments')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, selectedFilter === 'appointments' && styles.filterTextSelected]}>
            Appointments
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderFestivalBanner = () => {
    if (!showFestivalBanner || activeTab === 'history') return null;

    return (
      <View style={styles.festivalBanner}>
        <TouchableOpacity
          style={styles.bannerCloseButton}
          onPress={() => setShowFestivalBanner(false)}
          activeOpacity={0.7}
        >
          <Icon name="close" size={16} color="#001137" />
        </TouchableOpacity>
        <View style={styles.bannerContent}>
          <Icon name="notifications" size={20} color="#001137" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerText}>
              Spring Festival kicks off in 2 hours—don't miss it!
            </Text>
            <Text style={styles.bannerSubtext}>Today – Thu 08:30 pm</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderActivityCard = (activity: ActivityItem) => {
    const typeLabels = {
      program: 'Programs',
      appointment: 'Appointments',
      personal: 'Personal',
    };

    return (
      <View key={activity.id} style={styles.activityCard}>
        <View style={styles.cardHeader}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{typeLabels[activity.type]}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="more-vert" size={20} color="#001137" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardTitleRow}>
            {activity.isFavorite && (
              <Icon name="star" size={20} color="#001137" style={styles.starIcon} />
            )}
            {activity.type === 'appointment' && activity.dateTime && (
              <View style={styles.dateTimeContainer}>
                <Icon name="event" size={16} color="#001137" />
                <Text style={styles.dateTimeText}>{activity.dateTime}</Text>
              </View>
            )}
            <Text style={styles.cardTitle}>{activity.title}</Text>
          </View>

          <Text style={styles.cardDescription}>{activity.description}</Text>

          {activity.type === 'appointment' && activity.providerName && (
            <View style={styles.providerContainer}>
              <Text style={styles.providerText}>Therapy Session with</Text>
              <View style={styles.providerAvatar}>
                <Text style={styles.providerAvatarText}>{activity.providerAvatar}</Text>
              </View>
            </View>
          )}

          <View style={styles.cardActions}>
            {activity.completed ? (
              <View style={[styles.actionButton, styles.doneButton]}>
                <Icon name="check" size={16} color="#001137" />
                <Text style={styles.doneButtonText}>Done ✓</Text>
              </View>
            ) : activity.type === 'appointment' ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.openButton]}
                onPress={() => handleOpenMeet(activity.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.openButtonText}>Open meet {'>'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.markButton]}
                onPress={() => handleMarkAsDone(activity.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.markButtonText}>Mark as done</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => handleViewActivity(activity)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewLink}>
                {activity.type === 'appointment' ? 'Skip' : 'View'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderRecommendations = () => {
    if (activeTab === 'history') return null;

    return (
      <View style={styles.recommendationsCard}>
        <Text style={styles.recommendationsTitle}>
          Let's do a new mental state anamnesis?
        </Text>
        <Text style={styles.recommendationsSubtitle}>Recommended after 30 days</Text>
        <Text style={styles.recommendationsDescription}>
          Just tap below to start a chat with our specialist team and get the support you need.
        </Text>
        <TouchableOpacity
          style={styles.anamnesisButton}
          activeOpacity={0.7}
          onPress={() => console.log('Start anamnesis')}
        >
          <Text style={styles.anamnesisButtonText}>Start Anamnesis</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPlansCarousel = () => {
    if (activeTab === 'history') return null;

    // Mock plans data - será substituído por dados reais
    const plans: Plan[] = [
      {
        id: '1',
        title: 'Strategies to relax in your day to day',
        price: 130.99,
        currency: 'BRL',
        tag: 'Curated for you',
        tagColor: 'green',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        likes: 10,
      },
      {
        id: '2',
        title: 'How to evolve to a deep sleep',
        price: 55.99,
        currency: 'BRL',
        tag: 'Market-based',
        tagColor: 'green',
        image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800',
        likes: 10,
      },
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Plans for you based on the evolution of your markers
        </Text>
        <Text style={styles.sectionSubtitle}>
          Discover our options selected just for you
        </Text>
        <View style={styles.carouselWrapper}>
          <PlansCarousel
            title=""
            subtitle=""
            plans={plans}
            onPlanPress={(plan) => console.log('Plan pressed:', plan.id)}
            onPlanLike={(plan) => console.log('Plan liked:', plan.id)}
          />
        </View>
      </View>
    );
  };

  const renderProductsCarousel = () => {
    if (activeTab === 'history') return null;

    // Mock products data - será substituído por dados reais
    const products: Product[] = [
      {
        id: '1',
        title: 'Tongue scrapper',
        price: 80.00,
        tag: 'Curated for you',
        image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc5a?w=800',
        likes: 10,
      },
      {
        id: '2',
        title: 'Omega 3 supplement',
        price: 60.00,
        tag: 'For your program',
        image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800',
        likes: 10,
      },
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products curated for you</Text>
        <Text style={styles.sectionSubtitle}>
          Discover our options selected just for you
        </Text>
        <View style={styles.carouselWrapper}>
          <ProductsCarousel
            title=""
            subtitle=""
            products={products}
            onProductPress={(product) => console.log('Product pressed:', product.id)}
            onProductLike={(product) => console.log('Product liked:', product.id)}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header showBackButton={false} />
      <View style={styles.content}>
        {renderTabs()}
        {renderFilters()}
        {renderFestivalBanner()}

        {activeTab === 'actives' && (
          <Text style={styles.sectionLabel}>
            Mark as done for completed activities
          </Text>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredActivities.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'history' ? 'No history found' : 'No activities found'}
              </Text>
            </View>
          ) : (
            filteredActivities.map(renderActivityCard)
          )}

          {renderRecommendations()}
          {renderPlansCarousel()}
          {renderProductsCarousel()}
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId="activities" />
    </SafeAreaView>
  );
};

export default ActivitiesScreen;
