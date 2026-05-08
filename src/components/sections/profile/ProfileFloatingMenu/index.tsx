import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Image, Linking, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SecondaryButton } from '@/components/ui/buttons';
import { AuthService, storageService, userService } from '@/services';
import { useTranslation } from '@/hooks/i18n';
import type { StoredUser } from '@/types/auth';
import { COLORS } from '@/constants';
import { ACCOUNT_CONFIG } from '@/config/environment';
import { logger } from '@/utils/logger';
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

  const handleGoToOrders = () => {
    onClose();
    rootNavigation.navigate('Activities' as never, { initialTab: 'history', initialFilter: 'orders' } as never);
  };

  const handleGoToActivities = () => {
    onClose();
    rootNavigation.navigate('Activities' as never, { initialTab: 'actives' } as never);
  };

  const handleGoToProtocolsAndServices = () => {
    onClose();
    rootNavigation.navigate('Marketplace' as never);
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
                <Image source={{ uri: user.picture }} style={styles.avatar} />
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
            <View style={styles.menuItemDisabled}>
              <View style={styles.menuItemLeft}>
                <Icon name='person-outline' size={22} color='#9aa2b1' />
                <Text style={styles.menuItemDisabledLabel}>Meu Perfil</Text>
              </View>
              <Icon name='chevron-right' size={22} color='#C7CED8' />
            </View>
            <View style={styles.separator} />

            <TouchableOpacity onPress={handleGoToOrders} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Icon name='shopping-cart' size={22} color={COLORS.TEXT} />
                <Text style={styles.menuItemLabel}>Meus Pedidos</Text>
              </View>
              <Icon name='chevron-right' size={22} color='#6e6a6a' />
            </TouchableOpacity>
            <View style={styles.separator} />

            <TouchableOpacity onPress={handleGoToProtocolsAndServices} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Icon name='credit-card' size={22} color={COLORS.TEXT} />
                <Text style={styles.menuItemLabel}>Meus Protocolos e Servicos</Text>
              </View>
              <Icon name='chevron-right' size={22} color='#6e6a6a' />
            </TouchableOpacity>
            <View style={styles.separator} />

            <TouchableOpacity onPress={handleGoToActivities} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <Icon name='event-note' size={22} color={COLORS.TEXT} />
                <Text style={styles.menuItemLabel}>Minhas Atividades</Text>
              </View>
              <Icon name='chevron-right' size={22} color='#6e6a6a' />
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
            <TouchableOpacity
              onPress={handleDeleteAccountPress}
              disabled={deletingAccount}
              style={[styles.deleteButton, deletingAccount ? styles.deleteButtonDisabled : null]}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonLabel}>Encerrar a conta</Text>
            </TouchableOpacity>
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
