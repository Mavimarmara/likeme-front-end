import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

export interface ProviderChat {
  id: string;
  providerName: string;
  providerAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
}

type Props = {
  chat: ProviderChat;
  onPress?: (chat: ProviderChat) => void;
};

const ProviderChatCard: React.FC<Props> = ({ chat, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Chat with your provider</Text>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress?.(chat)}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          {chat.providerAvatar ? (
            <Image
              source={{ uri: chat.providerAvatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={32} color="#6e6a6a" />
            </View>
          )}
          
          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.providerName} numberOfLines={1}>
                {chat.providerName}
              </Text>
              <Text style={styles.timestamp}>{chat.timestamp}</Text>
            </View>
            
            <View style={styles.messageRow}>
              <View style={styles.messageContainer}>
                <Text style={styles.messagePreview} numberOfLines={2}>
                  {chat.lastMessage}
                </Text>
              </View>
              {chat.unreadCount && chat.unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{chat.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProviderChatCard;

