import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { COLORS } from '@/constants';
import { communityService, storageService } from '@/services';
import type { CommunityStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

const ChatDetailsScreen: React.FC = () => {
  useAnalyticsScreen({ screenName: 'ChatDetails', screenClass: 'ChatDetailsScreen' });
  const navigation = useNavigation<StackNavigationProp<CommunityStackParamList, 'ChatDetails'>>();
  const route = useRoute<RouteProp<CommunityStackParamList, 'ChatDetails'>>();
  const { channelId, channelName, channelAvatar } = route.params;

  const [userAvatarUri, setUserAvatarUri] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [loadingLeave, setLoadingLeave] = useState(false);
  const [checkingBlock, setCheckingBlock] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const user = await storageService.getUser();
      setUserAvatarUri(user?.picture ?? null);
    };
    loadUser();
  }, []);

  const checkBlockedStatus = useCallback(async () => {
    try {
      setCheckingBlock(true);
      const response = await communityService.getBlockedUsers();
      if (response.success && response.data) {
        const blockedList: string[] = response.data.userIds || response.data.users?.map((u: any) => u.userId) || [];
        setIsBlocked(blockedList.includes(channelId));
      }
    } catch {
      // silently ignore
    } finally {
      setCheckingBlock(false);
    }
  }, [channelId]);

  useEffect(() => {
    checkBlockedStatus();
  }, [checkBlockedStatus]);

  const handleMenuPress = () => {
    const rootNavigation = navigation.getParent() ?? navigation;
    rootNavigation.navigate('Profile' as never);
  };

  const handleCartPress = () => {
    const rootNavigation = navigation.getParent() ?? navigation;
    rootNavigation.navigate('Cart' as never);
  };

  const handleToggleBlock = async () => {
    const action = isBlocked ? 'desbloquear' : 'bloquear';
    Alert.alert(
      isBlocked ? 'Desbloquear contato' : 'Bloquear contato',
      `Tem certeza que deseja ${action} ${channelName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: isBlocked ? 'default' : 'destructive',
          onPress: async () => {
            try {
              setLoadingBlock(true);
              if (isBlocked) {
                await communityService.unblockUser(channelId);
              } else {
                await communityService.blockUser(channelId);
              }
              setIsBlocked(!isBlocked);
            } catch {
              Alert.alert('Erro', `Não foi possível ${action} o contato.`);
            } finally {
              setLoadingBlock(false);
            }
          },
        },
      ],
    );
  };

  const handleLeaveChannel = () => {
    Alert.alert('Excluir conversa', `Tem certeza que deseja excluir a conversa com ${channelName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoadingLeave(true);
            await communityService.leaveChannel(channelId);
            navigation.popToTop();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir a conversa.');
            setLoadingLeave(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Background />
      <Header
        showBackButton={false}
        showMenuWithAvatar
        onMenuPress={handleMenuPress}
        userAvatarUri={userAvatarUri}
        showCartButton={true}
        onCartPress={handleCartPress}
      />

      <View style={styles.subHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name='chevron-left' size={24} color={COLORS.NEUTRAL.LOW.PURE} />
        </TouchableOpacity>
        <Text style={styles.title}>Dados do contato</Text>
      </View>

      <View style={styles.content}>
        {channelAvatar ? (
          <Image source={{ uri: channelAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icon name='person' size={56} color={COLORS.TEXT_LIGHT} />
          </View>
        )}
        <Text style={styles.contactName}>{channelName}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.8}
          onPress={handleLeaveChannel}
          disabled={loadingLeave}
        >
          {loadingLeave ? (
            <ActivityIndicator size='small' color={COLORS.WHITE} />
          ) : (
            <Text style={styles.deleteButtonText}>Excluir conversa</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.blockButton}
          activeOpacity={0.8}
          onPress={handleToggleBlock}
          disabled={loadingBlock || checkingBlock}
        >
          {loadingBlock || checkingBlock ? (
            <ActivityIndicator size='small' color={COLORS.NEUTRAL.LOW.PURE} />
          ) : (
            <Text style={styles.blockButtonText}>{isBlocked ? 'Desbloquear contato' : 'Bloquear contato'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatDetailsScreen;
