import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWithHeader, HeroImage } from '@/components/ui/layout';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { ModuleAccordion } from '@/components/sections/program';
import EventCard from '@/components/sections/community/EventCard';
import { MarkdownText } from '@/components/ui/text/MarkdownText';
import type { FeedEvent } from '@/types/event';
import { useMenuItems } from '@/hooks';
import { useFloatingMenuActions } from '@/contexts/FloatingMenuContext';
import { useAnalyticsScreen, logTabSelect } from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
import type { ModuleItem } from '@/components/sections/program/ModuleAccordion';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'ProtocolDetail'>;

type TabId = 'content' | 'about' | 'agreements';

const TAB_OPTIONS: ButtonCarouselOption<TabId>[] = [
  { id: 'content', label: 'Conteúdo' },
  { id: 'about', label: 'Sobre' },
  { id: 'agreements', label: 'Acordos' },
];

const ProtocolDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'ProtocolDetail', screenClass: 'ProtocolDetailScreen' });
  const menuItems = useMenuItems(navigation);
  const { setMenu } = useFloatingMenuActions();

  useFocusEffect(
    useCallback(() => {
      setMenu(menuItems, 'profile');
    }, [menuItems, setMenu]),
  );

  const { protocol } = route.params;
  const [activeTab, setActiveTab] = useState<TabId>('content');

  const modules: ModuleItem[] = (protocol.modules ?? []).map((mod, index: number) => ({
    id: mod.id ?? `module-${index}`,
    title: mod.title ?? `Sessão ${String(index + 1).padStart(2, '0')}`,
    completed: mod.isCompleted ?? false,
  }));

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTabSelect = (tabId: TabId) => {
    logTabSelect({ screen_name: 'protocol_detail', tab_id: tabId });
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content': {
        const nextEvent: FeedEvent | null = protocol.nextSessionDate
          ? {
              id: `${protocol.id}-next`,
              title: `Próxima sessão com ${protocol.providerName ?? ''}`,
              date: protocol.nextSessionDate,
              time: '',
              thumbnail: protocol.image ?? '',
              participants: [],
              participantsCount: 0,
            }
          : null;

        return (
          <View style={styles.tabContent}>
            {nextEvent && (
              <View style={styles.eventCardWrap}>
                <EventCard event={nextEvent} />
              </View>
            )}
            <ModuleAccordion modules={modules} />
          </View>
        );
      }

      case 'about':
        return (
          <View style={styles.tabContent}>
            {protocol.description ? (
              <MarkdownText style={styles.descriptionText} text={protocol.description} />
            ) : (
              <Text style={styles.emptyText}>Sem informações disponíveis.</Text>
            )}
          </View>
        );

      case 'agreements':
        return (
          <View style={styles.tabContent}>
            {protocol.agreements ? (
              <MarkdownText style={styles.descriptionText} text={protocol.agreements} />
            ) : (
              <Text style={styles.emptyText}>Sem acordos registrados.</Text>
            )}
          </View>
        );
    }
  };

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{ showBackButton: true, onBackPress: handleBack }}
      contentContainerStyle={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <HeroImage
          imageUri={protocol.image ?? ''}
          name={protocol.name}
          badges={protocol.badges ?? []}
          heightRatio={0.6}
          footer={
            protocol.shortDescription ? (
              <View style={styles.heroFooter}>
                <Text style={styles.heroDescription}>{protocol.shortDescription}</Text>
              </View>
            ) : undefined
          }
        />

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <ButtonCarousel options={TAB_OPTIONS} selectedId={activeTab} onSelect={handleTabSelect} />
        </View>

        {renderTabContent()}
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default ProtocolDetailScreen;
