import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWithHeader, HeroImage } from '@/components/ui/layout';
import { EmptyState } from '@/components/ui/feedback';
import { ButtonCarousel, type ButtonCarouselOption } from '@/components/ui/carousel';
import { ModuleAccordion } from '@/components/sections/program';
import { EventBanner } from '@/components/sections/community';
import { MarkdownText } from '@/components/ui/text/MarkdownText';
import { useEventJoin, useEventList, useMenuItems, useProgramCourse } from '@/hooks';
import { useFloatingMenuActions } from '@/contexts/FloatingMenuContext';
import { useAnalyticsScreen, logTabSelect } from '@/analytics';
import { useTranslation } from '@/hooks/i18n';
import { MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK } from '@/constants/community/communityProtocol';
import type { RootStackParamList } from '@/types/navigation';
import type { ModuleItem } from '@/components/sections/program/ModuleAccordion';
import productService from '@/services/product/productService';
import { COLORS } from '@/constants';
import { moduleItemsFromProgramCourse } from '@/utils/course/programCourseModules';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'ProtocolDetail'>;

type ProtocolTabId = 'content' | 'about' | 'agreements';

const TAB_OPTIONS: ButtonCarouselOption<ProtocolTabId>[] = [
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
  const productId = protocol.productId?.trim() ?? '';

  const [activeTab, setActiveTab] = useState<ProtocolTabId>('content');
  const [agreementsText, setAgreementsText] = useState(protocol.agreements?.trim() ?? '');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  const heroImageUri = protocol.image?.trim() || (hasCommunity ? MEMBER_PROTOCOL_COMMUNITY_IMAGE_FALLBACK : '');

  const { course, loading: courseLoading } = useProgramCourse(communityId, hasCommunity);
  const { events } = useEventList({
    enabled: hasCommunity,
    communityId,
  });

  const { eventBanner, handleEventBannerPress } = useEventJoin({
    loadEvents: hasCommunity,
    events,
    communityAvatarUrl: heroImageUri,
    communityProviderName: protocol.name,
    defaultThumbnailUrl: heroImageUri,
  });

  const courseModules: ModuleItem[] = useMemo(() => {
    if (course?.steps?.length) {
      return moduleItemsFromProgramCourse(course);
    }

    return [];
  }, [course]);

  const aboutText = protocol.description?.trim() || protocol.shortDescription?.trim() || null;

  useEffect(() => {
    const fromRoute = protocol.agreements?.trim();
    if (fromRoute) {
      setAgreementsText(fromRoute);
      return;
    }

    if (!productId) {
      setAgreementsText('');
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const response = await productService.getProductById(productId);
        const isSuccess = response.success === true || (response as { status?: string }).status === 'success';
        if (cancelled || !isSuccess || !response.data) {
          return;
        }
        setAgreementsText(response.data.technicalSpecifications?.trim() ?? '');
      } catch {
        if (!cancelled) {
          setAgreementsText('');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId, protocol.agreements]);

  const contentLoading = hasCommunity && courseLoading;
  const moduleStorageScopeId = communityId || protocol.id || productId;

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
            <ModuleAccordion modules={courseModules} storageScopeId={moduleStorageScopeId} />
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

    if (contentLoading) {
      return (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} />
        </View>
      );
    }

    const showLessons = courseModules.length > 0;
    const noCourseStepsTitle = t('profile.protocolDetail.noCourseSteps', {
      defaultValue: 'Nenhuma aula disponível no momento.',
    });

    if (!eventBanner && !showLessons) {
      return (
        <View style={styles.tabContent}>
          <EmptyState title={noCourseStepsTitle} iconName='menu-book' />
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        {eventBanner ? (
          <View style={styles.eventBannerContainer}>
            <EventBanner event={eventBanner} onPress={handleEventBannerPress} />
          </View>
        ) : null}
        {showLessons ? (
          <ModuleAccordion
            modules={courseModules}
            storageScopeId={moduleStorageScopeId}
            expandedModuleId={expandedModuleId}
            onExpandedModuleChange={setExpandedModuleId}
          />
        ) : (
          <EmptyState title={noCourseStepsTitle} iconName='menu-book' />
        )}
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
      {agreementsText.length > 0 ? (
        <MarkdownText style={styles.descriptionText} text={agreementsText} />
      ) : (
        <Text style={styles.emptyText}>
          {t('marketplace.noDescriptionAvailable', {
            defaultValue: 'Descrição não disponível.',
          })}
        </Text>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return renderContentTab();
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
      contentBackgroundColor={COLORS.BACKGROUND}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <HeroImage
          imageUri={heroImageUri}
          name={protocol.name}
          badges={protocol.badges ?? []}
          heightRatio={0.6}
          footer={
            aboutText ? (
              <View style={styles.heroFooter}>
                <Text style={styles.heroDescription}>{aboutText}</Text>
              </View>
            ) : undefined
          }
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

export default ProtocolDetailScreen;
