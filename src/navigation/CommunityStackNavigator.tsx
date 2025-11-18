import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommunityScreen, PostDetailsScreen } from '@/screens/community';
import { Post } from '@/components/ui';

export type CommunityStackParamList = {
  CommunityList: undefined;
  PostDetails: { post: Post };
};

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
    </Stack.Navigator>
  );
};

export default CommunityStackNavigator;

