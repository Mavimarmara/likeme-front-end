import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { UnauthenticatedScreen, AuthenticatedScreen, LoadingScreen, WelcomeScreen, IntroScreen, AppPresentationScreen, RegisterScreen, PersonalObjectivesScreen, SelfAwarenessIntroScreen } from '@/screens/auth';
import { AnamnesisStartScreen, AnamnesisBodyScreen, AnamnesisHomeScreen } from '@/screens/anamnesis';
import ErrorScreen from '@/screens/ErrorScreen';
import AppLoadingScreen from '@/screens/LoadingScreen';
import { CommunityStackNavigator } from '@/navigation';
import { ActivitiesScreen } from '@/screens/activities';
import { MarketplaceScreen, ProductDetailsScreen, AffiliateProductScreen, CartScreen, CheckoutScreen, CommunityPreviewScreen, ProviderProfileScreen } from '@/screens/marketplace';
import { ProfileScreen } from '@/screens/profile';
import { HomeScreen, SummaryScreen } from '@/screens/home';

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
                name="Authenticated"
                component={AuthenticatedScreen}
                options={{ title: 'Tela Autenticada', animationEnabled: false }}
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
                 name="Anamnesis"
                 component={AnamnesisStartScreen}
                 options={{ title: 'Anamnesis' }}
               />
               <Stack.Screen
                 name="AnamnesisHome"
                 component={AnamnesisHomeScreen}
                 options={{ title: 'Anamnesis Home' }}
               />
               <Stack.Screen
                 name="AnamnesisBody"
                 component={AnamnesisBodyScreen}
                 options={{ title: 'Anamnesis Body' }}
               />
               <Stack.Screen
                 name="PersonalObjectives"
                 component={PersonalObjectivesScreen}
                 options={{ title: 'Objetivos Pessoais' }}
               />
               <Stack.Screen
                 name="SelfAwarenessIntro"
                 component={SelfAwarenessIntroScreen}
                 options={{ title: 'Jornada de Autoconsciência' }}
               />
        <Stack.Screen 
          name="Error" 
          component={ErrorScreen}
          options={{ title: 'Erro' }}
        />
        <Stack.Screen 
          name="AppLoading" 
          component={AppLoadingScreen}
          options={{ title: 'Carregando' }}
        />
        <Stack.Screen
          name="Community"
          component={CommunityStackNavigator}
          options={{ title: 'Comunidade' }}
        />
        <Stack.Screen
          name="Activities"
          component={ActivitiesScreen}
          options={{ title: 'Atividades' }}
        />
        <Stack.Screen
          name="Marketplace"
          component={MarketplaceScreen}
          options={{ title: 'Marketplace' }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ title: 'Detalhes do Produto' }}
        />
        <Stack.Screen
          name="AffiliateProduct"
          component={AffiliateProductScreen}
          options={{ title: 'Produto Afiliado' }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: 'Carrinho' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
        <Stack.Screen
          name="CommunityPreview"
          component={CommunityPreviewScreen}
          options={{ title: 'Community Preview' }}
        />
        <Stack.Screen
          name="ProviderProfile"
          component={ProviderProfileScreen}
          options={{ title: 'Provider Profile' }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'Perfil' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home', animationEnabled: false }}
        />
        <Stack.Screen
          name="Summary"
          component={SummaryScreen}
          options={{ title: 'Resumo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
