import React from 'react';
import { useAnalyticsScreen } from '@/analytics';
import ProfileFloatingMenu from '@/components/sections/profile/ProfileFloatingMenu';

type Props = {
  navigation: any;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  useAnalyticsScreen({ screenName: 'Profile', screenClass: 'ProfileScreen' });
  return <ProfileFloatingMenu visible navigation={navigation} onClose={() => navigation.goBack()} />;
};

export default ProfileScreen;
