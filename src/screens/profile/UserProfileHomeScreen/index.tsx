import React, { useCallback } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { SvgProps } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PROFILE_HOME_MENU_ICONS } from '@/assets/profile';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { IconButton } from '@/components/ui/buttons';
import { GradientBackground, IconSilhouette, ScreenWithHeader } from '@/components/ui/layout';
import ProfileAvatarSheet from '@/components/sections/profile/ProfileAvatarSheet';
import { useTranslation } from '@/hooks/i18n';
import { useAnalyticsScreen } from '@/analytics';
import type { RootStackParamList } from '@/types/navigation';
import { COLORS, SPACING } from '@/constants';
import { getMarkerGradient } from '@/constants/markers';
import { INTEREST_CATEGORIES } from '@/hooks/interestCategories/useInterestCategories';
import { useUserProfileHome } from './useUserProfileHome';
import { useProfileAvatarEditor } from './useProfileAvatarEditor';
import { styles } from './styles';

const CATEGORY_LABEL_KEY = Object.fromEntries(INTEREST_CATEGORIES.map((category) => [category.id, category.i18nKey]));

type Props = StackScreenProps<RootStackParamList, 'UserProfileHome'>;

type AccountMenuItem = {
  key: string;
  labelKey: string;
  IconComponent: React.FC<SvgProps>;
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
    navigation.navigate('InterestCategoriesEdit');
  }, [navigation]);

  const handlePersonalDataPress = useCallback(() => {
    navigation.navigate('PersonalDataEdit');
  }, [navigation]);

  const handleInterestCategoriesPress = useCallback(() => {
    navigation.navigate('InterestCategoriesEdit');
  }, [navigation]);

  const handleDataUsagePolicyPress = useCallback(() => {
    navigation.navigate('PrivacyPolicies');
  }, [navigation]);

  const handleAccountSettingsPress = useCallback(() => {
    Alert.alert(t('common.error'), t('profile.home.accountSettingsUnavailable'));
  }, [t]);

  const accountMenuItems: AccountMenuItem[] = [
    {
      key: 'personal-data',
      labelKey: 'profile.home.personalData',
      IconComponent: PROFILE_HOME_MENU_ICONS.personalData,
      onPress: handlePersonalDataPress,
    },
    {
      key: 'interest-categories',
      labelKey: 'profile.home.interestCategories',
      IconComponent: PROFILE_HOME_MENU_ICONS.interestCategories,
      onPress: handleInterestCategoriesPress,
    },
    {
      key: 'data-usage-policy',
      labelKey: 'profile.home.dataUsagePolicy',
      IconComponent: PROFILE_HOME_MENU_ICONS.dataUsagePolicy,
      onPress: handleDataUsagePolicyPress,
    },
    {
      key: 'account-settings',
      labelKey: 'profile.home.accountSettings',
      IconComponent: PROFILE_HOME_MENU_ICONS.accountSettings,
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
                variant='light'
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
                  variant='dark'
                  backgroundSize='medium'
                  containerStyle={styles.addInterestButton}
                />
              ) : null}
            </View>

            {loading ? (
              <View style={[styles.skeletonLine, { width: '80%', height: 32 }]} />
            ) : data.categoryIds.length > 0 ? (
              <View style={styles.interestsTagsRow}>
                {data.categoryIds.map((categoryId) => {
                  const labelKey = CATEGORY_LABEL_KEY[categoryId] ?? categoryId;
                  const label = t(labelKey, { defaultValue: categoryId });
                  const gradient = getMarkerGradient(categoryId);
                  return (
                    <View key={categoryId} style={styles.interestTag}>
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
          <View style={styles.menuList}>
            {accountMenuItems.map((item) => {
              const MenuIcon = item.IconComponent;
              return (
                <View key={item.key} style={styles.menuItemBlock}>
                  <TouchableOpacity style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
                    <View style={styles.menuItemLeft}>
                      <MenuIcon width={30} height={26} />
                      <Text style={styles.menuItemLabel}>{t(item.labelKey)}</Text>
                    </View>
                    <PROFILE_HOME_MENU_ICONS.chevronRight width={28} height={28} />
                  </TouchableOpacity>
                  <View style={styles.separator} />
                </View>
              );
            })}
          </View>
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
