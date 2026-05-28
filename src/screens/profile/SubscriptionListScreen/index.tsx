import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWithHeader } from '@/components/ui/layout';
import { SearchBar } from '@/components/ui/inputs';
import { EmptyState } from '@/components/ui/feedback';
import { JoinCard } from '@/components/ui/cards';
import ProtocolList from '@/components/sections/subscription/ProtocolList';
import { useSubscriptionList } from '@/hooks/subscription/useSubscriptionList';
import {
  useMemberProtocolCommunities,
  type MemberProtocolCardItem,
} from '@/hooks/community/useMemberProtocolCommunities';
import { useMenuItems } from '@/hooks';
import { useFloatingMenuActions } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import type { SubscriptionListItem } from '@/types/subscription/subscription';
import type { RootStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'SubscriptionList'>;

const SubscriptionListScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'SubscriptionList', screenClass: 'SubscriptionListScreen' });
  const { t } = useTranslation();
  const menuItems = useMenuItems(navigation);
  const { setMenu } = useFloatingMenuActions();

  const {
    searchQuery: subscriptionSearch,
    setSearchQuery: setSubscriptionSearch,
    loading: subscriptionLoading,
    error: subscriptionError,
    protocols: subscriptionProtocols,
    services,
    reload: reloadSubscriptions,
  } = useSubscriptionList();

  const {
    searchQuery: communitySearch,
    setSearchQuery: setCommunitySearch,
    loading: communityLoading,
    error: communityError,
    protocols: communityProtocols,
    reload: reloadCommunityProtocols,
  } = useMemberProtocolCommunities();

  useFocusEffect(
    useCallback(() => {
      setMenu(menuItems, 'profile');
    }, [menuItems, setMenu]),
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openSubscriptionItem = useCallback(
    (item: SubscriptionListItem) => {
      navigation.navigate('ProtocolDetail', {
        protocol: {
          id: item.productId,
          name: item.title,
          image: item.image,
          badges: item.badges,
          communityId: item.communityId,
          description: item.description ?? undefined,
          agreement: item.agreement ?? undefined,
        },
      });
    },
    [navigation],
  );

  const openCommunityProtocol = useCallback(
    (item: MemberProtocolCardItem) => {
      navigation.navigate('ProtocolDetail', {
        protocol: {
          id: item.communityId,
          communityId: item.communityId,
          name: item.title,
          image: item.image,
          badges: item.badges,
          description: item.description ?? undefined,
          agreement: item.agreement ?? undefined,
        },
      });
    },
    [navigation],
  );

  const handleExploreMarketplace = useCallback(() => {
    navigation.navigate('Marketplace' as never);
  }, [navigation]);

  const loading = subscriptionLoading || communityLoading;
  const error = subscriptionError ?? communityError;
  const hasSubscriptionItems = subscriptionProtocols.length > 0 || services.length > 0;
  const subscriptionCommunityIds = useMemo(() => {
    const ids = new Set<string>();
    for (const item of subscriptionProtocols) {
      const communityId = item.communityId?.trim();
      if (communityId) {
        ids.add(communityId);
      }
    }
    return ids;
  }, [subscriptionProtocols]);

  const communityProtocolsWithoutSubscription = useMemo(
    () => communityProtocols.filter((item) => !subscriptionCommunityIds.has(item.communityId.trim())),
    [communityProtocols, subscriptionCommunityIds],
  );

  const hasCommunityProtocols = communityProtocolsWithoutSubscription.length > 0;
  const isFullyEmpty = !loading && !error && !hasSubscriptionItems && !hasCommunityProtocols;

  const handleSearchChange = useCallback(
    (value: string) => {
      setSubscriptionSearch(value);
      setCommunitySearch(value);
    },
    [setCommunitySearch, setSubscriptionSearch],
  );

  const searchQuery = subscriptionSearch || communitySearch;

  const reload = useCallback(() => {
    void reloadSubscriptions();
    void reloadCommunityProtocols();
  }, [reloadCommunityProtocols, reloadSubscriptions]);

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{ showBackButton: true, onBackPress: handleBack }}
      contentContainerStyle={styles.screenContent}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <Text style={styles.screenTitle}>Meus Protocolos e Serviços</Text>

        {!isFullyEmpty && (
          <View style={styles.searchWrap}>
            <SearchBar
              placeholder={t('profile.memberProtocols.searchPlaceholder', { defaultValue: 'Buscar' })}
              value={searchQuery}
              onChangeText={handleSearchChange}
              showFilterButton={false}
            />
          </View>
        )}

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} />
          </View>
        ) : error ? (
          <EmptyState title={error} actionLabel={t('common.retry')} onActionPress={() => void reload()} />
        ) : isFullyEmpty ? (
          <View style={styles.emptyWrap}>
            <ProtocolList
              subscriptions={[]}
              onSubscriptionPress={() => undefined}
              onExplorePress={handleExploreMarketplace}
            />
          </View>
        ) : (
          <>
            {subscriptionProtocols.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Protocolos</Text>
                <JoinCard layout='list' items={subscriptionProtocols} onItemPress={openSubscriptionItem} />
              </View>
            )}

            {services.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Serviços</Text>
                <JoinCard layout='list' items={services} onItemPress={openSubscriptionItem} />
              </View>
            )}

            {hasCommunityProtocols && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {t('profile.memberProtocols.communitySectionTitle', {
                    defaultValue: 'Protocolos na comunidade',
                  })}
                </Text>
                <JoinCard
                  layout='list'
                  items={communityProtocolsWithoutSubscription.map((item) => ({
                    id: item.communityId,
                    title: item.title,
                    badges: item.badges,
                    image: item.image,
                  }))}
                  onItemPress={(card) => {
                    const item = communityProtocolsWithoutSubscription.find(
                      (protocol) => protocol.communityId === card.id,
                    );
                    if (item) {
                      openCommunityProtocol(item);
                    }
                  }}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default SubscriptionListScreen;
