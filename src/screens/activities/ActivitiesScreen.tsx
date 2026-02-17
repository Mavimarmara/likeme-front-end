import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Modal,
  Alert,
  Linking,
} from 'react-native';
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
import { storageService } from '@/services';
import { formatPrice, getDateFromDatetime, getTimeFromDatetime, sortByDateTime, sortByDateField } from '@/utils';
import { COLORS } from '@/constants';
import { useActivities, useSuggestedProducts, useMenuItems } from '@/hooks';
import { useTranslation } from '@/hooks/i18n';
import { AnamnesisPromptCard } from '@/components/sections/anamnesis';
import type { Order } from '@/types/order';
import type { RootStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ActivitiesScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Activities'>;
};

type TabType = 'actives' | 'history';
type FilterType = 'all' | 'activities' | 'appointments' | 'orders';

import type { ActivityItem } from '@/types/activity/hooks';

const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Activities', screenClass: 'ActivitiesScreen' });
  const { t } = useTranslation();
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
  const [hasCompletedAnamnesis, setHasCompletedAnamnesis] = useState<boolean>(false);

  // Usar o hook useActivities
  const {
    activities,
    rawActivities,
    loading: isLoadingActivities,
    historyActivities,
    activeActivities,
    loadActivities,
    formatDate,
    parseTimeString,
    isToday,
  } = useActivities({
    enabled: true,
    includeDeleted: false, // Padrão, será sobrescrito no loadActivities
    autoLoad: false, // Vamos controlar manualmente quando carregar
  });

  useEffect(() => {
    // Incluir atividades deletadas (skipadas) quando estiver na aba de histórico
    const includeDeleted = activeTab === 'history';
    loadActivities(includeDeleted);
  }, [activeTab, loadActivities]);

  useEffect(() => {
    if (activeTab === 'history') {
      loadOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    const checkAnamnesisStatus = async () => {
      try {
        const anamnesisCompletedAt = await storageService.getAnamnesisCompletedAt();
        setHasCompletedAnamnesis(!!anamnesisCompletedAt);
      } catch (error) {
        console.error('Error checking anamnesis status:', error);
        setHasCompletedAnamnesis(false);
      }
    };

    checkAnamnesisStatus();
  }, []);

  const { products: suggestedProducts } = useSuggestedProducts({
    limit: 4,
    status: 'active',
    enabled: true,
  });

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
      return activity?.name || t('activities.eventReminderSoon');
    }

    try {
      const now = new Date();

      // Se não tiver startTime, apenas mostrar que é hoje
      if (!activity.startTime) {
        return t('activities.eventReminderToday', { name: activity.name });
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
        return t('activities.eventReminder', { name: activity.name, hours: diffHours });
      } else if (diffMinutes > 0) {
        return t('activities.eventReminderMinutes', { name: activity.name, minutes: diffMinutes });
      } else if (diffMinutes > -60) {
        // Se passou há menos de 1 hora, ainda mostrar
        return t('activities.eventReminderNow', { name: activity.name });
      }
      return t('activities.eventReminderToday', { name: activity.name });
    } catch (error) {
      console.error('Error calculating reminder message:', error);
      return t('activities.eventReminderToday', { name: activity.name });
    }
  };

  // Função para extrair data e hora
  const getReminderDateAndTime = (activity: any): { date: string; time: string } => {
    if (!activity || !activity.startDate) {
      return { date: t('activities.today'), time: '' };
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
        date: isTodayDate ? t('activities.today') : formatDate(startDate),
        time: activity.startTime || '',
      };
    } catch (error) {
      console.error('Error parsing date and time:', error);
      return { date: t('activities.today'), time: '' };
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
      source = source.filter((a) => a.type === 'program' || a.type === 'personal');
    } else {
      source = source.filter((a) => a.type === 'appointment');
    }

    // Sort by date
    const sorted = sortByDateTime(source, daySortOrder, (item) => item.dateTime);

    return sorted;
  }, [activeTab, selectedFilter, daySortOrder, historyActivities, activeActivities]);

  const menuItems = useMenuItems(navigation);

  const handleMarkAsDone = async (activityId: string) => {
    try {
      const activity = activities.find((a) => a.id === activityId);
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
      Alert.alert(t('errors.error'), t('activities.markError'));
    }
  };

  const handleViewActivity = (activity: ActivityItem) => {
    // Abrir modal de edição
    setEditingActivityData({
      name: activity.title,
      type: activity.type === 'personal' ? 'task' : activity.type === 'appointment' ? 'event' : 'event',
      startDate: activity.dateTime ? getDateFromDatetime(activity.dateTime) : undefined,
      startTime: activity.dateTime ? getTimeFromDatetime(activity.dateTime) : undefined,
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
    Alert.alert(t('activities.deleteConfirm'), t('activities.deleteConfirmMessage'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('activities.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await activityService.deleteActivity(activityId);
            await loadActivities(activeTab === 'history');
            setMenuVisibleForId(null);
          } catch (error) {
            console.error('Error deleting activity:', error);
            Alert.alert(t('errors.error'), t('activities.deleteError'));
          }
        },
      },
    ]);
  };

  const handleMenuPress = (activityId: string, event: any) => {
    event.persist();
    const { pageX, pageY } = event.nativeEvent;
    // Ajustar posição para aparecer abaixo e à direita do botão
    setMenuPosition({ x: pageX - 100, y: pageY + 10 });
    setMenuVisibleForId(activityId);
  };

  const handleSkipAppointment = async (activityId: string) => {
    try {
      // Marcar atividade como declinada (deletada) para que apareça no histórico como declinada
      await activityService.deleteActivity(activityId);
      // Recarregar atividades para atualizar a lista
      await loadActivities(activeTab === 'history');
    } catch (error) {
      console.error('Error skipping activity:', error);
      Alert.alert(t('errors.error'), t('activities.skipError'));
    }
  };

  const handleOpenMeet = (activity: ActivityItem) => {
    if (activity.meetUrl) {
      // Abrir link do meet em um navegador ou app apropriado
      Linking.openURL(activity.meetUrl).catch((err: Error) => {
        console.error('Error opening meet URL:', err);
        Alert.alert(t('errors.error'), t('activities.openMeetError'));
      });
    }
  };

  const handleStartAnamnesis = () => {
    rootNavigation.navigate('Anamnesis' as never);
  };

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <Toggle
        options={[t('activities.actives'), t('activities.history')] as any}
        selected={activeTab === 'actives' ? t('activities.actives') : t('activities.history')}
        onSelect={(option) => {
          const newTab = option === t('activities.actives') ? 'actives' : 'history';
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
      { id: 'all', label: t('activities.all') },
      { id: 'activities', label: t('activities.activities') },
      { id: 'appointments', label: t('activities.appointments') },
    ];

    // Orders só aparece quando estiver na aba History
    if (activeTab === 'history') {
      baseOptions.push({ id: 'orders', label: t('activities.orders') });
    }

    return baseOptions;
  }, [activeTab]);

  const handleDaySortToggle = () => {
    setDaySortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <FilterMenu
        filterButtonLabel={t('activities.day')}
        onFilterButtonPress={handleDaySortToggle}
        filterButtonIcon={daySortOrder === 'asc' ? 'arrow-drop-up' : 'arrow-drop-down'}
        carouselOptions={filterCarouselOptions}
        selectedCarouselId={selectedFilter}
        onCarouselSelect={(optionId) => setSelectedFilter(optionId)}
      />
      {activeTab === 'actives' && (
        <View style={styles.createButtonContainer}>
          <PrimaryButton
            label={t('activities.createActivities')}
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

    const getStatusText = () => {
      if (order.paymentStatus === 'paid') {
        return t('activities.paid');
      }
      if (order.paymentStatus === 'pending') {
        return t('activities.pending');
      }
      return order.status.charAt(0).toUpperCase() + order.status.slice(1);
    };

    return (
      <View key={`order-${order.id}`} style={styles.activityCard}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Badge label={t('activities.order')} color='orange' />
          </View>

          <View>
            <Text style={styles.cardTitle}>
              {t('activities.order')} #{order.id.slice(0, 8).toUpperCase()}
            </Text>
            <Text style={styles.cardDescription}>
              {itemsCount} {itemsCount === 1 ? t('activities.item') : t('activities.items')} •{' '}
              {formatPrice(order.total)}
            </Text>
            {order.createdAt && (
              <View style={styles.dateTimeContainer}>
                <Icon name='event' size={16} color={COLORS.TEXT} />
                <Text style={styles.dateTimeText}>{orderDate}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardActions}>
            <View style={[styles.actionButton, styles.doneButton]}>
              <Icon name='check' size={16} color={COLORS.TEXT} />
              <Text style={styles.doneButtonText}>{getStatusText()}</Text>
            </View>

            {activeTab === 'actives' && (
              <TouchableOpacity onPress={() => console.log('View order:', order.id)} activeOpacity={0.7}>
                <Text style={styles.viewLink}>{t('common.view')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderActivityCard = (activity: ActivityItem) => {
    const typeLabels = {
      program: t('activities.programs'),
      appointment: t('activities.appointments'),
      personal: t('activities.personal'),
    };

    // For appointments, show date/time in title row
    if (activity.type === 'appointment') {
      return (
        <View key={activity.id} style={[styles.activityCard, styles.appointmentCard]}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Badge label={typeLabels[activity.type]} color='orange' />
              <TouchableOpacity activeOpacity={0.7} onPress={(e) => handleMenuPress(activity.id, e)}>
                <Icon name='more-vert' size={20} color={COLORS.TEXT} />
              </TouchableOpacity>
            </View>

            <View>
              {activity.dateTime && (
                <View style={styles.appointmentDateTimeRow}>
                  <Icon name='event' size={16} color={COLORS.TEXT} />
                  <Text style={styles.appointmentDateTimeText}>{activity.dateTime}</Text>
                </View>
              )}

              {activity.providerName && (
                <View style={styles.providerContainer}>
                  <Text style={styles.providerText}>{t('activities.therapySession')}</Text>
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
                  <Text style={styles.openButtonText}>{t('activities.openMeet')}</Text>
                </TouchableOpacity>
              )}

              {activeTab === 'actives' && (
                <TouchableOpacity onPress={() => handleSkipAppointment(activity.id)} activeOpacity={0.7}>
                  <Text style={styles.viewLink}>{t('activities.skip')}</Text>
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
            <Badge label={typeLabels[activity.type]} color='orange' />
            <TouchableOpacity activeOpacity={0.7} onPress={(e) => handleMenuPress(activity.id, e)}>
              <Icon name='more-vert' size={20} color={COLORS.TEXT} />
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.cardTitleRow}>
              {activity.isFavorite && <Icon name='star' size={20} color={COLORS.TEXT} style={styles.starIcon} />}
              <Text style={styles.cardTitle}>{activity.title}</Text>
            </View>
            <Text style={styles.cardDescription}>{activity.description}</Text>
          </View>

          <View style={styles.cardActions}>
            {activeTab === 'history' ? (
              <View style={[styles.actionButton]}>
                <Image source={activity.declined ? CloseIcon : DoneIcon} style={styles.statusIcon} resizeMode='cover' />
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.markButton]}
                onPress={() => handleMarkAsDone(activity.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.markButtonText}>{t('activities.markAsDone')}</Text>
              </TouchableOpacity>
            )}

            {activeTab === 'actives' && (
              <TouchableOpacity onPress={() => handleViewActivity(activity)} activeOpacity={0.7}>
                <Text style={styles.viewLink}>{t('common.view')}</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <Background />
      <Header showBackButton={false} />
      <View style={styles.content}>
        {renderTabs()}
        {renderFilters()}
        {renderEventReminder()}

        {activeTab === 'actives' && <Text style={styles.sectionLabel}>{t('activities.markAsDoneLabel')}</Text>}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
              {selectedFilter === 'all' &&
                filteredActivities.length === 0 &&
                sortedOrders.length === 0 &&
                !isLoadingOrders && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>{t('activities.noHistoryFound')}</Text>
                  </View>
                )}
              {selectedFilter === 'activities' && filteredActivities.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t('activities.noActivitiesFound')}</Text>
                </View>
              )}
              {selectedFilter === 'appointments' && filteredActivities.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t('activities.noAppointmentsFound')}</Text>
                </View>
              )}
              {selectedFilter === 'orders' && sortedOrders.length === 0 && !isLoadingOrders && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t('activities.noOrdersFound')}</Text>
                </View>
              )}
            </>
          ) : (
            <>
              {filteredActivities.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{t('activities.noActivitiesFound')}</Text>
                </View>
              ) : (
                filteredActivities.map(renderActivityCard)
              )}
              {!hasCompletedAnamnesis && (
                <View style={styles.anamnesisPromptContainer}>
                  <AnamnesisPromptCard onStartPress={handleStartAnamnesis} />
                </View>
              )}
              {activeTab === 'actives' && plans.length > 0 && (
                <View>
                  <PlansCarousel
                    title={t('activities.plansForYou')}
                    subtitle={t('activities.discoverOptions')}
                    plans={plans}
                    onPlanPress={(plan) => console.log('Plan pressed:', plan.id)}
                    onPlanLike={(plan) => console.log('Plan liked:', plan.id)}
                  />
                </View>
              )}
              {activeTab === 'actives' && suggestedProducts.length > 0 && (
                <View>
                  <ProductsCarousel
                    title={t('activities.productsRecommended')}
                    subtitle={t('activities.discoverOptions')}
                    products={suggestedProducts}
                    onProductPress={(product) => {
                      rootNavigation.navigate('ProductDetails', {
                        productId: product.id,
                      } as never);
                    }}
                    onProductLike={(product) => console.log('Product liked:', product.id)}
                  />
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId='activities' />
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
            Alert.alert(t('errors.error'), error?.message || t('activities.saveError'), [{ text: t('common.ok') }]);
          }
        }}
        activityId={editingActivityId || undefined}
        initialData={editingActivityData}
      />

      {/* Action Menu Modal */}
      <Modal
        visible={menuVisibleForId !== null}
        transparent
        animationType='fade'
        onRequestClose={() => setMenuVisibleForId(null)}
      >
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setMenuVisibleForId(null)}>
          {menuPosition && (
            <View style={[styles.menuContainer, { top: menuPosition.y, left: menuPosition.x }]}>
              {menuVisibleForId && !menuVisibleForId.startsWith('order-') && (
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      const activity = activities.find((a) => a.id === menuVisibleForId);
                      if (activity) {
                        handleViewActivity(activity);
                      }
                    }}
                  >
                    <Icon name='edit' size={20} color={COLORS.TEXT} />
                    <Text style={styles.menuItemText}>{t('activities.edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      if (menuVisibleForId) {
                        handleDeleteActivity(menuVisibleForId);
                      }
                    }}
                  >
                    <Icon name='delete' size={20} color='#F44336' />
                    <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>{t('activities.delete')}</Text>
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
