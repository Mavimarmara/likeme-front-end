import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SecondaryButton } from '@/components/ui/buttons';
import { CachedImage } from '@/components/ui/media/CachedImage';
import { AuthService, storageService, userService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import type { StoredUser } from '@/types/auth';
import { MenuChevronRightIcon } from '@/assets/profile';
import { COLORS } from '@/constants';
import { ACCOUNT_CONFIG } from '@/config/environment';
import { logger } from '@/utils/logger';
import { navigateToActivitiesOrders } from '@/utils/navigation/activitiesNavigation';
import { styles } from './styles';

type Props = {
  visible: boolean;
  navigation: any;
  onClose: () => void;
};

const ProfileFloatingMenu: React.FC<Props> = ({ visible, navigation, onClose }) => {
  const { t } = useTranslation();
  const rootNavigation = navigation.getParent() ?? navigation;
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (!visible) return;

    const loadUser = async () => {
      try {
        setLoading(true);
        const storedUser = await storageService.getUser();
        setUser(storedUser);
      } catch (error) {
        logger.error('[ProfileFloatingMenu] Erro ao carregar usuário', error);
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, [visible]);

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

  const handleGoToSubscriptions = () => {
    onClose();
    rootNavigation.navigate('SubscriptionList' as never);
  };

  const handleGoToOrders = () => {
    onClose();
    navigateToActivitiesOrders(rootNavigation);
  };

  const handleGoToActivities = () => {
    onClose();
    rootNavigation.navigate('Activities' as never, { initialTab: 'actives' } as never);
  };

  const handleGoToUserProfile = () => {
    onClose();
    rootNavigation.navigate('UserProfileHome' as never);
  };

  const userName = useMemo(() => user?.name?.trim() || user?.nickname?.trim() || 'Usuário', [user]);
  const userEmail = useMemo(() => user?.email?.trim() || '', [user]);

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.panel}>
          <View style={styles.headerRow}>
            <View style={styles.avatarWithText}>
              {user?.picture ? (
                <CachedImage source={{ uri: user.picture }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name='person' size={18} color={COLORS.TEXT} />
                </View>
              )}
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{loading ? t('profile.loading') : userName}</Text>
                {userEmail ? <Text style={styles.userEmail}>{userEmail}</Text> : null}
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.8}>
              <Icon name='close' size={20} color={COLORS.TEXT} />
            </TouchableOpacity>
          </View>

          <View style={styles.itemsContainer}>
            <TouchableOpacity onPress={handleGoToUserProfile} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Icon name='person-outline' size={22} color={COLORS.TEXT} />
                <Text style={styles.menuItemLabel}>Meu Perfil</Text>
              </View>
              <MenuChevronRightIcon width={22} height={22} />
            </TouchableOpacity>
            <View style={styles.separator} />

            <TouchableOpacity onPress={handleGoToOrders} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Icon name='shopping-cart' size={22} color={COLORS.TEXT} />
                <Text style={styles.menuItemLabel}>Meus Pedidos</Text>
              </View>
              <MenuChevronRightIcon width={22} height={22} />
            </TouchableOpacity>
            <View style={styles.separator} />

            <TouchableOpacity onPress={handleGoToSubscriptions} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Icon name='credit-card' size={22} color={COLORS.TEXT} />
                <Text style={styles.menuItemLabel}>Meus Protocolos e Serviços</Text>
              </View>
              <MenuChevronRightIcon width={22} height={22} />
            </TouchableOpacity>
            <View style={styles.separator} />

            <TouchableOpacity onPress={handleGoToActivities} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Icon name='event-note' size={22} color={COLORS.TEXT} />
                <Text style={styles.menuItemLabel}>Minhas Atividades</Text>
              </View>
              <MenuChevronRightIcon width={22} height={22} />
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>

          <View style={styles.bottomButtons}>
            <SecondaryButton
              label='Logout'
              onPress={handleLogout}
              loading={false}
              disabled={false}
              testID='profile-logout'
            />
            <SecondaryButton
              label='Encerrar a conta'
              onPress={handleDeleteAccountPress}
              loading={deletingAccount}
              disabled={deletingAccount}
              size='large'
              testID='profile-delete-account'
            />
            {ACCOUNT_CONFIG.deletionWebUrl ? (
              <Text
                onPress={() => void handleOpenDeletionWebUrl()}
                accessibilityRole='link'
                style={styles.webDeletionLinkText}
              >
                {t('profile.deleteAccountWebLinkLabel')}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileFloatingMenu;
