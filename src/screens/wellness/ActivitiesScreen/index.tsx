import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FloatingMenu, FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { Toggle, PrimaryButton, Badge } from '@/components/ui';
import { CreateActivityModal } from '@/components/sections/activity';
import { BackgroundIconButton } from '@/assets';
import { ProductsCarousel, PlansCarousel, type Product, type Plan } from '@/components/sections/product';
import { orderService } from '@/services';
import { formatPrice } from '@/utils/formatters';
import type { Order } from '@/types/order';
import type { RootStackParamList } from '@/types/navigation';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ActivitiesScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Activities'>;
};

type TabType = 'actives' | 'history';
type FilterType = 'all' | 'activities' | 'appointments' | 'orders';

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
  const [isCreateActivityModalVisible, setIsCreateActivityModalVisible] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [daySortOrder, setDaySortOrder] = useState<'asc' | 'desc'>('desc');

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

  useEffect(() => {
    if (activeTab === 'history') {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await orderService.listOrders({
        page: 1,
        limit: 50,
      });
      if (response.success && response.data?.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const filteredActivities = useMemo(() => {
    let source = activeTab === 'history' ? historyActivities : activeActivities;
    
    // Apply filter
    if (selectedFilter === 'all') {
      // Keep all
    } else if (selectedFilter === 'activities') {
      source = source.filter(a => a.type === 'program' || a.type === 'personal');
    } else {
      source = source.filter(a => a.type === 'appointment');
    }

    // Sort by date
    const sorted = [...source].sort((a, b) => {
      // Try to parse dates from dateTime or use createdAt
      let dateA = 0;
      let dateB = 0;
      
      if (a.dateTime) {
        // Try to parse dateTime string (e.g., "13 Nov. at 8:15 pm")
        const parsedA = new Date(a.dateTime);
        dateA = isNaN(parsedA.getTime()) ? 0 : parsedA.getTime();
      }
      
      if (b.dateTime) {
        const parsedB = new Date(b.dateTime);
        dateB = isNaN(parsedB.getTime()) ? 0 : parsedB.getTime();
      }
      
      // If dates are equal or both 0, maintain original order
      if (dateA === dateB) {
        return 0;
      }
      
      return daySortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return sorted;
  }, [activeTab, selectedFilter, daySortOrder, historyActivities, activeActivities]);

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
      <Toggle
        options={['Actives', 'History'] as const}
        selected={activeTab === 'actives' ? 'Actives' : 'History'}
        onSelect={(option) => setActiveTab(option === 'Actives' ? 'actives' : 'history')}
      />
    </View>
  );

  const filterCarouselOptions: ButtonCarouselOption<FilterType>[] = [
    { id: 'all', label: 'All' },
    { id: 'activities', label: 'Activities' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'orders', label: 'Orders' },
  ];

  const handleDaySortToggle = () => {
    setDaySortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <FilterMenu
        filterButtonLabel="Day"
        onFilterButtonPress={handleDaySortToggle}
        filterButtonIcon={daySortOrder === 'asc' ? 'arrow-drop-up' : 'arrow-drop-down'}
        carouselOptions={filterCarouselOptions}
        selectedCarouselId={selectedFilter}
        onCarouselSelect={(optionId) => setSelectedFilter(optionId)}
      />
      {activeTab === 'actives' && (
        <View style={styles.createButtonContainer}>
          <PrimaryButton
            label="Create activities +"
            onPress={() => setIsCreateActivityModalVisible(true)}
            style={styles.createButton}
          />
        </View>
      )}
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
          <Icon name="notifications" size={20} color="#001137" style={styles.bannerIcon} />
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

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return daySortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }, [orders, daySortOrder]);

  const renderOrderCard = (order: Order) => {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });

    const itemsCount = order.items?.length || 0;
    const itemsText = itemsCount === 1 ? 'item' : 'items';

    const getStatusText = () => {
      if (order.paymentStatus === 'paid') {
        return 'Paid ✓';
      }
      if (order.paymentStatus === 'pending') {
        return 'Pending';
      }
      return order.status.charAt(0).toUpperCase() + order.status.slice(1);
    };

    return (
      <View key={`order-${order.id}`} style={styles.activityCard}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Badge label="Order" color="orange" />
            <TouchableOpacity activeOpacity={0.7}>
              <Icon name="more-vert" size={20} color="#001137" />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.cardTitle}>Order #{order.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={styles.cardDescription}>
              {itemsCount} {itemsText} • {formatPrice(order.total)}
            </Text>
            {order.createdAt && (
              <View style={styles.dateTimeContainer}>
                <Icon name="event" size={16} color="#001137" />
                <Text style={styles.dateTimeText}>{orderDate}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardActions}>
            <View style={[styles.actionButton, styles.doneButton]}>
              <Icon name="check" size={16} color="#001137" />
              <Text style={styles.doneButtonText}>{getStatusText()}</Text>
            </View>

            <TouchableOpacity
              onPress={() => console.log('View order:', order.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewLink}>View</Text>
            </TouchableOpacity>
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

    // For appointments, show date/time in title row
    if (activity.type === 'appointment') {
      return (
        <View key={activity.id} style={[styles.activityCard, styles.appointmentCard]}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Badge label={typeLabels[activity.type]} color="orange" />
              <TouchableOpacity activeOpacity={0.7}>
                <Icon name="more-vert" size={20} color="#001137" />
              </TouchableOpacity>
            </View>

            <View>
              {activity.dateTime && (
                <View style={styles.appointmentDateTimeRow}>
                  <Icon name="event" size={16} color="#001137" />
                  <Text style={styles.appointmentDateTimeText}>{activity.dateTime}</Text>
                </View>
              )}

              {activity.providerName && (
                <View style={styles.providerContainer}>
                  <Text style={styles.providerText}>Therapy Session with</Text>
                  <View style={styles.providerAvatar}>
                    <Text style={styles.providerAvatarText}>{activity.providerAvatar || 'A'}</Text>
                  </View>
                  <Text style={styles.providerName}>{activity.providerName}</Text>
                </View>
              )}
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.openButton]}
                onPress={() => handleOpenMeet(activity.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.openButtonText}>Open meet {'>'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleViewActivity(activity)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewLink}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    // For regular activities (programs/personal)
    return (
      <View key={activity.id} style={styles.activityCard}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Badge label={typeLabels[activity.type]} color="orange" />
            <TouchableOpacity activeOpacity={0.7}>
              <Icon name="more-vert" size={20} color="#001137" />
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.cardTitleRow}>
              {activity.isFavorite && (
                <Icon name="star" size={20} color="#001137" style={styles.starIcon} />
              )}
              <Text style={styles.cardTitle}>{activity.title}</Text>
            </View>
            <Text style={styles.cardDescription}>{activity.description}</Text>
          </View>

          <View style={styles.cardActions}>
            {activity.completed ? (
              <View style={[styles.actionButton, styles.doneButton]}>
                <Icon name="check" size={16} color="#001137" />
                <Text style={styles.doneButtonText}>Done ✓</Text>
              </View>
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
              <Text style={styles.viewLink}>View</Text>
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
          {activeTab === 'history' ? (
            <>
              {selectedFilter === 'all' && (
                <>
                  {filteredActivities.map(renderActivityCard)}
                  {sortedOrders.map(renderOrderCard)}
                </>
              )}
              {selectedFilter === 'activities' && filteredActivities.map(renderActivityCard)}
              {selectedFilter === 'appointments' && filteredActivities.map(renderActivityCard)}
              {selectedFilter === 'orders' && sortedOrders.map(renderOrderCard)}
              {selectedFilter === 'all' && filteredActivities.length === 0 && sortedOrders.length === 0 && !isLoadingOrders && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No history found</Text>
                </View>
              )}
              {selectedFilter === 'activities' && filteredActivities.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No activities found</Text>
                </View>
              )}
              {selectedFilter === 'appointments' && filteredActivities.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No appointments found</Text>
                </View>
              )}
              {selectedFilter === 'orders' && sortedOrders.length === 0 && !isLoadingOrders && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No orders found</Text>
                </View>
              )}
            </>
          ) : (
            <>
              {filteredActivities.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No activities found</Text>
                </View>
              ) : (
                filteredActivities.map(renderActivityCard)
              )}
              {renderRecommendations()}
              {activeTab === 'actives' && plans.length > 0 && (
                <View>
                  <PlansCarousel
                    title="Plans for you based on the evolution of your markers"
                    subtitle="Discover our options selected just for you"
                    plans={plans}
                    onPlanPress={(plan) => console.log('Plan pressed:', plan.id)}
                    onPlanLike={(plan) => console.log('Plan liked:', plan.id)}
                  />
                </View>
              )}
              {activeTab === 'actives' && products.length > 0 && (
                <View>
                  <ProductsCarousel
                    title="Products recommended for your sleep journey by Dr. Peter Valasquez"
                    subtitle="Discover our options selected just for you"
                    products={products}
                    onProductPress={(product) => console.log('Product pressed:', product.id)}
                    onProductLike={(product) => console.log('Product liked:', product.id)}
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId="activities" />
      <CreateActivityModal
        visible={isCreateActivityModalVisible}
        onClose={() => setIsCreateActivityModalVisible(false)}
        onSave={(data) => {
          console.log('Activity created:', data);
          // TODO: Implement save logic
        }}
      />
    </SafeAreaView>
  );
};

export default ActivitiesScreen;
