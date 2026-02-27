import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from '@/components/ui';
import { FloatingMenu } from '@/components/ui/menu';
import { Header, Background } from '@/components/ui/layout';
import { useTranslation } from '@/hooks/i18n';
import { useChat, useMenuItems } from '@/hooks';
import type { ChatConversation } from '@/hooks';
import { LogoMini } from '@/assets';
import { COLORS } from '@/constants';
import { storageService } from '@/services';
import type { CommunityStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type ChatListNavigationProp = StackNavigationProp<CommunityStackParamList, 'ChatList'>;

type Props = {
  navigation: ChatListNavigationProp;
};

const ChatListScreen: React.FC<Props> = () => {
  useAnalyticsScreen({ screenName: 'ChatList', screenClass: 'ChatListScreen' });
  const { t } = useTranslation();
  const navigation = useNavigation<ChatListNavigationProp>();
  const rootNavigation = navigation.getParent() ?? navigation;
  const [searchQuery, setSearchQuery] = useState('');
  const [userAvatarUri, setUserAvatarUri] = useState<string | null>(null);

  const { conversations, loading, refresh } = useChat({ searchQuery });
  const menuItems = useMenuItems(navigation);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const user = await storageService.getUser();
      setUserAvatarUri(user?.picture ?? null);
    };
    loadUser();
  }, []);

  const handleCartPress = () => {
    rootNavigation.navigate('Cart' as never);
  };

  const handleMenuPress = () => {
    rootNavigation.navigate('Profile' as never);
  };

  const handleConversationPress = (conversation: ChatConversation) => {
    // TODO: Navegar para tela de conversa individual
    console.log('Abrir conversa:', conversation.id);
  };

  const renderAvatar = (conversation: ChatConversation) => {
    if (conversation.showLogo && !conversation.avatar) {
      return (
        <View style={styles.likemeAvatar}>
          <LinearGradient
            colors={['#FF6B6B', '#4ECDC4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.likemeAvatarGradient}
          />
        </View>
      );
    }

    if (conversation.avatar) {
      return <Image source={{ uri: conversation.avatar }} style={styles.avatar} />;
    }

    return (
      <View style={styles.avatarPlaceholder}>
        <Icon name='person' size={32} color={COLORS.TEXT_LIGHT} />
      </View>
    );
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
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder={t('common.search')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearchPress={() => {
            /* noop */
          }}
          showFilterButton={false}
        />
      </View>

      {/* Conversations List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('chat.yourConversations')}</Text>
        </View>

        {loading && (
          <View style={styles.centerContainer}>
            <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} />
          </View>
        )}

        {!loading && conversations.length === 0 && (
          <View style={styles.centerContainer}>
            <Icon name='chat-bubble-outline' size={48} color={COLORS.TEXT_LIGHT} />
            <Text style={styles.emptyText}>{t('chat.noConversations')}</Text>
          </View>
        )}

        {conversations.length > 0 && (
          <View style={styles.conversationsContainer}>
            {conversations.map((conversation, index) => (
              <TouchableOpacity
                key={conversation.id}
                style={[styles.conversationItem, index < conversations.length - 1 && styles.conversationItemBorder]}
                onPress={() => handleConversationPress(conversation)}
                activeOpacity={0.7}
              >
                {renderAvatar(conversation)}

                <View style={styles.conversationInfo}>
                  <View style={styles.conversationHeader}>
                    <View style={styles.conversationNameContainer}>
                      {conversation.showLogo && (
                        <View style={styles.likemeLogoContainer}>
                          <LogoMini width={83} height={15} />
                        </View>
                      )}
                      <Text style={styles.conversationName} numberOfLines={1}>
                        {conversation.name}
                      </Text>
                    </View>
                    <Text style={styles.conversationTimestamp}>{conversation.timestamp}</Text>
                  </View>

                  <View style={styles.conversationMessageRow}>
                    <View style={styles.conversationMessageContainer}>
                      <Text
                        style={[
                          styles.conversationMessage,
                          conversation.unreadCount > 0 && styles.conversationMessageUnread,
                        ]}
                        numberOfLines={2}
                      >
                        {conversation.lastMessage}
                      </Text>
                    </View>
                    {conversation.unreadCount > 0 && (
                      <View style={styles.notificationBadge}>
                        <Text style={styles.notificationText}>{conversation.unreadCount}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <FloatingMenu items={menuItems} selectedId='chat' />
    </SafeAreaView>
  );
};

export default ChatListScreen;
