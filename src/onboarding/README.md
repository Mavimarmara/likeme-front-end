# Onboarding Components

Esta pasta contém os componentes relacionados ao fluxo de onboarding do aplicativo.

## Estrutura

```
src/onboarding/
├── components/
│   └── OnboardingStep1.tsx    # Primeira etapa do onboarding
├── index.ts                    # Exportações dos componentes
└── README.md                   # Esta documentação
```

## Componentes

### OnboardingStep1

Primeira etapa do onboarding que apresenta o aplicativo com:
- Título "LIKE:ME" e subtítulo "LIKE YOUR LIFE"
- Fundo bege com gradientes coloridos
- Botões "Next" e "Login"

**Props:**
- `onNext: () => void` - Callback para o botão Next
- `onLogin: () => void` - Callback para o botão Login

## Como usar

```tsx
import { OnboardingStep1 } from '../onboarding';

<OnboardingStep1 
  onNext={() => console.log('Next pressed')}
  onLogin={() => navigation.navigate('Login')}
/>
```

## Futuras etapas

Esta estrutura permite facilmente adicionar novas etapas do onboarding:
- OnboardingStep2.tsx
- OnboardingStep3.tsx
- etc.
