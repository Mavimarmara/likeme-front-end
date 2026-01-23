import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header } from '@/components/ui/layout';
import { FloatingMenu } from '@/components/ui/menu';
import ProgressBar from '@/components/ui/feedback/ProgressBar';
import { ChartBar } from '@/components/ui/graphics';
import { CTACard } from '@/components/ui/cards';
import { PeriodSelector } from '@/components/ui/inputs';
import { useMenuItems } from '@/hooks';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants';
import { getMarkerColor, getMarkerGradient, MARKER_NAMES, hasMarkerGradient } from '@/constants/markers';
import type { UserMarker } from '@/types/anamnesis';
import { styles } from './styles';
import Background from '../../../components/ui/layout/Background';

type Props = {
  navigation: any;
  route: {
    params: {
      marker: UserMarker;
    };
  };
};

type Period = 'day' | 'week' | 'month';

const MarkerDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const rootNavigation = navigation.getParent() ?? navigation;
  const menuItems = useMenuItems(rootNavigation);
  
  // Validação de parâmetros
  console.log('[MarkerDetailsScreen] Route params:', route?.params);
  const marker = route?.params?.marker;
  
  if (!marker) {
    console.warn('[MarkerDetailsScreen] Marker não encontrado nos params');
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }} edges={['top']}>
        <Header onBackPress={() => navigation.goBack()} showBackButton />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 16, color: COLORS.TEXT }}>Marker não encontrado</Text>
        </View>
        <FloatingMenu items={menuItems} selectedId="activities" />
      </SafeAreaView>
    );
  }

  console.log('[MarkerDetailsScreen] Rendering with marker:', marker);

  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');

  const markerColor = getMarkerColor(marker.id);
  const markerGradient = getMarkerGradient(marker.id);
  const markerName = MARKER_NAMES[marker.id] || marker.name;

  // Mock data - será substituído por dados reais do backend
  // Por enquanto, usa dados genéricos baseados no marker
  const metric1 = 4;
  const metric2 = 8;
  const improvementPercentage = marker.trend === 'increasing' ? 23 : marker.trend === 'decreasing' ? -15 : 0;
  const averageValue = Math.round(marker.percentage / 10);

  // Mock weekly data
  const weeklyData = [
    { day: 'S', value: 6, date: '28-4 Oct.' },
    { day: 'M', value: 4, date: '5-11 Oct.' },
    { day: 'T', value: 4, date: '12-18 Oct.' },
    { day: 'W', value: 4, date: '19-25 Oct.' },
    { day: 'T', value: 4, date: '26-1 Nov.' },
    { day: 'F', value: 4, date: '2-8 Nov.' },
    { day: 'S', value: 6, date: '9-15 Nov.' },
  ];

  const maxValue = Math.max(...weeklyData.map((d) => d.value), 1);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    console.log('Share marker details');
    // TODO: Implementar compartilhamento
  };

  const handleSeeMarker = (markerToShow: UserMarker) => {
    // Navegar para detalhes do marker (pode ser usado para navegação entre markers)
    console.log('See marker:', markerToShow.id);
  };

  console.log('[MarkerDetailsScreen] About to render, markerName:', markerName);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.BACKGROUND }} edges={['top']}>
    <Background/>
    <StatusBar backgroundColor={COLORS.BACKGROUND} barStyle="dark-content" />
      <Header onBackPress={handleBack} showBackButton showBellButton />
      
      <View style={styles.content}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Marker Header Section */}
          <View style={styles.markerHeaderSection}>
            <TouchableOpacity
              style={styles.markerHeaderRow}
              onPress={() => handleSeeMarker(marker)}
              activeOpacity={0.7}
            >
              <Text style={styles.markerName}>{markerName}</Text>
              <Icon name="chevron-right" size={24} color={COLORS.TEXT} />
            </TouchableOpacity>
            <View style={styles.markerProgressContainer}>
              <ProgressBar
                current={marker.percentage}
                total={100}
                color={markerColor}
                gradientColors={hasMarkerGradient(marker.id) ? (getMarkerGradient(marker.id) as string[]) : undefined}
                height={30}
                showRemaining={false}
              />
            </View>
          </View>

          {/* Main Stats Card */}
          <View style={styles.mainStatsCard}>
            <Text style={styles.mainStatsTitle}>
              {markerName.toUpperCase()} : +{improvementPercentage}%
            </Text>

            <View style={styles.insightsSection}>
              <Text style={styles.insightsTitle}>You've improved a lot!</Text>
              <Text style={styles.insightsText}>
                Nice job taking care of your body!
                {'\n'}
                What about improving your state of mind?
              </Text>
            </View>

            {/* Metrics Cards */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>{markerName} Quality</Text>
                <Text style={styles.metricValue}>{metric1.toString().padStart(2, '0')}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>{markerName} Routine</Text>
                <Text style={styles.metricValue}>{metric2.toString().padStart(2, '0')}</Text>
              </View>
            </View>
          </View>

          {/* Routine Section */}
          <CTACard
            title={`${markerName.toUpperCase()} ROUTINE`}
            highlightText={`Your average ${markerName.toLowerCase()} score this week was ${averageValue} points`}
            description={[
              `You've been maintaining a consistent routine. Continuing to focus on ${markerName.toLowerCase()} could further boost your overall well-being and energy levels`,
            ]}
            backgroundColor={COLORS.PRIMARY.LIGHT}
            descriptionColor={COLORS.TEXT}
            titleStyle={styles.routineTitle}
            borderRadius={{
              topLeft: 32,
              topRight: 32,
              bottomLeft: 12,
              bottomRight: 64,
            }}
            style={[
              styles.routineCard,
              {
                paddingBottom: SPACING.XL,
                paddingHorizontal: SPACING.LG,
              },
            ]}
          />

          {/* History Section */}
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>Quality of {markerName} History</Text>

            {/* Period Selector */}
            <PeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={(period) => setSelectedPeriod(period)}
              options={['day', 'week', 'month']}
              activeColor={markerColor}
              style={styles.periodSelector}
            />

            {/* Weekly Chart */}
            <View style={styles.chartContainer}>
              {weeklyData.map((data, index) => {
                const barHeight = (data.value / maxValue) * 200; // Max height of 200
                return (
                  <ChartBar
                    key={`${data.date}-${index}`}
                    date={data.date}
                    value={data.value}
                    height={barHeight}
                    gradientColors={markerGradient || undefined}
                    color={markerColor}
                  />
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
      <FloatingMenu items={menuItems} selectedId="home" />
    </SafeAreaView>
  );
};

export default MarkerDetailsScreen;

