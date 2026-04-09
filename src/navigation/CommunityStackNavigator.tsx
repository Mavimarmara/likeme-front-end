import React from 'react';
import { Easing, Platform } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { CommunityScreen } from '@/screens/community';
import { PostDetailScreen } from '@/screens/community';
import type { CommunityStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<CommunityStackParamList>();
const STACK_GESTURE_ENABLED = Platform.OS !== 'android';

const fastFadeTransition = {
  open: { animation: 'timing' as const, config: { duration: 200, easing: Easing.out(Easing.ease) } },
  close: { animation: 'timing' as const, config: { duration: 150, easing: Easing.in(Easing.ease) } },
};

const CommunityStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: STACK_GESTURE_ENABLED,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        transitionSpec: fastFadeTransition,
      }}
    >
      <Stack.Screen name='CommunityList' component={CommunityScreen} />
      <Stack.Screen name='PostDetail' component={PostDetailScreen} />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
