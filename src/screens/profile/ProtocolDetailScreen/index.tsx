import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWithHeader, HeroImage } from '@/components/ui/layout';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { ModuleAccordion } from '@/components/sections/program';
import { NextEventsSection } from '@/components/sections/community';
import { MarkdownText } from '@/components/ui/text/MarkdownText';
import { useEventList, useMenuItems, useProgramCourse } from '@/hooks';
import { useFloatingMenuActions } from '@/contexts/FloatingMenuContext';
import { useAnalyticsScreen, logTabSelect } from '@/analytics';
import { useTranslation } from '@/hooks/i18n';
import { scheduledCommunityEventsToFeedEvents } from '@/utils/event/communityEventToFeedEvent';
import { MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK } from '@/constants/community/communityProtocol';
import type { RootStackParamList } from '@/types/navigation';
import type { ModuleItem } from '@/components/sections/program/ModuleAccordion';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'ProtocolDetail'>;

type ProtocolTabId = 'content' | 'events' | 'about' | 'agreements';

const TAB_OPTIONS: ButtonCarouselOption<ProtocolTabId>[] = [
  { id: 'content', label: 'Conteúdo' },
  { id: 'events', label: 'Eventos' },
  { id: 'about', label: 'Sobre' },
  { id: 'agreements', label: 'Acordos' },
];

const TAB_OPTIONS_WITHOUT_EVENTS: ButtonCarouselOption<ProtocolTabId>[] = [
  { id: 'content', label: 'Conteúdo' },
  { id: 'about', label: 'Sobre' },
  { id: 'agreements', label: 'Acordos' },
];

const ProtocolDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  useAnalyticsScreen({ screenName: 'ProtocolDetail', screenClass: 'ProtocolDetailScreen' });
  const { t } = useTranslation();
  const menuItems = useMenuItems(navigation);
  const { setMenu } = useFloatingMenuActions();
  const { protocol } = route.params;

  const communityId = protocol.communityId?.trim() ?? '';
  const hasCommunity = Boolean(communityId);

  const [activeTab, setActiveTab] = useState<ProtocolTabId>('content');

  const { course, loading: courseLoading, error: courseError } = useProgramCourse(communityId, hasCommunity);
  const { events, loading: eventsLoading } = useEventList({
    enabled: hasCommunity,
    communityId,
  });

  const scheduledFeedEvents = useMemo(
    () =>
      scheduledCommunityEventsToFeedEvents(events, protocol.image?.trim() || MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK),
    [events, protocol.image],
  );

  const courseModules: ModuleItem[] = useMemo(() => {
    if (course?.steps?.length) {
      return course.steps.map((step) => ({
        id: step.postId,
        title: step.title,
        completed: false,
        body: step.body,
      }));
    }

    return (protocol.modules ?? []).map((mod, index) => ({
      id: mod.id ?? `module-${index}`,
      title: mod.title ?? `Sessão ${String(index + 1).padStart(2, '0')}`,
      completed: mod.isCompleted ?? false,
    }));
  }, [course?.steps, protocol.modules]);

  const heroImageUri = protocol.image?.trim() || (hasCommunity ? MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK : '');

  const aboutText = protocol.description?.trim() || null;
  const agreementsText = (protocol.agreement ?? protocol.agreements)?.trim() || null;

  const tabOptions = hasCommunity ? TAB_OPTIONS : TAB_OPTIONS_WITHOUT_EVENTS;

  useFocusEffect(
    useCallback(() => {
      setMenu(menuItems, 'profile');
    }, [menuItems, setMenu]),
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTabSelect = (tabId: ProtocolTabId) => {
    logTabSelect({ screen_name: 'protocol_detail', tab_id: tabId });
    setActiveTab(tabId);
  };

  const renderContentTab = () => {
    if (!hasCommunity) {
      return (
        <View style={styles.tabContent}>
          {courseModules.length > 0 ? (
            <ModuleAccordion modules={courseModules} />
          ) : (
            <Text style={styles.emptyText}>
              {t('profile.protocolDetail.noCommunityLinked', {
                defaultValue: 'Conteúdo indisponível: protocolo sem comunidade vinculada.',
              })}
            </Text>
          )}
        </View>
      );
    }

    if (courseLoading) {
      return (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} />
        </View>
      );
    }

    if (courseError) {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.emptyText}>{courseError}</Text>
        </View>
      );
    }

    if (courseModules.length === 0) {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.emptyText}>
            {t('profile.protocolDetail.noCourseSteps', {
              defaultValue: 'Nenhuma sessão de leitura disponível no momento.',
            })}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <ModuleAccordion modules={courseModules} />
      </View>
    );
  };

  const renderEventsTab = () => {
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
  };

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      {aboutText ? (
        <MarkdownText style={styles.descriptionText} text={aboutText} />
      ) : (
        <Text style={styles.emptyText}>
          {t('community.aboutEmpty', { defaultValue: 'Sem informações disponíveis.' })}
        </Text>
      )}
    </View>
  );

  const renderAgreementsTab = () => (
    <View style={styles.tabContent}>
      {agreementsText ? (
        <MarkdownText style={styles.descriptionText} text={agreementsText} />
      ) : (
        <Text style={styles.emptyText}>
          {t('profile.memberProtocols.noAgreements', {
            defaultValue: 'Sem acordos registrados.',
          })}
        </Text>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return renderContentTab();
      case 'events':
        return renderEventsTab();
      case 'about':
        return renderAboutTab();
      case 'agreements':
        return renderAgreementsTab();
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
          imageUri={heroImageUri}
          name={protocol.name}
          badges={protocol.badges ?? []}
          heightRatio={0.6}
          footer={
            !hasCommunity && protocol.shortDescription ? (
              <View style={styles.heroFooter}>
                <Text style={styles.heroDescription}>{protocol.shortDescription}</Text>
              </View>
            ) : undefined
          }
        />

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>{t('community.informationTitle', { defaultValue: 'Informações' })}</Text>
          <ButtonCarousel options={tabOptions} selectedId={activeTab} onSelect={handleTabSelect} />
        </View>

        {renderTabContent()}
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default ProtocolDetailScreen;
