import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { UnauthenticatedScreen, LoadingScreen, WelcomeScreen, IntroScreen, AppPresentationScreen, RegisterScreen, LoginScreen, AnamneseScreen } from '@/screens/auth';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}
      >
               <Stack.Screen
                 name="Loading"
                 component={LoadingScreen}
                 options={{ title: 'Carregando' }}
               />
              <Stack.Screen
                name="Unauthenticated"
                component={UnauthenticatedScreen}
                options={{ title: 'Tela Deslogada', animationEnabled: false }}
              />
               <Stack.Screen
                 name="Welcome"
                 component={WelcomeScreen}
                 options={{ title: 'Boas-vindas' }}
               />
        <Stack.Screen 
          name="Intro" 
          component={IntroScreen}
          options={{ title: 'Introdução' }}
        />
        <Stack.Screen 
          name="AppPresentation" 
          component={AppPresentationScreen}
          options={{ title: 'Apresentação' }}
        />
               <Stack.Screen
                 name="Register"
                 component={RegisterScreen}
                 options={{ title: 'Cadastro' }}
               />
               <Stack.Screen
                 name="Login"
                 component={LoginScreen}
                 options={{ title: 'Login' }}
               />
               <Stack.Screen
                 name="Anamnese"
                 component={AnamneseScreen}
                 options={{ title: 'Anamnese' }}
               />
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
