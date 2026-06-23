import React, { useCallback } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { IconButton } from '@/components/ui/buttons';
import { GradientBackground, IconSilhouette, ScreenWithHeader } from '@/components/ui/layout';
import ProfileAvatarSheet from '@/components/sections/profile/ProfileAvatarSheet';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
import { COLORS, SPACING } from '@/constants';
import { getMarkerGradient } from '@/constants/markers';
import { PERSONAL_MARKERS_FALLBACK } from '@/screens/auth/PersonalObjectivesScreen/useMarkers';
import { useUserProfileHome } from './useUserProfileHome';
import { useProfileAvatarEditor } from './useProfileAvatarEditor';
import { styles } from './styles';

const MARKER_LABEL_KEY = Object.fromEntries(PERSONAL_MARKERS_FALLBACK.map((marker) => [marker.id, marker.i18nKey]));

type Props = StackScreenProps<RootStackParamList, 'UserProfileHome'>;

type AccountMenuItem = {
  key: string;
  labelKey: string;
  icon: string;
  onPress: () => void;
};

const UserProfileHomeScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'UserProfileHome', screenClass: 'UserProfileHomeScreen' });
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { loading, data, setAvatarUri } = useUserProfileHome();
  const avatarEditor = useProfileAvatarEditor({
    hasAvatar: Boolean(data.avatarUri),
    onAvatarChanged: setAvatarUri,
  });

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddInterestsPress = useCallback(() => {
    navigation.navigate('PersonalObjectives');
  }, [navigation]);

  const handlePersonalDataPress = useCallback(() => {
    navigation.navigate('Register', { userName: data.displayName.split(' ')[0] || undefined });
  }, [data.displayName, navigation]);

  const handleInterestCategoriesPress = useCallback(() => {
    navigation.navigate('PersonalObjectives');
  }, [navigation]);

  const handleDataUsagePolicyPress = useCallback(() => {
    navigation.navigate('PrivacyPolicies', { userName: data.displayName.split(' ')[0] || undefined });
  }, [data.displayName, navigation]);

  const handleAccountSettingsPress = useCallback(() => {
    Alert.alert(t('common.error'), t('profile.home.accountSettingsUnavailable'));
  }, [t]);

  const accountMenuItems: AccountMenuItem[] = [
    {
      key: 'personal-data',
      labelKey: 'profile.home.personalData',
      icon: 'person-outline',
      onPress: handlePersonalDataPress,
    },
    {
      key: 'interest-categories',
      labelKey: 'profile.home.interestCategories',
      icon: 'check',
      onPress: handleInterestCategoriesPress,
    },
    {
      key: 'data-usage-policy',
      labelKey: 'profile.home.dataUsagePolicy',
      icon: 'description',
      onPress: handleDataUsagePolicyPress,
    },
    {
      key: 'account-settings',
      labelKey: 'profile.home.accountSettings',
      icon: 'settings',
      onPress: handleAccountSettingsPress,
    },
  ];

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{
        onBackPress: handleBack,
        showBackButton: true,
        backgroundColor: COLORS.SECONDARY.LIGHT,
      }}
      contentBackgroundColor={COLORS.BACKGROUND}
      contentContainerStyle={styles.container}
    >
      <GradientBackground colors={['#958AAA', '#D8E4D6', '#F4F3EC']} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: SPACING.GAP_20 + Math.max(insets.bottom, SPACING.MD) },
        ]}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarBlock}>
            {loading ? (
              <View style={[styles.skeletonLine, styles.skeletonAvatar]} />
            ) : data.avatarUri ? (
              <CachedImage source={{ uri: data.avatarUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name='person' size={48} color={COLORS.NEUTRAL.LOW.DARK} />
              </View>
            )}
            {!loading ? (
              <IconButton
                icon='edit'
                onPress={avatarEditor.openSheet}
                backgroundSize='medium'
                containerStyle={styles.avatarEditButton}
                disabled={avatarEditor.isBusy}
              />
            ) : null}
          </View>

          <View style={styles.userInfo}>
            {loading ? (
              <>
                <View style={[styles.skeletonLine, styles.skeletonName]} />
                <View style={[styles.skeletonLine, styles.skeletonEmail]} />
              </>
            ) : (
              <>
                <Text style={styles.userName}>{data.displayName || t('profile.loading')}</Text>
                {data.email ? <Text style={styles.userEmail}>{data.email}</Text> : null}
              </>
            )}
          </View>

          <View style={styles.interestsSection}>
            <View style={styles.interestsHeaderRow}>
              <Text style={styles.interestsTitle}>{t('profile.home.interestsTitle')}</Text>
              {!loading ? (
                <IconButton
                  icon='add'
                  onPress={handleAddInterestsPress}
                  backgroundSize='medium'
                  containerStyle={styles.addInterestButton}
                />
              ) : null}
            </View>

            {loading ? (
              <View style={[styles.skeletonLine, { width: '80%', height: 32 }]} />
            ) : data.markerIds.length > 0 ? (
              <View style={styles.interestsTagsRow}>
                {data.markerIds.map((markerId) => {
                  const labelKey = MARKER_LABEL_KEY[markerId] ?? markerId;
                  const label = t(labelKey, { defaultValue: markerId });
                  const gradient = getMarkerGradient(markerId);
                  return (
                    <View key={markerId} style={styles.interestTag}>
                      <IconSilhouette tintColor={gradient} size='xsmall' />
                      <Text style={styles.interestTagLabel} numberOfLines={1}>
                        {label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.emptyInterestsText}>{t('profile.home.noCategories')}</Text>
            )}
          </View>
        </View>

        <View style={styles.manageSection}>
          <Text style={styles.manageSectionTitle}>{t('profile.home.manageAccount')}</Text>
          {accountMenuItems.map((item, index) => (
            <View key={item.key}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <Icon name={item.icon} size={26} color={COLORS.TEXT} />
                  <Text style={styles.menuItemLabel}>{t(item.labelKey)}</Text>
                </View>
                <Icon name='chevron-right' size={28} color={COLORS.NEUTRAL.LOW.DARK} />
              </TouchableOpacity>
              {index < accountMenuItems.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))}
        </View>
      </ScrollView>
      <ProfileAvatarSheet
        visible={avatarEditor.sheetVisible}
        loading={avatarEditor.uploading}
        hasAvatar={avatarEditor.hasAvatar}
        onClose={avatarEditor.closeSheet}
        onChooseLibrary={avatarEditor.pickFromLibrary}
        onTakePhoto={avatarEditor.takePhoto}
        onDeletePhoto={avatarEditor.deletePhoto}
      />
    </ScreenWithHeader>
  );
};

export default UserProfileHomeScreen;
