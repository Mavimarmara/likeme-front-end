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

- **Expo SDK 52**
- **React Native 0.76.3**
- **React Navigation 6.x**
- **React Native Paper** (UI Components)
- **React Native Vector Icons**
- **Expo Linear Gradient**
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

3. Inicie o servidor de desenvolvimento:
```bash
npm start
# ou
yarn start
# ou
npx expo start
```

4. Para executar no dispositivo/simulador:

**iOS:**
```bash
npm run ios
# ou
yarn ios
# ou
npx expo start --reset-cache --clear --ios
```

**Android:**
```bash
npm run android
# ou
yarn android
# ou
npx expo start --android
```

**Web:**
```bash
npm run web
# ou
yarn web
# ou
npx expo start --web
```

## 📱 Executando no Dispositivo

### Usando Expo Go (Recomendado para desenvolvimento)
1. Instale o app **Expo Go** no seu dispositivo
2. Execute `npx expo start`
3. Escaneie o QR code com o Expo Go (Android) ou Camera (iOS)

### Usando EAS Build (Para produção)
```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Login no Expo
eas login

# Configurar build
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 🏗 Estrutura do Projeto

```
likeme-front-end/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ui/              # Componentes básicos (Button, Card)
│   │   ├── forms/           # Componentes de formulário
│   │   └── layout/          # Componentes de layout
│   ├── screens/             # Telas organizadas por domínio
│   │   ├── auth/           # Autenticação e onboarding
│   │   │   ├── OnboardingScreen/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── styles.ts
│   │   │   │   └── OnboardingScreen.spec.tsx
│   │   │   ├── RegisterScreen/
│   │   │   └── AnamneseScreen/
│   │   ├── wellness/       # Bem-estar e saúde
│   │   │   ├── WellnessScreen/
│   │   │   ├── ActivitiesScreen/
│   │   │   ├── ProtocolScreen/
│   │   │   └── HealthProviderScreen/
│   │   ├── marketplace/    # Loja e produtos
│   │   └── community/      # Comunidade e social
│   ├── navigation/         # Configuração de navegação
│   ├── onboarding/        # Componentes específicos do onboarding
│   ├── constants/         # Constantes do app
│   ├── types/             # Tipos TypeScript
│   ├── utils/             # Funções utilitárias
│   └── hooks/             # Custom hooks
├── App.tsx                # Componente principal
├── app.json              # Configuração do Expo
└── package.json          # Dependências
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
- `expo`: SDK do Expo
- `@react-navigation/native`: Navegação
- `@react-navigation/stack`: Stack navigator
- `@react-navigation/bottom-tabs`: Tab navigator
- `react-native-paper`: Componentes UI
- `react-native-vector-icons`: Ícones
- `expo-linear-gradient`: Gradientes
- `expo-constants`: Constantes do Expo
- `expo-file-system`: Sistema de arquivos

### Scripts Disponíveis
```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa no navegador
npm test           # Executa os testes
npm run lint       # Executa o linter
```

### Configurações
- **Expo**: Configuração completa do Expo SDK 52
- **Metro**: Configurado para Expo
- **Babel**: Preset para Expo
- **TypeScript**: Configuração para Expo

## 🛠 Desenvolvimento

### Comandos Úteis do Expo
```bash
# Verificar status do projeto
npx expo doctor

# Limpar cache
npx expo start --clear

# Executar com tunnel (para testar em dispositivos remotos)
npx expo start --tunnel

# Publicar atualização OTA
npx expo publish

# Ver logs do dispositivo
npx expo logs
```

### Debugging
```bash
# Abrir DevTools
npx expo start --dev-client

# Debug remoto
npx expo start --dev-client --debug
```

### Build e Deploy
```bash
# Build de desenvolvimento
eas build --profile development

# Build de produção
eas build --profile production

# Submit para stores
eas submit --platform android
eas submit --platform ios
```

## 🚀 Próximos Passos

1. **Integração com Backend**: APIs para dados reais
2. **Autenticação**: Sistema de login seguro com Expo Auth
3. **Notificações**: Push notifications com Expo Notifications
4. **Offline**: Funcionalidades offline com Expo SQLite
5. **Testes**: Testes unitários e de integração
6. **Deploy**: Configuração para produção com EAS

## 🔧 Troubleshooting

### Problemas Comuns

**Erro de cache:**
```bash
npx expo start --clear
```

**Problemas de dependências:**
```bash
rm -rf node_modules
npm install
```

**Problemas com Metro:**
```bash
npx expo start --reset-cache
```

**Problemas de build:**
```bash
npx expo doctor
eas build --clear-cache
```

### Requisitos do Sistema
- **Node.js**: 18.x ou superior
- **npm**: 8.x ou superior
- **Expo CLI**: Última versão
- **iOS**: Xcode 14+ (para iOS)
- **Android**: Android Studio (para Android)

## 📚 Documentação

Este projeto possui documentação detalhada em vários arquivos:

### 📖 Documentação Principal
- **[README.md](./README.md)** - Este arquivo com visão geral do projeto
- **[src/ARCHITECTURE.md](./src/ARCHITECTURE.md)** - Arquitetura detalhada e princípios do projeto

### 🏗 Documentação de Desenvolvimento
- **[src/screens/TEMPLATE.md](./src/screens/TEMPLATE.md)** - Template para criar novas telas
- **[src/onboarding/README.md](./src/onboarding/README.md)** - Documentação dos componentes de onboarding

### 🔧 Documentação Técnica
- **[.expo/README.md](./.expo/README.md)** - Documentação sobre a pasta .expo (gerada automaticamente)

### 📁 Estrutura de Documentação
```
likeme-front-end/
├── README.md                    # 📖 Visão geral do projeto
├── .expo/
│   └── README.md                # 🔧 Documentação do Expo (auto-gerada)
├── src/
│   ├── ARCHITECTURE.md         # 🏗 Arquitetura e princípios
│   ├── screens/
│   │   └── TEMPLATE.md          # 📝 Template para novas telas
│   └── onboarding/
│       └── README.md            # 🚀 Documentação do onboarding
```

### 🎯 Como Usar a Documentação

1. **Para entender o projeto**: Comece pelo [README.md](./README.md)
2. **Para entender a arquitetura**: Leia [src/ARCHITECTURE.md](./src/ARCHITECTURE.md)
3. **Para criar novas telas**: Use [src/screens/TEMPLATE.md](./src/screens/TEMPLATE.md)
4. **Para trabalhar com onboarding**: Consulte [src/onboarding/README.md](./src/onboarding/README.md)
5. **Para entender o Expo**: Veja [.expo/README.md](./.expo/README.md) (informações técnicas)

### 📝 Contribuindo com Documentação

Ao adicionar novas funcionalidades, lembre-se de:
- Atualizar a documentação correspondente
- Seguir os templates estabelecidos
- Manter a consistência com a arquitetura documentada
- Adicionar exemplos práticos quando necessário

## 📄 Licença

Este projeto está sob a licença MIT.