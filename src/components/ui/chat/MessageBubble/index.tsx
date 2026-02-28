import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

export interface MessageBubbleProps {
  text: string;
  timestamp?: string;
  isOwn: boolean;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, timestamp, isOwn }) => {
  return (
    <View style={[styles.wrapper, isOwn ? styles.wrapperSent : styles.wrapperReceived]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleSent : styles.bubbleReceived]}>
        <Text style={[styles.text, isOwn ? styles.textSent : styles.textReceived]}>{text}</Text>
      </View>
      {timestamp ? (
        <Text style={[styles.timestamp, isOwn ? styles.timestampSent : styles.timestampReceived]}>
          {formatTime(timestamp)}
        </Text>
      ) : null}
    </View>
  );
};

export default MessageBubble;
