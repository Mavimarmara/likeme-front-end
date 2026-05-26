import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenWithHeader } from '@/components/ui/layout';
import { SearchBar } from '@/components/ui/inputs';
import { EmptyState } from '@/components/ui/feedback';
import { JoinCard } from '@/components/ui/cards';
import ProtocolList from '@/components/sections/subscription/ProtocolList';
import { useSubscriptionList } from '@/hooks/subscription/useSubscriptionList';
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

  useFocusEffect(
    useCallback(() => {
      setMenu(menuItems, 'profile');
    }, [menuItems, setMenu]),
  );

  const { searchQuery, setSearchQuery, loading, error, protocols, services, reload } = useSubscriptionList();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openItem = useCallback(
    (item: SubscriptionListItem) => {
      navigation.navigate('ProtocolDetail', {
        protocol: {
          id: item.productId,
          name: item.title,
          image: item.image,
          badges: item.badges,
        },
      });
    },
    [navigation],
  );

  const handleExplorePress = useCallback(() => {
    navigation.navigate('Marketplace' as never);
  }, [navigation]);

  const isEmpty = !loading && !error && protocols.length === 0 && services.length === 0;

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

        <View style={styles.searchWrap}>
          <SearchBar placeholder='Buscar' value={searchQuery} onChangeText={setSearchQuery} showFilterButton={false} />
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} />
          </View>
        ) : error ? (
          <EmptyState title={error} actionLabel={t('common.retry')} onActionPress={() => void reload()} />
        ) : isEmpty ? (
          <View style={styles.emptyWrap}>
            <ProtocolList
              subscriptions={[]}
              onSubscriptionPress={() => undefined}
              onExplorePress={handleExplorePress}
            />
          </View>
        ) : (
          <>
            {protocols.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Protocolos</Text>
                <JoinCard items={protocols} onItemPress={openItem} />
              </View>
            )}

            {services.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Serviços</Text>
                <JoinCard items={services} onItemPress={openItem} />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default SubscriptionListScreen;
