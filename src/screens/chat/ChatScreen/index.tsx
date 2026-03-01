import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Header, Background } from '@/components/ui/layout';
import { IconButton } from '@/components/ui/buttons';
import { MessageBubble } from '@/components/ui/chat';
import { COLORS } from '@/constants';
import { chatService } from '@/services';
import { useBlockedUser, useUserAvatar, useTranslation } from '@/hooks';
import type { ChatStackParamList } from '@/types/navigation';
import { useAnalyticsScreen } from '@/analytics';
import { styles } from './styles';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

type ChatNavigation = StackNavigationProp<ChatStackParamList, 'Chat'>;

function mapRawMessage(msg: any, currentUserId: string): ChatMessage {
  return {
    id: msg.messageId || msg._id,
    text: msg.data?.text || '',
    timestamp: msg.createdAt || msg.editedAt || '',
    isOwn: msg.userId === currentUserId,
  };
}

const ChatScreen: React.FC = () => {
  useAnalyticsScreen({ screenName: 'Chat', screenClass: 'ChatScreen' });
  const { t } = useTranslation();
  const navigation = useNavigation<ChatNavigation>();
  const route = useRoute<RouteProp<ChatStackParamList, 'Chat'>>();
  const { channelId, channelName, channelAvatar, channelDescription } = route.params;

  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');

  const userAvatarUri = useUserAvatar();
  const { isBlocked, checkStatus: recheckBlocked } = useBlockedUser(channelId);

  useFocusEffect(
    useCallback(() => {
      recheckBlocked();
    }, [recheckBlocked]),
  );

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await chatService.getChannelMessages(channelId);
      if (response.success && response.data) {
        const { messages: rawMessages, currentUserId: backendUserId } = response.data;
        if (rawMessages) {
          setMessages(rawMessages.map((msg: any) => mapRawMessage(msg, backendUserId)).reverse());
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
    (navigation.getParent() ?? navigation).navigate('Profile' as never);
  };

  const handleCartPress = () => {
    (navigation.getParent() ?? navigation).navigate('Cart' as never);
  };

  const [sending, setSending] = useState(false);

  const isSendDisabled = useMemo(
    () => isBlocked || sending || messageText.trim().length === 0,
    [isBlocked, sending, messageText],
  );

  const handleSendMessage = useCallback(async () => {
    const trimmed = messageText.trim();
    if (trimmed.length === 0 || sending) return;

    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: optimisticId,
      text: trimmed,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setMessageText('');
    setSending(true);

    try {
      const response = await chatService.sendMessage(channelId, trimmed);
      if (!response.success) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setMessageText(trimmed);
        Alert.alert(t('chat.errorTitle'), t('chat.sendError'));
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setMessageText(trimmed);
      Alert.alert(t('chat.errorTitle'), t('chat.sendError'));
    } finally {
      setSending(false);
    }
  }, [messageText, sending, channelId, t]);

  const navigateToDetails = () => {
    navigation.navigate('ChatDetails', { channelId, channelName, channelAvatar });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Background />
        <SafeAreaView edges={['top']}>
          <Header
            showBackButton={false}
            showMenuWithAvatar
            onMenuPress={handleMenuPress}
            userAvatarUri={userAvatarUri}
            showCartButton
            onCartPress={handleCartPress}
            showBellButton
          />

          <View style={styles.chatHeader}>
            <IconButton icon='chevron-left' onPress={() => navigation.goBack()} backgroundSize='medium' />
            <TouchableOpacity style={styles.headerInfo} activeOpacity={0.7} onPress={navigateToDetails}>
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
        </SafeAreaView>
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
              <Text style={styles.emptyText}>{t('chat.noMessages')}</Text>
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
              placeholder={isBlocked ? t('chat.blockedPlaceholder') : t('chat.messagePlaceholder')}
              placeholderTextColor={isBlocked ? 'rgba(110,106,106,0.6)' : 'rgba(253,251,238,0.8)'}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              editable={!isBlocked}
            />
          </View>

          <IconButton
            icon='send'
            variant='dark'
            onPress={handleSendMessage}
            backgroundSize='medium'
            disabled={isSendDisabled}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;
