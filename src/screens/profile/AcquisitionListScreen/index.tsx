import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import { ScreenWithHeader } from '@/components/ui/layout';
import { SearchBar } from '@/components/ui/inputs';
import { EmptyState } from '@/components/ui/feedback';
import { AcquisitionCatalogCard } from '@/components/ui/cards/AcquisitionCatalogCard';
import { useAcquisitionList } from '@/hooks/profile/useAcquisitionList';
import { useMenuItems } from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import type { AcquisitionListItem } from '@/types/acquisition/acquisition';
import type { RootStackParamList } from '@/types/navigation';
import { COLORS } from '@/constants';
import { styles } from './styles';

type Props = StackScreenProps<RootStackParamList, 'AcquisitionList'>;

const AcquisitionListScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'AcquisitionList', screenClass: 'AcquisitionListScreen' });
  const { t } = useTranslation();
  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'profile');

  const { searchQuery, setSearchQuery, loading, error, protocols, services, reload } = useAcquisitionList();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openAcquisition = useCallback(
    (item: AcquisitionListItem) => {
      navigation.navigate('ProductDetails', { productId: item.productId });
    },
    [navigation],
  );

  const renderHorizontalRow = (items: AcquisitionListItem[]) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
      {items.map((item) => (
        <AcquisitionCatalogCard
          key={item.id}
          title={item.title}
          image={item.image}
          badges={item.badges}
          onPress={() => openAcquisition(item)}
          testID={`acquisition-card-${item.id}`}
        />
      ))}
    </ScrollView>
  );

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
        <Text style={styles.screenTitle}>{t('profile.acquisitionList.title')}</Text>

        <View style={styles.searchWrap}>
          <SearchBar
            placeholder={t('profile.acquisitionList.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            showFilterButton={false}
          />
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} />
          </View>
        ) : error ? (
          <EmptyState title={error} actionLabel={t('common.retry')} onActionPress={() => void reload()} />
        ) : (
          <>
            <Text style={styles.sectionTitle}>{t('profile.acquisitionList.protocolsSection')}</Text>
            {protocols.length === 0 ? (
              <Text style={styles.emptySection}>{t('profile.acquisitionList.emptyProtocols')}</Text>
            ) : (
              renderHorizontalRow(protocols)
            )}

            <Text style={styles.sectionTitle}>{t('profile.acquisitionList.servicesSection')}</Text>
            {services.length === 0 ? (
              <Text style={styles.emptySection}>{t('profile.acquisitionList.emptyServices')}</Text>
            ) : (
              renderHorizontalRow(services)
            )}
          </>
        )}
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default AcquisitionListScreen;
