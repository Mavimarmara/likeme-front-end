import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import {
  WellnessScreen,
  ActivitiesScreen,
  ProtocolScreen,
  HealthProviderScreen,
} from '../screens/wellness';
import { MarketplaceScreen } from '../screens/marketplace';
import { CommunityScreen } from '../screens/community';

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Wellness':
              iconName = 'favorite';
              break;
            case 'Activities':
              iconName = 'fitness-center';
              break;
            case 'Protocol':
              iconName = 'assignment';
              break;
            case 'Marketplace':
              iconName = 'store';
              break;
            case 'Community':
              iconName = 'group';
              break;
            case 'HealthProvider':
              iconName = 'local-hospital';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Wellness" 
        component={WellnessScreen}
        options={{ title: 'Bem-estar' }}
      />
      <Tab.Screen 
        name="Activities" 
        component={ActivitiesScreen}
        options={{ title: 'Atividades' }}
      />
      <Tab.Screen 
        name="Protocol" 
        component={ProtocolScreen}
        options={{ title: 'Protocolo' }}
      />
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceScreen}
        options={{ title: 'Marketplace' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Comunidade' }}
      />
      <Tab.Screen 
        name="HealthProvider" 
        component={HealthProviderScreen}
        options={{ title: 'Provedor de Saúde' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
