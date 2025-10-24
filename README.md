# LikeMe Front-End

Um aplicativo React Native completo para saúde e bem-estar, com funcionalidades de onboarding, cadastro, anamnese, wellness, atividades, protocolos, marketplace, comunidade e provedores de saúde.

## 🚀 Funcionalidades

- **Onboarding**: Introdução ao app com slides interativos
- **Cadastro**: Sistema de registro de usuários
- **Anamnese**: Questionário de saúde personalizado
- **Wellness**: Dashboard de bem-estar com métricas
- **Atividades**: Gerenciamento de atividades de saúde
- **Protocolos**: Protocolos personalizados de tratamento
- **Marketplace**: Loja de produtos de saúde
- **Comunidade**: Rede social para compartilhamento
- **Provedores de Saúde**: Busca e agendamento com profissionais

## 📱 Telas Implementadas

### Telas de Onboarding
- OnboardingScreen: Introdução ao app
- RegisterScreen: Cadastro de usuários
- AnamneseScreen: Questionário de saúde

### Telas Principais
- WellnessScreen: Dashboard de bem-estar
- ActivitiesScreen: Gerenciamento de atividades
- ProtocolScreen: Protocolos de tratamento
- MarketplaceScreen: Loja de produtos
- CommunityScreen: Rede social
- HealthProviderScreen: Provedores de saúde

## 🛠 Tecnologias Utilizadas

- **React Native 0.72.6**
- **React Navigation 6.x**
- **React Native Paper** (UI Components)
- **React Native Vector Icons**
- **React Native Linear Gradient**
- **TypeScript**

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd likeme-front-end
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Para iOS:
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

4. Para Android:
```bash
npx react-native run-android
```

## 🏗 Estrutura do Projeto

```
likeme-front-end/
├── src/
├── navigation/
│   └── MainTabNavigator.tsx    # Navegação principal
├── screens/
│   ├── OnboardingScreen.tsx   # Tela de introdução
│   ├── RegisterScreen.tsx      # Tela de cadastro
│   ├── AnamneseScreen.tsx     # Tela de anamnese
│   ├── WellnessScreen.tsx     # Dashboard de bem-estar
│   ├── ActivitiesScreen.tsx   # Gerenciamento de atividades
│   ├── ProtocolScreen.tsx     # Protocolos de tratamento
│   ├── MarketplaceScreen.tsx  # Loja de produtos
│   ├── CommunityScreen.tsx    # Rede social
│   └── HealthProviderScreen.tsx # Provedores de saúde
└── App.tsx                    # Componente principal
```

## 🎨 Design System

O app utiliza um design system consistente com:
- **Cores primárias**: Verde (#4CAF50) para saúde e bem-estar
- **Tipografia**: Sistema de fontes hierárquico
- **Componentes**: Cards, botões, chips e ícones padronizados
- **Navegação**: Tab navigation com ícones intuitivos

## 📱 Navegação

O app utiliza React Navigation com:
- **Stack Navigator**: Para fluxo de onboarding
- **Tab Navigator**: Para navegação principal
- **Navegação hierárquica**: Onboarding → Cadastro → Anamnese → App Principal

## 🔧 Configuração

### Dependências Principais
- `@react-navigation/native`: Navegação
- `@react-navigation/stack`: Stack navigator
- `@react-navigation/bottom-tabs`: Tab navigator
- `react-native-paper`: Componentes UI
- `react-native-vector-icons`: Ícones
- `react-native-linear-gradient`: Gradientes

### Configurações
- **Metro**: Configurado para React Native
- **Babel**: Preset para React Native
- **TypeScript**: Configuração para React Native

## 🚀 Próximos Passos

1. **Integração com Backend**: APIs para dados reais
2. **Autenticação**: Sistema de login seguro
3. **Notificações**: Push notifications
4. **Offline**: Funcionalidades offline
5. **Testes**: Testes unitários e de integração
6. **Deploy**: Configuração para produção

## 📄 Licença

Este projeto está sob a licença MIT.