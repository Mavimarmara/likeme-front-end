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

3. Fluxo de desenvolvimento, testes, builds e limpezas: use os **scripts** definidos em `package.json` na raiz do projeto (nomes e descrições mantêm-se aí).

## 📱 Executando no dispositivo

O projeto usa **Expo dev client** e módulos nativos; **Expo Go** costuma não cobrir tudo. Para iPhone em desenvolvimento, use o fluxo que a equipa tiver acordado (Metro + cliente de desenvolvimento ou build nativo via Xcode), alinhado com os scripts em `package.json` e com a documentação oficial do Expo / React Native.

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

### Scripts

Os scripts npm estão definidos em **`package.json`** na raiz do repositório.

### Configurações

- **Expo**: Configuração em `app.config.js` (SDK 54 no `package.json`)
- **Metro**: Configurado para Expo
- **Babel**: Preset para Expo
- **TypeScript**: Configuração para Expo

## 🛠 Desenvolvimento

Para cache, tunnel, dev client e diagnóstico do ambiente Expo, siga a documentação oficial do **Expo CLI** e os scripts em `package.json`.

## 🧪 Testes

O projeto inclui testes unitários e de integração para garantir a qualidade e funcionalidade do código.

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

### Boas Práticas

1. **Nomenclatura**: Use nomes descritivos para os testes
2. **Arrange-Act-Assert**: Estruture os testes em 3 fases
3. **Mocks**: Use mocks para dependências externas
4. **Isolamento**: Cada teste deve ser independente
5. **Cobertura**: Mantenha alta cobertura de código

## 🚀 Próximos Passos

1. **Integração com Backend**: APIs para dados reais
2. **Autenticação**: Sistema de login seguro com Expo Auth
3. **Notificações**: Push notifications com Expo Notifications
4. **Offline**: Funcionalidades offline com Expo SQLite
5. **Testes**: Testes unitários e de integração
6. **Deploy**: Configuração para produção com EAS

## 🔧 Troubleshooting

### Problemas comuns

- **Cache / Metro / dependências**: reinstalar `node_modules`, limpar caches do Metro ou do Expo conforme a documentação oficial.
- **Testes (SVG, navegação)**: usar mocks como nos exemplos em TypeScript mais abaixo nesta página.
- **Build**: validar ambiente com as ferramentas indicadas na documentação do Expo e nos perfis do repositório.

### Requisitos do sistema

- **Node.js**: conforme `engines` em `package.json` (atualmente `>=20.19.4`)
- **npm**: compatível com o Node acima
- **EAS CLI**: quando usar builds ou submissões na infraestrutura Expo (instalação conforme documentação Expo)
- **iOS**: Xcode recente e CocoaPods para a pasta `ios/`
- **Android**: Android Studio / SDK para a pasta `android/`

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
