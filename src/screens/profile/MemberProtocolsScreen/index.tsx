import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWithHeader } from '@/components/ui/layout';
import { SearchBar } from '@/components/ui/inputs';
import { EmptyState } from '@/components/ui/feedback';
import { JoinCard } from '@/components/ui/cards';
import CommunityProtocolEmptyState from '@/components/sections/community/CommunityProtocolEmptyState';
import {
  useMemberProtocolCommunities,
  type MemberProtocolCardItem,
} from '@/hooks/community/useMemberProtocolCommunities';
import { useMenuItems } from '@/hooks';
import { useFloatingMenuActions } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import { navigateToCommunity } from '@/utils/navigation/communityNavigation';
import type { RootStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'MemberProtocols'>;

const MemberProtocolsScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'MemberProtocols', screenClass: 'MemberProtocolsScreen' });
  const { t } = useTranslation();
  const menuItems = useMenuItems(navigation);
  const { setMenu } = useFloatingMenuActions();

  const { searchQuery, setSearchQuery, loading, loadingMore, error, protocols, hasMore, loadMore, reload } =
    useMemberProtocolCommunities();

  useFocusEffect(
    useCallback(() => {
      setMenu(menuItems, 'profile');
    }, [menuItems, setMenu]),
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openProtocol = useCallback(
    (item: MemberProtocolCardItem) => {
      navigation.navigate('CommunityProtocolDetail', {
        community: {
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

  const handleExplorePress = useCallback(() => {
    const rootNavigation = navigation.getParent()?.getParent?.() ?? navigation.getParent();
    navigateToCommunity(rootNavigation ?? navigation);
  }, [navigation]);

  const isEmpty = !loading && !error && protocols.length === 0;

  const renderItem = useCallback(
    ({ item }: { item: MemberProtocolCardItem }) => (
      <View style={styles.cardRow}>
        <JoinCard items={[item]} onItemPress={() => openProtocol(item)} />
      </View>
    ),
    [openProtocol],
  );

  const listHeader = (
    <>
      <Text style={styles.screenTitle}>{t('profile.memberProtocols.title', { defaultValue: 'Meus Protocolos' })}</Text>
      <View style={styles.searchWrap}>
        <SearchBar
          placeholder={t('profile.memberProtocols.searchPlaceholder', { defaultValue: 'Buscar' })}
          value={searchQuery}
          onChangeText={setSearchQuery}
          showFilterButton={false}
        />
      </View>
    </>
  );

  const listFooter = loadingMore ? (
    <View style={styles.footerLoader}>
      <ActivityIndicator size='small' color={COLORS.PRIMARY.PURE} />
    </View>
  ) : null;

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{ showBackButton: true, onBackPress: handleBack }}
      contentContainerStyle={styles.screenContent}
    >
      {loading ? (
        <View style={styles.centered}>
          {listHeader}
          <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          {listHeader}
          <EmptyState title={error} actionLabel={t('common.retry')} onActionPress={() => void reload()} />
        </View>
      ) : isEmpty ? (
        <View style={styles.emptyWrap}>
          {listHeader}
          <CommunityProtocolEmptyState onExplorePress={handleExplorePress} />
        </View>
      ) : (
        <FlatList
          data={protocols}
          keyExtractor={(item) => item.communityId}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          onEndReached={() => {
            if (hasMore) {
              loadMore();
            }
          }}
          onEndReachedThreshold={0.4}
        />
      )}
    </ScreenWithHeader>
  );
};

export default MemberProtocolsScreen;
