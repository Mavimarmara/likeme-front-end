import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ImageBackground, Dimensions, Modal, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FloatingMenu, FilterMenu, type ButtonCarouselOption } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { Toggle, PrimaryButton, Badge } from '@/components/ui';
import { CreateActivityModal } from '@/components/sections/activity';
import { BackgroundIconButton, DoneIcon, CloseIcon } from '@/assets';
import { ProductsCarousel, PlansCarousel, type Product, type Plan } from '@/components/sections/product';
import { EventReminder } from '@/components/ui/cards';
import { orderService, activityService } from '@/services';
import { formatPrice } from '@/utils/formatters';
import { sortByDateTime, sortByDateField } from '@/utils/sorters/dateTimeSorter';
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
  declined?: boolean;
  isFavorite?: boolean;
  meetUrl?: string;
}

const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({ navigation }) => {
  const rootNavigation = navigation.getParent() ?? navigation;
  const [activeTab, setActiveTab] = useState<TabType>('actives');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFestivalBanner, setShowFestivalBanner] = useState(true);
  const [isCreateActivityModalVisible, setIsCreateActivityModalVisible] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editingActivityData, setEditingActivityData] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [daySortOrder, setDaySortOrder] = useState<'asc' | 'desc'>('desc');
  const [menuVisibleForId, setMenuVisibleForId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [rawActivities, setRawActivities] = useState<any[]>([]); // Armazenar dados originais do backend
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const historyActivities = activities.filter(a => a.completed);
  const activeActivities = activities.filter(a => !a.completed);

  const loadActivities = async (includeDeletedActivities = false) => {
    try {
      setIsLoadingActivities(true);
      const response = await activityService.listActivities({
        page: 1,
        limit: 100,
        includeDeleted: includeDeletedActivities,
      });
      if (response.success && response.data?.activities) {
        // Armazenar dados originais
        setRawActivities(response.data.activities);
        
        // Converter UserActivity para ActivityItem
        const convertedActivities: ActivityItem[] = response.data.activities.map((activity) => {
          let dateTime: string | undefined;
          if (activity.startDate) {
            // Parsear a data como local (não UTC) para evitar problemas de timezone
            // O backend retorna como ISO string (UTC), precisamos extrair apenas a data
            const dateStr = activity.startDate;
            let date: Date;
            
            // Extrair apenas a parte da data (YYYY-MM-DD) da string ISO
            const dateOnly = dateStr.split('T')[0];
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
              // Formato YYYY-MM-DD - criar como data local para preservar o dia correto
              const [year, month, day] = dateOnly.split('-').map(Number);
              date = new Date(year, month - 1, day);
            } else {
              // Outro formato - usar new Date normalmente
              date = new Date(activity.startDate);
            }
            const formattedDate = formatDate(date);
            if (activity.startTime) {
              dateTime = `${formattedDate} at ${activity.startTime}`;
            } else {
              dateTime = formattedDate;
            }
          }

          const description = activity.description || activity.location || '';
          const isCompleted = activity.deletedAt !== null && description.startsWith('[COMPLETED]');
          const isDeclined = activity.deletedAt !== null && !isCompleted;
          
          // Verificar se location contém uma URL válida (link do meet)
          const isUrl = (str: string | null | undefined): boolean => {
            if (!str) return false;
            return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('www.') || str.startsWith('meet.google');
          };
          
          const meetUrl = activity.location && isUrl(activity.location) ? activity.location : undefined;
          const providerName = activity.location?.includes('Meet') && !isUrl(activity.location) 
            ? activity.location.replace('Meet with ', '') 
            : undefined;
          
          return {
            id: activity.id,
            type: activity.type === 'task' ? 'personal' : activity.type === 'event' ? 'appointment' : 'program',
            title: activity.name,
            description: description.replace(/^\[COMPLETED\]/, ''), // Remover marcador da descrição exibida
            dateTime,
            providerName,
            providerAvatar: providerName ? providerName.charAt(0) : undefined,
            completed: activity.deletedAt !== null,
            declined: isDeclined,
            isFavorite: false,
            meetUrl,
          };
        });
        setActivities(convertedActivities);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      // Em caso de erro, manter array vazio
      setActivities([]);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => {
    // Incluir atividades deletadas (skipadas) quando estiver na aba de histórico
    const includeDeleted = activeTab === 'history';
    loadActivities(includeDeleted);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'history') {
      loadOrders();
    }
  }, [activeTab]);

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}.`;
  };

  // Função para parsear time string (ex: "8:15 pm") para Date
  const parseTimeString = (timeString: string, baseDate: Date): Date => {
    const date = new Date(baseDate);
    const time = timeString.toLowerCase().trim();
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':');
    let hour = parseInt(hours, 10);
    const min = parseInt(minutes || '0', 10);

    if (period === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period === 'am' && hour === 12) {
      hour = 0;
    }

    date.setHours(hour, min, 0, 0);
    return date;
  };

  // Função para verificar se é hoje
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Função para encontrar a próxima atividade que acontece hoje usando dados originais
  const getUpcomingActivity = useMemo(() => {
    if (activeTab === 'history' || rawActivities.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Filtrar atividades que não estão deletadas, têm startDate e acontecem hoje
    const todayActivities = rawActivities
      .filter((activity) => {
        if (activity.deletedAt || !activity.startDate) return false;

        try {
          // Verificar se a data é hoje - parsear como data local
          // O backend retorna como ISO string (ex: "2024-01-09T00:00:00.000Z")
          // Precisamos extrair apenas a parte da data (YYYY-MM-DD)
          let startDate: Date;
          if (typeof activity.startDate === 'string') {
            // Extrair apenas a parte da data da string ISO
            const dateOnly = activity.startDate.split('T')[0];
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
              // Formato YYYY-MM-DD - criar como data local para preservar o dia correto
              const [year, month, day] = dateOnly.split('-').map(Number);
              startDate = new Date(year, month - 1, day);
            } else {
              startDate = new Date(activity.startDate);
            }
          } else {
            startDate = new Date(activity.startDate);
          }
          startDate.setHours(0, 0, 0, 0);
          
          // Verificar se é hoje
          const isTodayDate = startDate.getTime() === today.getTime();
          
          // Retornar true se for hoje (mostrar todas as atividades de hoje)
          return isTodayDate;
        } catch (error) {
          console.error('Error parsing activity date/time:', error);
          return false;
        }
      })
      .sort((a, b) => {
        try {
          // Parsear datas corretamente (extrair da string ISO)
          let dateA: Date;
          let dateB: Date;
          
          if (typeof a.startDate === 'string') {
            const dateOnlyA = a.startDate.split('T')[0];
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnlyA)) {
              const [year, month, day] = dateOnlyA.split('-').map(Number);
              dateA = new Date(year, month - 1, day);
            } else {
              dateA = new Date(a.startDate);
            }
          } else {
            dateA = new Date(a.startDate);
          }
          
          if (typeof b.startDate === 'string') {
            const dateOnlyB = b.startDate.split('T')[0];
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnlyB)) {
              const [year, month, day] = dateOnlyB.split('-').map(Number);
              dateB = new Date(year, month - 1, day);
            } else {
              dateB = new Date(b.startDate);
            }
          } else {
            dateB = new Date(b.startDate);
          }
          
          // Se ambas têm startTime, ordenar por hora
          if (a.startTime && b.startTime) {
            const timeA = parseTimeString(a.startTime, dateA);
            const timeB = parseTimeString(b.startTime, dateB);
            return timeA.getTime() - timeB.getTime();
          }
          
          // Se só uma tem startTime, priorizar a que tem
          if (a.startTime && !b.startTime) return -1;
          if (!a.startTime && b.startTime) return 1;
          
          // Se nenhuma tem, manter ordem original
          return 0;
        } catch {
          return 0;
        }
      });

    return todayActivities.length > 0 ? todayActivities[0] : null;
  }, [rawActivities, activeTab]);

  // Função para calcular tempo restante e formatar mensagem
  const getReminderMessage = (activity: any): string => {
    if (!activity || !activity.startDate) {
      return activity?.name || 'Event is coming up soon!';
    }

    try {
      const now = new Date();
      
      // Se não tiver startTime, apenas mostrar que é hoje
      if (!activity.startTime) {
        return `${activity.name} is scheduled for today—don't miss it!`;
      }

      // Parsear como data local para evitar problemas de timezone
      // O backend retorna como ISO string, extrair apenas a parte da data
      let startDate: Date;
      if (typeof activity.startDate === 'string') {
        const dateOnly = activity.startDate.split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
          // Formato YYYY-MM-DD - criar como data local
          const [year, month, day] = dateOnly.split('-').map(Number);
          startDate = new Date(year, month - 1, day);
        } else {
          startDate = new Date(activity.startDate);
        }
      } else {
        startDate = new Date(activity.startDate);
      }
      const activityDateTime = parseTimeString(activity.startTime, startDate);
      const diffMs = activityDateTime.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);

      if (diffHours > 0) {
        return `${activity.name} kicks off in ${diffHours} hour${diffHours > 1 ? 's' : ''}—don't miss it!`;
      } else if (diffMinutes > 0) {
        return `${activity.name} starts in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}—don't miss it!`;
      } else if (diffMinutes > -60) {
        // Se passou há menos de 1 hora, ainda mostrar
        return `${activity.name} is happening now—don't miss it!`;
      } else {
        return `${activity.name} is scheduled for today—don't miss it!`;
      }
    } catch (error) {
      console.error('Error calculating reminder message:', error);
      return `${activity.name} is scheduled for today—don't miss it!`;
    }
  };

  // Função para extrair data e hora
  const getReminderDateAndTime = (activity: any): { date: string; time: string } => {
    if (!activity || !activity.startDate) {
      return { date: 'Today', time: '' };
    }

    try {
      // Parsear como data local para evitar problemas de timezone
      // O backend retorna como ISO string, extrair apenas a parte da data
      let startDate: Date;
      if (typeof activity.startDate === 'string') {
        const dateOnly = activity.startDate.split('T')[0];
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
          // Formato YYYY-MM-DD - criar como data local
          const [year, month, day] = dateOnly.split('-').map(Number);
          startDate = new Date(year, month - 1, day);
        } else {
          startDate = new Date(activity.startDate);
        }
      } else {
        startDate = new Date(activity.startDate);
      }
      const isTodayDate = isToday(startDate);
      
      return {
        date: isTodayDate ? 'Today' : formatDate(startDate),
        time: activity.startTime || '',
      };
    } catch (error) {
      console.error('Error parsing date and time:', error);
      return { date: 'Today', time: '' };
    }
  };

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
    const sorted = sortByDateTime(source, daySortOrder, (item) => item.dateTime);

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

  const handleMarkAsDone = async (activityId: string) => {
    try {
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;

      // Atualizar a descrição para incluir marcador de completada antes de deletar
      const updatedDescription = activity.description.startsWith('[COMPLETED]') 
        ? activity.description 
        : `[COMPLETED]${activity.description}`;
      
      // Atualizar a atividade com a descrição marcada antes de deletar
      await activityService.updateActivity(activityId, {
        description: updatedDescription,
      });
      
      // Marcar atividade como concluída (deletada) para que apareça no histórico como completada
      await activityService.deleteActivity(activityId);
      // Recarregar atividades para atualizar a lista
      await loadActivities(activeTab === 'history');
    } catch (error) {
      console.error('Error marking activity as done:', error);
      Alert.alert('Error', 'Failed to mark activity as done');
    }
  };

  const handleViewActivity = (activity: ActivityItem) => {
    // Abrir modal de edição
    setEditingActivityData({
      name: activity.title,
      type: activity.type === 'personal' ? 'task' : activity.type === 'appointment' ? 'event' : 'event',
      startDate: activity.dateTime ? extractDateFromDateTime(activity.dateTime) : undefined,
      startTime: activity.dateTime ? extractTimeFromDateTime(activity.dateTime) : undefined,
      location: activity.providerName ? `Meet with ${activity.providerName}` : activity.description || '',
      description: activity.description,
      reminderEnabled: false,
      reminderMinutes: 5,
    });
    setEditingActivityId(activity.id);
    setIsCreateActivityModalVisible(true);
    setMenuVisibleForId(null);
  };

  const handleDeleteActivity = async (activityId: string) => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await activityService.deleteActivity(activityId);
              await loadActivities(activeTab === 'history');
              setMenuVisibleForId(null);
            } catch (error) {
              console.error('Error deleting activity:', error);
              Alert.alert('Error', 'Failed to delete activity');
            }
          },
        },
      ]
    );
  };

  const handleMenuPress = (activityId: string, event: any) => {
    event.persist();
    const { pageX, pageY } = event.nativeEvent;
    // Ajustar posição para aparecer abaixo e à direita do botão
    setMenuPosition({ x: pageX - 100, y: pageY + 10 });
    setMenuVisibleForId(activityId);
  };

  const extractDateFromDateTime = (dateTime: string): string => {
    // Parse dateTime like "13 Nov. at 8:15 pm"
    try {
      const parts = dateTime.split(' at ');
      if (parts.length > 0) {
        const datePart = parts[0]; // "13 Nov."
        const [day, month] = datePart.split(' ');
        const monthMap: Record<string, string> = {
          'Jan.': '01', 'Feb.': '02', 'Mar.': '03', 'Apr.': '04',
          'May.': '05', 'Jun.': '06', 'Jul.': '07', 'Aug.': '08',
          'Sep.': '09', 'Oct.': '10', 'Nov.': '11', 'Dec.': '12',
        };
        const currentYear = new Date().getFullYear();
        const monthNum = monthMap[month] || '01';
        return `${currentYear}-${monthNum}-${day.padStart(2, '0')}`;
      }
    } catch (e) {
      console.error('Error parsing date:', e);
    }
    return new Date().toISOString().split('T')[0];
  };

  const extractTimeFromDateTime = (dateTime: string): string => {
    // Parse dateTime like "13 Nov. at 8:15 pm"
    try {
      const parts = dateTime.split(' at ');
      if (parts.length > 1) {
        return parts[1]; // "8:15 pm"
      }
    } catch (e) {
      console.error('Error parsing time:', e);
    }
    return '8:00 am';
  };

  const handleSkipAppointment = async (activityId: string) => {
    try {
      // Marcar atividade como declinada (deletada) para que apareça no histórico como declinada
      await activityService.deleteActivity(activityId);
      // Atualizar localmente para marcar como declinada
      setActivities(prev => prev.map(a => 
        a.id === activityId ? { ...a, completed: true, declined: true } : a
      ));
      // Recarregar atividades para atualizar a lista
      await loadActivities(activeTab === 'history');
    } catch (error) {
      console.error('Error skipping activity:', error);
      Alert.alert('Error', 'Failed to skip activity');
    }
  };

  const handleOpenMeet = (activity: ActivityItem) => {
    if (activity.meetUrl) {
      // Abrir link do meet em um navegador ou app apropriado
      Linking.openURL(activity.meetUrl).catch((err: Error) => {
        console.error('Error opening meet URL:', err);
        Alert.alert('Error', 'Failed to open meet link');
      });
    }
  };

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <Toggle
        options={['Actives', 'History'] as const}
        selected={activeTab === 'actives' ? 'Actives' : 'History'}
        onSelect={(option) => {
          const newTab = option === 'Actives' ? 'actives' : 'history';
          setActiveTab(newTab);
          // Resetar filtro para 'all' se estiver em 'orders' e mudar para 'actives'
          if (newTab === 'actives' && selectedFilter === 'orders') {
            setSelectedFilter('all');
          }
        }}
      />
    </View>
  );

  const filterCarouselOptions: ButtonCarouselOption<FilterType>[] = useMemo(() => {
    const baseOptions: ButtonCarouselOption<FilterType>[] = [
      { id: 'all', label: 'All' },
      { id: 'activities', label: 'Activities' },
      { id: 'appointments', label: 'Appointments' },
    ];
    
    // Orders só aparece quando estiver na aba History
    if (activeTab === 'history') {
      baseOptions.push({ id: 'orders', label: 'Orders' });
    }
    
    return baseOptions;
  }, [activeTab]);

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
          onPress={() => {
            setEditingActivityId(null);
            setEditingActivityData(null);
            setIsCreateActivityModalVisible(true);
          }}
          style={styles.createButton}
        />
        </View>
      )}
    </View>
  );

  const renderEventReminder = () => {
    if (activeTab === 'history') return null;

    const upcomingActivity = getUpcomingActivity;
    
    if (!upcomingActivity) return null;

    const { date, time } = getReminderDateAndTime(upcomingActivity);
    const message = getReminderMessage(upcomingActivity);

    return (
      <View style={styles.eventReminderContainer}>
        <EventReminder
          message={message}
          date={date}
          time={time}
          onClose={() => setShowFestivalBanner(false)}
          visible={showFestivalBanner}
        />
      </View>
    );
  };

  const sortedOrders = useMemo(() => {
    return sortByDateField(orders, 'createdAt', daySortOrder);
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

            {activeTab === 'actives' && (
              <TouchableOpacity
                onPress={() => console.log('View order:', order.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewLink}>View</Text>
              </TouchableOpacity>
            )}
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
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={(e) => handleMenuPress(activity.id, e)}
              >
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
              {activity.meetUrl && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.openButton]}
                  onPress={() => handleOpenMeet(activity)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.openButtonText}>Open meet {'>'}</Text>
                </TouchableOpacity>
              )}

              {activeTab === 'actives' && (
                <TouchableOpacity
                  onPress={() => handleSkipAppointment(activity.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewLink}>Skip</Text>
                </TouchableOpacity>
              )}
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
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={(e) => handleMenuPress(activity.id, e)}
            >
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
            {activeTab === 'history' ? (
              <View style={[styles.actionButton]}>
                <Image
                  source={activity.declined ? CloseIcon : DoneIcon}
                  style={styles.statusIcon}
                  resizeMode="cover"
                />
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

            {activeTab === 'actives' && (
              <TouchableOpacity
                onPress={() => handleViewActivity(activity)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewLink}>View</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
        {renderEventReminder()}

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
        onClose={() => {
          setIsCreateActivityModalVisible(false);
          setEditingActivityId(null);
          setEditingActivityData(null);
        }}
        onSave={async (data, activityId) => {
          try {
            let response;
            if (activityId) {
              // Update existing activity
              response = await activityService.updateActivity(activityId, {
                name: data.name,
                type: data.type,
                startDate: data.startDate,
                startTime: data.startTime,
                endDate: data.endDate,
                endTime: data.endTime,
                location: data.location,
                description: data.description,
                reminderEnabled: data.reminderEnabled,
                reminderOffset: data.reminderMinutes ? `${data.reminderMinutes}` : null,
              });
              console.log('Activity updated:', activityId);
            } else {
              // Create new activity
              response = await activityService.createActivity({
                name: data.name,
                type: data.type,
                startDate: data.startDate,
                startTime: data.startTime,
                endDate: data.endDate,
                endTime: data.endTime,
                location: data.location,
                description: data.description,
                reminderEnabled: data.reminderEnabled,
                reminderOffset: data.reminderMinutes ? `${data.reminderMinutes}` : null,
              });
              console.log('Activity created:', response.data?.id);
            }
            
            // Verificar se a operação foi bem-sucedida antes de recarregar
            if (response && response.success && response.data) {
              // Refresh activities list after save
              await loadActivities(activeTab === 'history');
            } else {
              throw new Error(response?.message || 'Failed to save activity');
            }
          } catch (error: any) {
            console.error('Error saving activity:', error);
            Alert.alert(
              'Erro',
              error?.message || 'Não foi possível salvar a atividade. Por favor, tente novamente.',
              [{ text: 'OK' }]
            );
          }
        }}
        activityId={editingActivityId || undefined}
        initialData={editingActivityData}
      />
      
      {/* Action Menu Modal */}
      <Modal
        visible={menuVisibleForId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisibleForId(null)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisibleForId(null)}
        >
          {menuPosition && (
            <View style={[styles.menuContainer, { top: menuPosition.y, left: menuPosition.x }]}>
              {menuVisibleForId && !menuVisibleForId.startsWith('order-') && (
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      const activity = activities.find(a => a.id === menuVisibleForId);
                      if (activity) {
                        handleViewActivity(activity);
                      }
                    }}
                  >
                    <Icon name="edit" size={20} color="#001137" />
                    <Text style={styles.menuItemText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      if (menuVisibleForId) {
                        handleDeleteActivity(menuVisibleForId);
                      }
                    }}
                  >
                    <Icon name="delete" size={20} color="#F44336" />
                    <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default ActivitiesScreen;
