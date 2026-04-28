import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, Alert, Linking } from 'react-native';
import { LogoutButton, SecondaryButton, Title } from '@/components/ui';
import { ScreenWithHeader } from '@/components/ui/layout';
import { AuthService, storageService, userService } from '@/services';
import { useMenuItems, useUserAvatar } from '@/hooks';
import { useSetFloatingMenu } from '@/contexts/FloatingMenuContext';
import { useTranslation } from '@/hooks/i18n';
import type { StoredUser } from '@/types/auth';
import { useAnalyticsScreen } from '@/analytics';
import { COLORS } from '@/constants';
import { ACCOUNT_CONFIG } from '@/config/environment';
import { logger } from '@/utils/logger';
import { styles } from './styles';

type Props = {
  navigation: any;
  route: any;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Profile', screenClass: 'ProfileScreen' });
  const { t } = useTranslation();
  const rootNavigation = navigation.getParent() ?? navigation;
  const userAvatarUri = useUserAvatar();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await storageService.getUser();
      setUser(storedUser);
    } catch (error) {
      logger.error('[ProfileScreen] Erro ao carregar usuário', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = useMenuItems(navigation);
  useSetFloatingMenu(menuItems, 'profile');

  const handleLogout = () => {
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'Unauthenticated' as never }],
    });
  };

  const runDeleteAccount = useCallback(async () => {
    setDeletingAccount(true);
    try {
      await userService.deleteMyAccount();
      await AuthService.logout();
      rootNavigation.reset({
        index: 0,
        routes: [{ name: 'Unauthenticated' as never }],
      });
    } catch (error) {
      logger.error('Falha ao eliminar conta', { cause: error });
      const message = error instanceof Error ? error.message : t('profile.deleteAccountError');
      Alert.alert(t('profile.deleteAccountConfirmTitle'), message);
    } finally {
      setDeletingAccount(false);
    }
  }, [rootNavigation, t]);

  const handleDeleteAccountPress = useCallback(() => {
    Alert.alert(t('profile.deleteAccountConfirmTitle'), t('profile.deleteAccountConfirmMessage'), [
      { text: t('profile.deleteAccountCancel'), style: 'cancel' },
      {
        text: t('profile.deleteAccountConfirmButton'),
        style: 'destructive',
        onPress: () => {
          void runDeleteAccount();
        },
      },
    ]);
  }, [runDeleteAccount, t]);

  const handleOpenDeletionWebUrl = useCallback(async () => {
    const url = ACCOUNT_CONFIG.deletionWebUrl;
    if (!url) return;
    try {
      await Linking.openURL(url);
    } catch (error) {
      logger.error('Falha ao abrir URL de exclusão de conta', { url, cause: error });
      Alert.alert(t('profile.deleteAccountConfirmTitle'), t('profile.deleteAccountError'));
    }
  }, [t]);

  const handleMenuPress = () => {
    rootNavigation.navigate('Summary' as never);
  };

  const handleCartPress = () => {
    rootNavigation.navigate('Cart' as never);
  };

  const handleBellPress = () => {
    rootNavigation.navigate('Activities' as never);
  };

  return (
    <ScreenWithHeader
      navigation={navigation}
      headerProps={{
        showBackButton: false,
        showMenuWithAvatar: true,
        onMenuPress: handleMenuPress,
        userAvatarUri,
        showCartButton: true,
        onCartPress: handleCartPress,
        showBellButton: true,
        onBellPress: handleBellPress,
      }}
      contentBackgroundColor={COLORS.BACKGROUND}
      contentContainerStyle={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Title title={t('profile.title')} />

          {user && (
            <View style={styles.userInfo}>
              {user.picture && <Image source={{ uri: user.picture }} style={styles.avatar} />}

              <View style={styles.userDetails}>
                {user.name && <Text style={styles.userName}>{user.name}</Text>}

                {user.email && <Text style={styles.userEmail}>{user.email}</Text>}

                {user.nickname && <Text style={styles.userNickname}>@{user.nickname}</Text>}
              </View>
            </View>
          )}

          {loading ? (
            <View style={styles.notLoggedIn}>
              <Text style={styles.notLoggedInText}>{t('profile.loading')}</Text>
            </View>
          ) : !user ? (
            <View style={styles.notLoggedIn}>
              <Text style={styles.notLoggedInText}>{t('auth.notLoggedIn')}</Text>
            </View>
          ) : null}

          {user && (
            <View style={styles.logoutContainer}>
              <LogoutButton label={t('auth.logout')} onPress={handleLogout} />
              <SecondaryButton
                label={t('profile.deleteAccount')}
                onPress={handleDeleteAccountPress}
                loading={deletingAccount}
                disabled={deletingAccount}
                testID='profile-delete-account-button'
              />
              <Text style={styles.deleteAccountHint}>{t('profile.deleteAccountHint')}</Text>
              {ACCOUNT_CONFIG.deletionWebUrl ? (
                <>
                  <Text style={styles.deleteAccountHint}>{t('profile.deleteAccountWebHint')}</Text>
                  <Text
                    onPress={() => void handleOpenDeletionWebUrl()}
                    accessibilityRole='link'
                    style={styles.webDeletionLinkText}
                  >
                    {t('profile.deleteAccountWebLinkLabel')}
                  </Text>
                </>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default ProfileScreen;
