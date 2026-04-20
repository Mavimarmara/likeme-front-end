# LikeMe Front-End

Um aplicativo React Native completo para saúde e bem-estar, com funcionalidades de onboarding, cadastro, anamnese, wellness, atividades, protocolos, marketplace, comunidade e provedores de saúde.

## 🚀 Funcionalidades

- **Onboarding**: Introdução ao app com slides interativos
- **Cadastro**: Sistema de registro de usuários
- **Anamnese**: Questionário de saúde personalizado
- **Atividades**: Gerenciamento de atividades de saúde
- **Marketplace**: Loja de produtos de saúde
- **Comunidade**: Rede social para compartilhamento

## 📱 Telas Implementadas

### Telas de Onboarding

- OnboardingScreen: Introdução ao app
- RegisterScreen: Cadastro de usuários
- AnamneseScreen: Questionário de saúde

### Telas Principais

- ActivitiesScreen: Gerenciamento de atividades
- MarketplaceScreen: Loja de produtos
- CommunityScreen: Rede social

## 🛠 Tecnologias Utilizadas

- **Expo SDK 54**
- **React Native 0.81.5**
- **React Navigation 6.x**
- **React Native Paper** (UI Components)
- **React Native Vector Icons**
- **Expo Linear Gradient**
- **TypeScript**
- **EAS Build** (Builds nativos)
- **Auth0** (Autenticação)

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
# Abrir o simulador (caso ainda não esteja em execução)
open -a Simulator

npm run ios
# ou
yarn ios
# ou
npx expo start --reset-cache --clear --ios
# ou
npx expo start --reset-cache --clear --ios --tunnel
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

## Comandos principais

Resumo dos scripts em `package.json` e **quando usar**. Comandos são executados na raiz de `likeme-front-end`, salvo indicação em contrário.

### Desenvolvimento (Metro + JS)

| Comando | Quando usar |
|--------|-------------|
| `npm run start` | Abre o Simulator iOS e sobe o Expo com **tunnel** (fluxo habitual no Mac com iOS). |
| `npm run start:dev` | Metro com **dev client**, sem tunnel. |
| `npm run start:dev:tunnel` | Metro + dev client + **tunnel** (útil quando iPhone/Android não alcançam o Mac na LAN ou há firewall/VPN). |
| `npm run start:clear` / `npm run start:reset` | Problemas de cache do Metro/Expo. |
| `npm run start:staging` / `npm run start:production` | Subir o bundler com variáveis de `.env.staging` / `.env.production` (`env-cmd`). |
| `npm run start:local` | Copia `.env.local` → `.env` e sobe com tunnel (**sobrescreve** `.env` na raiz). |

**iPhone com build de desenvolvimento (dev client):** o binário Debug espera o **Metro**. Deixe `npm run start:dev` ou `npm run start:dev:tunnel` a correr e, noutro terminal, use `npm run build:ios:device`, ou abra o app instalado e ligue ao servidor mostrado no terminal. Sem Metro, aparece a UI de “development servers”, não o fluxo completo da app.

**Teste no físico sem depender do Metro** (bundle `main.jsbundle` embutido; não deve ficar preso ao ecrã de servidores de dev):

```bash
npm run ios:run:device:release
```

Configuração Xcode **`Release`** é a que o projeto no repositório define por omissão para builds “sem Metro”.

Se usarem uma configuração **`Production`** criada à mão no Xcode (`npm run ios:run:device:production`), ela tem de **copiar as flags de `Release`**, não as de `Debug`. Se `Production` ainda tiver `DEBUG` (por exemplo `SWIFT_ACTIVE_COMPILATION_CONDITIONS` com `DEBUG` ou definições herdadas de Debug), o `AppDelegate` continua a pedir o Metro → no telemóvel vê-se **tela branca** e no terminal do `expo` só aparece *“Logs for your project will appear below”* (Metro à espera de ligação que o dispositivo não consegue usar como no simulador).

**Como confirmar no Xcode:** Project → Info → Configurations → linha **Production** → `Based on Release` (ou duplicar a partir de **Release**) e, no target LikeMe, comparar **Build Settings** de `Production` com `Release` (especialmente *Swift Compiler - Custom Flags* e *Preprocessor Macros*).

**Release e mesmo assim tela branca + Metro “Logs below”:** o `expo run:ios` **arranca o Metro por defeito**; em **Release** o binário deve carregar o **`main.jsbundle`** dentro do `.app` (o script “Bundle React Native code and images” corre na build). A mensagem do Metro **não prova** que o iPhone esteja ligado ao bundler.

1. Use **`npm run ios:run:device:release:no-bundler`** (`--no-bundler`) para instalar/compilar **sem** subir o Metro — elimina ruído e confirma que estão a testar o fluxo “só nativo + bundle embutido”.
2. No **Xcode** (iPhone ligado): **Window → Devices and Simulators** → abrir **Console** e filtrar por `LikeMe`, `JavaScriptCore`, `RCTFatal`, `Unhandled` — erros de JS em Release aparecem muitas vezes aí, não no terminal do Metro.
3. Confirme que o `.app` instalado contém **`main.jsbundle`** (no Mac, após build: `DerivedData/.../Release-iphoneos/LikeMe.app/main.jsbundle`). Se faltar, o passo “Bundle React Native code and images” falhou (ver relatório de build no Xcode).

### Run nativo (Expo / Xcode)

| Comando | Quando usar |
|--------|-------------|
| `npm run ios` | `expo run:ios` — compila e corre iOS (simulador ou dispositivo conforme o Expo pedir). |
| `npm run build:ios:simulator` | Atalho para `expo run:ios` (fluxo típico simulador). |
| `npm run build:ios:device` | Instala no **iPhone** em **Debug** com **dev client** (combinar com Metro, ver acima). |
| `npm run ios:run:device:release` | `expo run:ios` no **dispositivo** com **Release** (bundle embutido; uso recomendado no repo). |
| `npm run ios:run:device:release:no-bundler` | Igual, mas **sem** iniciar o Metro (`--no-bundler`); útil quando a tela branca não está ligada ao bundler. |
| `npm run ios:run:device:production` | Igual, mas com configuração **Production** (só se existir no Xcode e for equivalente a **Release**; ver nota acima sobre tela branca). |
| `npm run android` | `expo run:android`. |
| `npm run ios:xcode:clean-build` | Só **valida** compilação nativa: `xcodebuild` **clean + build** para **simulador** Debug. Não instala no telemóvel nem substitui EAS. Requer `ios/` com `pod install` já feito. |

### Qualidade (local / CI)

| Comando | Quando usar |
|--------|-------------|
| `npm run build` | `tsc --noEmit` + ESLint. |
| `npm run lint` / `npm run lint:fix` | ESLint. |
| `npm run format:check` / `npm run format` | Prettier. |
| `npm test` / `npm run test:coverage` / `npm run test:watch` | Jest. |

### EAS (nuvem / lojas)

| Comando | Quando usar |
|--------|-------------|
| `npm run build:ios` / `npm run build:android` / `npm run build:all` | Build na infraestrutura EAS. |
| `npm run build:ios:production-internal` / `npm run build:ios:preview` | Perfis definidos em `eas.json`. |
| `npm run submit:android` / `npm run submit:ios` | Submeter o último artefato (ou fluxo definido no script) às lojas. |

### Limpeza e diagnóstico

| Comando | Quando usar |
|--------|-------------|
| `npm run clean` | Remove caches comuns (Metro, `.expo`, builds locais). |
| `npm run clean:ios` | Remove e reinstala **Pods** (mais lento). |
| `npm run clean:all` | Limpeza mais agressiva (inclui `Pods` e `Podfile.lock` em `ios/`). |
| `npm run doctor` | `expo-doctor` quando o ambiente Expo estiver suspeito. |
| `npm run prebuild` / `npm run prebuild:clean` | Regenerar `ios/` e `android/` a partir de `app.config.js`. |

### E2E (Maestro)

Os scripts `test:e2e*` e `export:screenshots*` assumem o CLI do Maestro no PATH (no projeto há referência a `~/.maestro/bin/maestro`). Use quando quiser regressão UI em simulador/dispositivo com flows em `maestro/`.

## 📱 Executando no Dispositivo

Este projeto usa **Expo dev client** e módulos nativos (Auth0, Firebase, etc.). **Expo Go** costuma **não** ser suficiente para tudo; o fluxo recomendado é **dev client** + Metro ou **EAS build** para instalação sem Metro.

### Expo Go (limitado)

1. Instale o **Expo Go** no dispositivo.
2. `npx expo start` (sem garantir compatibilidade com todas as APIs nativas do repo).

### Dev client + dispositivo físico

1. `npm run start:dev` ou `npm run start:dev:tunnel`.
2. `npm run build:ios:device` (ou `npx expo run:ios --device`) e escolher o iPhone quando pedido.

### Usando EAS Build (Para produção)

#### Configuração Inicial

```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Login no Expo
eas login

# Configurar build
eas build:configure
```

#### Criar Builds

```bash
# Build para Android
npm run build:android
# ou
eas build --platform android

# Build para iOS
npm run build:ios
# ou
eas build --platform ios

# Build para ambas as plataformas
npm run build:all
# ou
eas build --platform all
```

#### Submeter para Lojas

```bash
# Android (Google Play)
npm run submit:android
# ou
eas submit --platform android

# iOS (TestFlight)
npm run submit:ios
# ou
eas submit --platform ios
```

#### Verificar Informações do Projeto

```bash
# Ver informações do projeto
eas project:info

# Ver builds
eas build:list

# Ver status de submissões
eas submit:list
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
│   │   │   └── ActivitiesScreen/
│   │   ├── marketplace/    # Loja e produtos
│   │   └── community/      # Comunidade e social
│   ├── navigation/         # Configuração de navegação
│   ├── onboarding/        # Componentes específicos do onboarding
│   ├── constants/         # Constantes do app
│   ├── types/             # Tipos TypeScript
│   ├── utils/             # Funções utilitárias
│   └── hooks/             # Custom hooks
├── App.tsx                # Componente principal
├── app.config.js         # Configuração do Expo (única fonte; variáveis EXPO_PUBLIC_*)
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

Lista completa e contexto de uso: ver secção **[Comandos principais](#comandos-principais)**.

### Configurações

- **Expo**: Configuração em `app.config.js` (SDK 54 no `package.json`)
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

## 🧪 Testes

O projeto inclui testes unitários e de integração para garantir a qualidade e funcionalidade do código.

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm test -- --watch

# Executar testes de um arquivo específico
npm test -- --testPathPattern=UnauthenticatedScreen

# Executar testes com cobertura
npm test -- --coverage

# Executar testes em modo silencioso
npm test -- --silent
```

### Estrutura dos Testes

```
src/
├── screens/
│   └── auth/
│       └── UnauthenticatedScreen/
│           ├── index.tsx
│           └── index.spec.tsx          # Testes da tela
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Button.spec.tsx             # Testes do componente
└── __tests__/                          # Testes globais
    ├── setup.ts                        # Configuração dos testes
    └── utils.test.ts                   # Testes de utilitários
```

### Tipos de Testes Implementados

#### 1. Testes de Componentes

- **Renderização**: Verifica se componentes renderizam corretamente
- **Interações**: Testa cliques, navegação e eventos
- **Props**: Valida comportamento com diferentes props

#### 2. Testes de Navegação

- **Navegação entre telas**: Verifica se a navegação funciona
- **Parâmetros de rota**: Testa passagem de dados entre telas
- **Stack Navigator**: Valida configuração do navegador

#### 3. Testes de Funcionalidades

- **Formulários**: Validação de inputs e submissão
- **Estado**: Gerenciamento de estado dos componentes
- **Hooks**: Testa custom hooks e hooks do React

### Exemplo de Teste

```typescript
// UnauthenticatedScreen/index.spec.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UnauthenticatedScreen from './index';

// Mock da navegação
const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('UnauthenticatedScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<UnauthenticatedScreen />);

    expect(getByText('LIKE YOUR LIFE')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('handles next button press', () => {
    const { getByText } = render(<UnauthenticatedScreen />);

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Welcome');
  });
});
```

### Configuração dos Testes

O projeto usa:

- **Jest**: Framework de testes
- **React Native Testing Library**: Utilitários para testar componentes React Native
- **React Test Renderer**: Renderização de componentes para testes

### Mocks e Stubs

```typescript
// Mock de navegação
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

// Mock de assets SVG
jest.mock('@/assets', () => ({
  Logo: 'Logo',
}));

// Mock de componentes externos
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
}));
```

### Cobertura de Testes

Para verificar a cobertura de testes:

```bash
# Gerar relatório de cobertura
npm test -- --coverage

# Ver cobertura no navegador
npm test -- --coverage --coverageReporters=html
```

### Boas Práticas

1. **Nomenclatura**: Use nomes descritivos para os testes
2. **Arrange-Act-Assert**: Estruture os testes em 3 fases
3. **Mocks**: Use mocks para dependências externas
4. **Isolamento**: Cada teste deve ser independente
5. **Cobertura**: Mantenha alta cobertura de código

### Troubleshooting

**Problema**: Testes falhando com erro de SVG

```bash
# Solução: Adicionar mock para SVG
jest.mock('@/assets', () => ({
  Logo: 'Logo',
}));
```

**Problema**: Erro de navegação nos testes

```bash
# Solução: Mock do useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));
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

- **Node.js**: conforme `engines` em `package.json` (atualmente `>=20.19.4`)
- **npm**: compatível com o Node acima
- **EAS CLI**: para builds/submits na nuvem (`npm i -g eas-cli` ou `npx eas`)
- **iOS**: Xcode recente + CocoaPods (`pod`) para pastas `ios/` nativas
- **Android**: Android Studio / SDK para `expo run:android` e builds locais

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
