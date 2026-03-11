import React from 'react';
import { Easing } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { ChatListScreen, ChatScreen, ChatDetailsScreen } from '@/screens/chat';
import type { ChatStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<ChatStackParamList>();

const fastFadeTransition = {
  open: { animation: 'timing' as const, config: { duration: 200, easing: Easing.out(Easing.ease) } },
  close: { animation: 'timing' as const, config: { duration: 150, easing: Easing.in(Easing.ease) } },
};

const ChatStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        transitionSpec: fastFadeTransition,
      }}
    >
      <Stack.Screen name='ChatList' component={ChatListScreen} />
      <Stack.Screen name='Chat' component={ChatScreen} />
      <Stack.Screen name='ChatDetails' component={ChatDetailsScreen} />
    </Stack.Navigator>
  );
};

export default ChatStackNavigator;
