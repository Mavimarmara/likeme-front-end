import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import { OnboardingScreen, RegisterScreen, AnamneseScreen } from '../screens/auth';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Onboarding Flow */}
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ title: 'Bem-vindo' }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ title: 'Cadastro' }}
        />
        <Stack.Screen 
          name="Anamnese" 
          component={AnamneseScreen}
          options={{ title: 'Anamnese' }}
        />
        
        {/* Main App */}
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator}
          options={{ title: 'LikeMe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
