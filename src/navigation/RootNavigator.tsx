import React, { lazy, Suspense } from 'react';
import { Easing, Platform, StyleSheet, View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { FloatingMenuProvider } from '@/contexts/FloatingMenuContext';
import { COLORS } from '@/constants';
import {
  getLoadingScreen,
  getUnauthenticatedScreen,
  getAuthenticatedScreen,
  getWelcomeScreen,
  getAppPresentationScreen,
  getRegisterScreen,
  getPlansScreen,
  getAnamnesisStartScreen,
  getAnamnesisHomeScreen,
  getAnamnesisBodyScreen,
  getAnamnesisMindScreen,
  getAnamnesisHabitsScreen,
  getAnamnesisCompletionScreen,
  getPersonalObjectivesScreen,
  getErrorScreen,
  getAppLoadingScreen,
  getCommunityStackNavigator,
  getChatStackNavigator,
  getActivitiesScreen,
  getMarketplaceScreen,
  getProductDetailsScreen,
  getAffiliateProductScreen,
  getCartScreen,
  getCheckoutScreen,
  getCommunityPreviewScreen,
  getProviderProfileScreen,
  getProfileScreen,
  getPrivacyPoliciesScreen,
  getHomeScreen,
  getSummaryScreen,
  getAvatarProgressScreen,
  getMarkerDetailsScreen,
} from '@/navigation/rootStackScreenLoaders';

const SupportFloatingButtonLazy = lazy(() => import('@/components/ui/buttons/SupportFloatingButton'));

const Stack = createStackNavigator();

const rootNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.BACKGROUND,
    card: COLORS.BACKGROUND,
  },
};
const STACK_GESTURE_ENABLED = Platform.OS !== 'android';

const styles = StyleSheet.create({
  stackWrapper: {
    flex: 1,
  },
});

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={rootNavigationTheme}>
      <View style={styles.stackWrapper}>
        <FloatingMenuProvider>
          <Stack.Navigator
            initialRouteName='Loading'
            screenOptions={{
              headerShown: false,
              animationEnabled: true,
              gestureEnabled: STACK_GESTURE_ENABLED,
              cardStyle: { flex: 1, backgroundColor: COLORS.BACKGROUND },
              cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: { duration: 200, easing: Easing.out(Easing.ease) },
                },
                close: {
                  animation: 'timing',
                  config: { duration: 150, easing: Easing.in(Easing.ease) },
                },
              },
            }}
          >
            <Stack.Screen name='Loading' getComponent={getLoadingScreen} options={{ title: 'Carregando' }} />
            <Stack.Screen
              name='Unauthenticated'
              getComponent={getUnauthenticatedScreen}
              options={{ title: 'Tela Deslogada' }}
            />
            <Stack.Screen
              name='Authenticated'
              getComponent={getAuthenticatedScreen}
              options={{ title: 'Tela Autenticada' }}
            />
            <Stack.Screen name='Welcome' getComponent={getWelcomeScreen} options={{ title: 'Boas-vindas' }} />
            <Stack.Screen
              name='AppPresentation'
              getComponent={getAppPresentationScreen}
              options={{ title: 'Apresentação' }}
            />
            <Stack.Screen name='Register' getComponent={getRegisterScreen} options={{ title: 'Cadastro' }} />
            <Stack.Screen name='Plans' getComponent={getPlansScreen} options={{ title: 'Planos' }} />
            <Stack.Screen name='Anamnesis' getComponent={getAnamnesisStartScreen} options={{ title: 'Anamnesis' }} />
            <Stack.Screen
              name='AnamnesisHome'
              getComponent={getAnamnesisHomeScreen}
              options={{ title: 'Anamnesis Home' }}
            />
            <Stack.Screen
              name='AnamnesisBody'
              getComponent={getAnamnesisBodyScreen}
              options={{ title: 'Anamnesis Body' }}
            />
            <Stack.Screen
              name='AnamnesisMind'
              getComponent={getAnamnesisMindScreen}
              options={{ title: 'Anamnesis Mind' }}
            />
            <Stack.Screen
              name='AnamnesisHabits'
              getComponent={getAnamnesisHabitsScreen}
              options={{ title: 'Anamnesis Habits' }}
            />
            <Stack.Screen
              name='AnamnesisCompletion'
              getComponent={getAnamnesisCompletionScreen}
              options={{ title: 'Anamnesis Conclusão' }}
            />
            <Stack.Screen
              name='PersonalObjectives'
              getComponent={getPersonalObjectivesScreen}
              options={{ title: 'Objetivos Pessoais' }}
            />
            <Stack.Screen name='Error' getComponent={getErrorScreen} options={{ title: 'Erro' }} />
            <Stack.Screen name='AppLoading' getComponent={getAppLoadingScreen} options={{ title: 'Carregando' }} />
            <Stack.Screen
              name='Community'
              getComponent={getCommunityStackNavigator}
              options={{ title: 'Comunidade' }}
            />
            <Stack.Screen name='Chat' getComponent={getChatStackNavigator} options={{ title: 'Chat' }} />
            <Stack.Screen name='Activities' getComponent={getActivitiesScreen} options={{ title: 'Atividades' }} />
            <Stack.Screen name='Marketplace' getComponent={getMarketplaceScreen} options={{ title: 'Marketplace' }} />
            <Stack.Screen
              name='ProductDetails'
              getComponent={getProductDetailsScreen}
              options={{ title: 'Detalhes do Produto' }}
            />
            <Stack.Screen
              name='AffiliateProduct'
              getComponent={getAffiliateProductScreen}
              options={{ title: 'Produto Afiliado' }}
            />
            <Stack.Screen name='Cart' getComponent={getCartScreen} options={{ title: 'Carrinho' }} />
            <Stack.Screen name='Checkout' getComponent={getCheckoutScreen} options={{ title: 'Checkout' }} />
            <Stack.Screen
              name='CommunityPreview'
              getComponent={getCommunityPreviewScreen}
              options={{ title: 'Community Preview' }}
            />
            <Stack.Screen
              name='ProviderProfile'
              getComponent={getProviderProfileScreen}
              options={{ title: 'Provider Profile' }}
            />
            <Stack.Screen name='Profile' getComponent={getProfileScreen} options={{ title: 'Perfil' }} />
            <Stack.Screen
              name='PrivacyPolicies'
              getComponent={getPrivacyPoliciesScreen}
              options={{ title: 'Política de Privacidade' }}
            />
            <Stack.Screen name='Home' getComponent={getHomeScreen} options={{ title: 'Home' }} />
            <Stack.Screen name='Summary' getComponent={getSummaryScreen} options={{ title: 'Resumo' }} />
            <Stack.Screen
              name='AvatarProgress'
              getComponent={getAvatarProgressScreen}
              options={{ title: 'Seu Progresso' }}
            />
            <Stack.Screen
              name='MarkerDetails'
              getComponent={getMarkerDetailsScreen}
              options={{ title: 'Detalhes do Marker' }}
            />
          </Stack.Navigator>
          <Suspense fallback={null}>
            <SupportFloatingButtonLazy />
          </Suspense>
        </FloatingMenuProvider>
      </View>
    </NavigationContainer>
  );
};

export default RootNavigator;
