import React from 'react';
import { Easing } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { CommunityScreen } from '@/screens/community';
import type { CommunityStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<CommunityStackParamList>();

const fastFadeTransition = {
  open: { animation: 'timing' as const, config: { duration: 200, easing: Easing.out(Easing.ease) } },
  close: { animation: 'timing' as const, config: { duration: 150, easing: Easing.in(Easing.ease) } },
};

const CommunityStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        transitionSpec: fastFadeTransition,
      }}
    >
      <Stack.Screen name='CommunityList' component={CommunityScreen} />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;
