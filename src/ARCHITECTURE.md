# Arquitetura do Projeto LikeMe

## 📁 Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes básicos (Button, Card, Input)
│   ├── forms/           # Componentes de formulário
│   ├── layout/          # Componentes de layout
│   └── index.ts         # Exportações centralizadas
├── screens/             # Telas organizadas por domínio
│   ├── auth/           # Autenticação e onboarding
│   │   ├── UnauthenticatedScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── UnauthenticatedScreen.spec.tsx
│   │   ├── RegisterScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── RegisterScreen.spec.tsx
│   │   ├── AnamneseScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── AnamneseScreen.spec.tsx
│   │   └── index.ts
│   ├── wellness/       # Bem-estar e saúde
│   │   ├── WellnessScreen/
│   │   │   ├── index.tsx
│   │   │   ├── styles.ts
│   │   │   └── WellnessScreen.spec.tsx
│   │   ├── ActivitiesScreen/
│   │   ├── ProtocolScreen/
│   │   ├── HealthProviderScreen/
│   │   └── index.ts
│   ├── marketplace/    # Loja e produtos
│   │   ├── MarketplaceScreen/
│   │   └── index.ts
│   ├── community/      # Comunidade e social
│   │   ├── CommunityScreen/
│   │   └── index.ts
│   ├── index.ts        # Exportações de todas as telas
│   └── TEMPLATE.md     # Template para novas telas
├── navigation/         # Configuração de navegação
│   └── MainTabNavigator.tsx
├── onboarding/        # Componentes específicos do onboarding
│   ├── components/
│   │   └── UnauthenticatedStep1.tsx
│   ├── index.ts
│   └── README.md
├── hooks/              # Custom hooks (futuro)
├── utils/              # Funções utilitárias
│   └── index.ts
├── constants/          # Constantes do app
│   └── index.ts
├── types/              # Tipos TypeScript
│   └── index.ts
└── services/           # APIs e serviços (futuro)
```

## 🎯 Princípios da Arquitetura

### 1. **Separação por Domínio**
- Telas agrupadas por funcionalidade (auth, wellness, marketplace, community)
- Facilita manutenção e escalabilidade
- Reduz acoplamento entre módulos

### 2. **Coesão de Arquivos**
- Cada tela tem sua própria pasta com arquivos relacionados
- `index.tsx`, `styles.ts` e `[ScreenName].spec.tsx` ficam juntos
- Facilita localização e manutenção de código relacionado

### 3. **Componentização**
- Componentes reutilizáveis em `components/ui/`
- Separação clara entre UI e lógica de negócio
- Facilita testes e manutenção

### 4. **Tipagem Forte**
- Todos os tipos centralizados em `types/`
- Interfaces bem definidas para cada entidade
- Melhora IntelliSense e detecção de erros

### 5. **Constantes Centralizadas**
- Cores, espaçamentos, fontes em `constants/`
- Facilita manutenção do design system
- Consistência visual em todo o app

### 6. **Utilitários Organizados**
- Funções helper em `utils/`
- Validações, formatações, cálculos
- Código reutilizável e testável

### 7. **Testabilidade**
- Testes próximos ao código que testam
- Estrutura consistente para todos os testes
- Facilita manutenção e execução de testes

## 🔧 Como Usar

### Importando Telas
```typescript
// Import específico
import { WellnessScreen } from '@/screens/wellness';

// Import múltiplo
import { WellnessScreen, ActivitiesScreen } from '@/screens/wellness';

// Import de todas as telas
import * as Screens from '@/screens';
```

### Importando Componentes
```typescript
// Componentes UI
import { Button, Card } from '@/components/ui';

// Todos os componentes
import * as Components from '@/components';
```

### Importando Utilitários
```typescript
import { dateUtils, validationUtils } from '@/utils';
import { COLORS, SPACING } from '@/constants';
import { User, Activity } from '@/types';
```

## 🚀 Benefícios

1. **Manutenibilidade**: Código organizado e fácil de encontrar
2. **Escalabilidade**: Estrutura preparada para crescimento
3. **Reutilização**: Componentes e utilitários compartilhados
4. **Consistência**: Padrões estabelecidos e documentados
5. **Testabilidade**: Componentes isolados e bem tipados
6. **Colaboração**: Estrutura clara para equipe

## 📈 Próximos Passos

1. **Custom Hooks**: Adicionar hooks personalizados em `hooks/`
2. **Services**: Implementar camada de API em `services/`
3. **Context**: Adicionar contextos para estado global
4. **Testing**: Estrutura para testes unitários e de integração
5. **Storybook**: Documentação interativa dos componentes
