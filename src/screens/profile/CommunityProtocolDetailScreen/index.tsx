import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWithHeader, HeroImage } from '@/components/ui/layout';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { NextEventsSection } from '@/components/sections/community';
import { MarkdownText } from '@/components/ui/text/MarkdownText';
import { useEventList, useMenuItems } from '@/hooks';
import { useFloatingMenuActions } from '@/contexts/FloatingMenuContext';
import { useAnalyticsScreen, logTabSelect } from '@/analytics';
import { useTranslation } from '@/hooks/i18n';
import { scheduledCommunityEventsToFeedEvents } from '@/utils/event/communityEventToFeedEvent';
import { MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK } from '@/constants/community/communityProtocol';
import type { RootStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'CommunityProtocolDetail'>;

type TabId = 'events' | 'about' | 'agreements';

const TAB_OPTIONS: ButtonCarouselOption<TabId>[] = [
  { id: 'events', label: 'Eventos' },
  { id: 'about', label: 'Sobre' },
  { id: 'agreements', label: 'Acordos' },
];

const CommunityProtocolDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({
    screenName: 'CommunityProtocolDetail',
    screenClass: 'CommunityProtocolDetailScreen',
  });
  const { t } = useTranslation();
  const menuItems = useMenuItems(navigation);
  const { setMenu } = useFloatingMenuActions();
  const { community } = route.params;
  const [activeTab, setActiveTab] = useState<TabId>('events');

  const { events, loading: eventsLoading } = useEventList({
    enabled: true,
    communityId: community.communityId,
  });

  const scheduledFeedEvents = useMemo(
    () =>
      scheduledCommunityEventsToFeedEvents(events, community.image?.trim() || MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK),
    [community.image, events],
  );

  useFocusEffect(
    useCallback(() => {
      setMenu(menuItems, 'profile');
    }, [menuItems, setMenu]),
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTabSelect = (tabId: TabId) => {
    logTabSelect({ screen_name: 'community_protocol_detail', tab_id: tabId });
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        if (eventsLoading) {
          return (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} />
            </View>
          );
        }
        if (scheduledFeedEvents.length === 0) {
          return (
            <Text style={styles.emptyText}>
              {t('profile.memberProtocols.noScheduledEvents', {
                defaultValue: 'Nenhum evento agendado no momento.',
              })}
            </Text>
          );
        }
        return (
          <View style={styles.tabContent}>
            <NextEventsSection
              events={scheduledFeedEvents}
              title={t('profile.memberProtocols.scheduledEventsTitle', {
                defaultValue: 'Eventos agendados',
              })}
            />
          </View>
        );

      case 'about':
        return (
          <View style={styles.tabContent}>
            {community.description ? (
              <MarkdownText style={styles.descriptionText} text={community.description} />
            ) : (
              <Text style={styles.emptyText}>
                {t('community.aboutEmpty', { defaultValue: 'Sem informações disponíveis.' })}
              </Text>
            )}
          </View>
        );

      case 'agreements':
        return (
          <View style={styles.tabContent}>
            {community.agreement ? (
              <MarkdownText style={styles.descriptionText} text={community.agreement} />
            ) : (
              <Text style={styles.emptyText}>
                {t('profile.memberProtocols.noAgreements', {
                  defaultValue: 'Sem acordos registrados.',
                })}
              </Text>
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
          imageUri={community.image ?? MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK}
          name={community.name}
          badges={community.badges ?? []}
          heightRatio={0.6}
        />

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>{t('community.informationTitle', { defaultValue: 'Informações' })}</Text>
          <ButtonCarousel options={TAB_OPTIONS} selectedId={activeTab} onSelect={handleTabSelect} />
        </View>

        {renderTabContent()}
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default CommunityProtocolDetailScreen;
