import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from '@/components/ui';
import { Header, Background } from '@/components/ui/layout';
import { useTranslation } from '@/hooks/i18n';
import { LogoMini } from '@/assets';
import { COLORS } from '@/constants';
import { storageService } from '@/services';
import type { CommunityStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

type ChatScreenNavigationProp = StackNavigationProp<CommunityStackParamList, 'ChatScreen'>;
type ChatScreenRouteProp = RouteProp<CommunityStackParamList, 'ChatScreen'>;

type Props = {
  navigation: ChatScreenNavigationProp;
};

interface ChatConversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string | Error;
  timestamp: string;
  unreadCount?: number;
  isProvider?: boolean;
  showLogo?: boolean;
}

const ChatScreen: React.FC<Props> = () => {
  useAnalyticsScreen({ screenName: 'ChatScreen', screenClass: 'ChatScreen' });
  const { t } = useTranslation();
  useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const rootNavigation = navigation.getParent() ?? navigation;
  const [searchQuery, setSearchQuery] = useState('');
  const [userAvatarUri, setUserAvatarUri] = useState<string | null>(null);

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

  // Mock conversations - em produção, isso viria de um serviço/API
  const conversations: ChatConversation[] = [
    {
      id: '1',
      name: 'LIKE:ME',
      avatar: undefined, // Avatar especial com gradiente
      lastMessage: 'Hello, Carol!\nWhat do you think about updating...',
      timestamp: '10:14',
      unreadCount: 1,
      isProvider: false,
      showLogo: true, // Mostrar logo LIKE:ME ao lado do nome
    },
    {
      id: '2',
      name: 'Ethan Parker',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      lastMessage: 'Hello, Carol!\nWhat do you think about updating y...',
      timestamp: '10:14',
      unreadCount: 1,
      isProvider: true,
    },
    {
      id: '3',
      name: 'Carol Smith',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      lastMessage: "Hi, Carol! I think it's a great idea. More sleep would be beneficial...",
      timestamp: '10:15',
      unreadCount: 2,
      isProvider: true,
    },
    {
      id: '4',
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      lastMessage: "Hey Carol, I've been adjusting my routine too. Let's share tips!",
      timestamp: '4d',
      unreadCount: 3,
      isProvider: true,
    },
  ];

  const handleConversationPress = (conversation: ChatConversation) => {
    // TODO: Navegar para tela de conversa individual
    console.log('Abrir conversa:', conversation.id);
  };

  const renderAvatar = (conversation: ChatConversation) => {
    if (conversation.id === '1' && !conversation.avatar) {
      // Avatar especial LIKE:ME com gradiente
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
          onFilterPress={() => {
            /* noop */
          }}
          showFilterButton={true}
        />
      </View>

      {/* Conversations List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your conversations</Text>
        </View>

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
                        conversation.unreadCount && conversation.unreadCount > 0 && styles.conversationMessageUnread,
                      ]}
                      numberOfLines={2}
                    >
                      {typeof conversation.lastMessage === 'string'
                        ? conversation.lastMessage
                        : conversation.lastMessage instanceof Error
                        ? conversation.lastMessage.message || ''
                        : String(conversation.lastMessage || '')}
                    </Text>
                  </View>
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <View style={styles.notificationBadge}>
                      <Text style={styles.notificationText}>{conversation.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatScreen;
