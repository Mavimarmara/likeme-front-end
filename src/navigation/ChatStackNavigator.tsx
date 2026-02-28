import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChatListScreen, ChatScreen, ChatDetailsScreen } from '@/screens/chat';
import type { ChatStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<ChatStackParamList>();

const ChatStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ChatList' component={ChatListScreen} />
      <Stack.Screen name='Chat' component={ChatScreen} />
      <Stack.Screen name='ChatDetails' component={ChatDetailsScreen} />
    </Stack.Navigator>
  );
};

export default ChatStackNavigator;
