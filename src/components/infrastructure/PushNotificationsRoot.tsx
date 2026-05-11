import React from 'react';
import { useNotifications } from '@/hooks/notification/useNotifications';

type Props = {
  activeRouteName: string | undefined;
};

const PushNotificationsRoot: React.FC<Props> = ({ activeRouteName }) => {
  useNotifications({ activeRouteName });
  return null;
};

export default PushNotificationsRoot;
