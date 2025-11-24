import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommunityScreen, PostDetailsScreen, ChatScreen } from '@/screens/community';
import type { CommunityStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<CommunityStackParamList>();

const CommunityStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="CommunityList"
        component={CommunityScreen}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetailsScreen}
        options={{ title: 'Post' }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ title: 'Chat' }}
      />
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;

