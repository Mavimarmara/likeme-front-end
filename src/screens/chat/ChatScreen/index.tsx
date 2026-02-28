import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { MessageBubble } from '@/components/ui/chat';
import { COLORS } from '@/constants';
import { communityService, storageService } from '@/services';
import type { CommunityStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

const ChatScreen: React.FC = () => {
  useAnalyticsScreen({ screenName: 'Chat', screenClass: 'ChatScreen' });
  const navigation = useNavigation<StackNavigationProp<CommunityStackParamList, 'Chat'>>();
  const route = useRoute<RouteProp<CommunityStackParamList, 'Chat'>>();
  const { channelId, channelName, channelAvatar, channelDescription } = route.params;

  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [userAvatarUri, setUserAvatarUri] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const user = await storageService.getUser();
      setUserAvatarUri(user?.picture ?? null);
    };
    loadUser();
  }, []);

  const checkBlockedStatus = useCallback(async () => {
    try {
      const response = await communityService.getBlockedUsers();
      if (response.success && response.data) {
        const blockedList: string[] = response.data.userIds || response.data.users?.map((u: any) => u.userId) || [];
        setIsBlocked(blockedList.includes(channelId));
      }
    } catch {
      // silently ignore
    }
  }, [channelId]);

  useFocusEffect(
    useCallback(() => {
      checkBlockedStatus();
    }, [checkBlockedStatus]),
  );

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await communityService.getChannelMessages(channelId);
      if (response.success && response.data) {
        const { messages: rawMessages, currentUserId: backendUserId } = response.data;
        if (rawMessages) {
          const mapped: ChatMessage[] = rawMessages.map((msg: any) => ({
            id: msg.messageId || msg._id,
            text: msg.data?.text || '',
            timestamp: msg.createdAt || msg.editedAt || '',
            isOwn: msg.userId === backendUserId,
          }));
          setMessages(mapped.reverse());
        }
      }
    } catch (err) {
      console.error('[ChatScreen] Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [messages]);

  const handleMenuPress = () => {
    const rootNavigation = navigation.getParent() ?? navigation;
    rootNavigation.navigate('Profile' as never);
  };

  const handleCartPress = () => {
    const rootNavigation = navigation.getParent() ?? navigation;
    rootNavigation.navigate('Cart' as never);
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

      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name='chevron-left' size={24} color={COLORS.NEUTRAL.LOW.PURE} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfo}
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate('ChatDetails', {
              channelId,
              channelName,
              channelAvatar,
            })
          }
        >
          {channelAvatar ? (
            <Image source={{ uri: channelAvatar }} style={styles.headerAvatar} />
          ) : (
            <View style={styles.headerAvatarPlaceholder}>
              <Icon name='person' size={28} color={COLORS.TEXT_LIGHT} />
            </View>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName} numberOfLines={1}>
              {channelName}
            </Text>
            {channelDescription ? (
              <Text style={styles.headerDescription} numberOfLines={1}>
                {channelDescription}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {loading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size='large' color={COLORS.PRIMARY.PURE} />
            </View>
          )}

          {!loading && messages.length === 0 && (
            <View style={styles.centerContainer}>
              <Icon name='chat-bubble-outline' size={48} color={COLORS.TEXT_LIGHT} />
              <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
            </View>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} text={msg.text} timestamp={msg.timestamp} isOwn={msg.isOwn} />
          ))}
        </ScrollView>

        <View style={[styles.inputContainer, isBlocked && styles.inputContainerDisabled]}>
          <View style={[styles.textInputWrapper, isBlocked && styles.textInputWrapperDisabled]}>
            <TextInput
              style={styles.textInput}
              placeholder={isBlocked ? 'Contato bloqueado' : 'Mensagem...'}
              placeholderTextColor={isBlocked ? 'rgba(110,106,106,0.6)' : 'rgba(253,251,238,0.8)'}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              editable={!isBlocked}
            />
          </View>

          <TouchableOpacity style={[styles.sendButton, isBlocked && styles.sendButtonDisabled]} disabled={isBlocked}>
            <Icon name='send' size={20} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
