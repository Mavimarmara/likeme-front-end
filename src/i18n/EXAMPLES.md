# 📚 Exemplos de Uso das Traduções

## Exemplos Básicos

### 1. Texto Simples

```typescript
import { useTranslation } from '@/hooks/i18n';
import { Text } from 'react-native';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <Text>{t('common.save')}</Text>;
};
```

### 2. Com Interpolação

```typescript
const { t } = useTranslation();
const userName = 'João';

<Text>{t('auth.introGreeting', { userName })}</Text>
// Resultado: "Oi, João!"
```

### 3. Em Botões

```typescript
import { PrimaryButton } from '@/components/ui/buttons';
import { useTranslation } from '@/hooks/i18n';

const MyScreen = () => {
  const { t } = useTranslation();
  
  return (
    <PrimaryButton
      label={t('common.save')}
      onPress={handleSave}
    />
  );
};
```

### 4. Em Placeholders

```typescript
import { TextInput } from 'react-native';
import { useTranslation } from '@/hooks/i18n';

const MyForm = () => {
  const { t } = useTranslation();
  
  return (
    <TextInput
      placeholder={t('auth.yourNamePlaceholder')}
    />
  );
};
```

### 5. Mensagens de Erro

```typescript
import { Alert } from 'react-native';
import { useTranslation } from '@/hooks/i18n';

const showError = () => {
  const { t } = useTranslation();
  
  Alert.alert(
    t('errors.error'),
    t('errors.loadProductError')
  );
};
```

### 6. Com Pluralização

```typescript
const { t } = useTranslation();
const unansweredCount = 5;

<Text>
  {t('anamnesis.unansweredQuestionsMessage', { count: unansweredCount })}
</Text>
// Resultado: "Você ainda não respondeu 5 pergunta(s). Deseja finalizar mesmo assim?"
```

### 7. Em Títulos de Telas

```typescript
import { Header } from '@/components/ui/layout';
import { useTranslation } from '@/hooks/i18n';

const AnamnesisScreen = () => {
  const { t } = useTranslation();
  
  return (
    <Header
      title={t('anamnesis.homeTitle')}
    />
  );
};
```

### 8. Em Cards e Descrições

```typescript
import { CTACard } from '@/components/ui/cards';
import { useTranslation } from '@/hooks/i18n';

const PromptCard = () => {
  const { t } = useTranslation();
  
  return (
    <CTACard
      title={t('anamnesis.promptCardTitle')}
      description={t('anamnesis.promptCardDescription')}
      primaryButtonLabel={t('anamnesis.startAnamnesis')}
    />
  );
};
```

### 9. Em Listas e Menus

```typescript
const menuItems = [
  { id: 'home', label: t('home.summary') },
  { id: 'activities', label: t('home.activities') },
  { id: 'marketplace', label: t('home.marketplace') },
  { id: 'community', label: t('home.community') },
  { id: 'profile', label: t('home.profile') },
];
```

### 10. Em Validações

```typescript
import { useTranslation } from '@/hooks/i18n';

const validateForm = (values: FormValues) => {
  const { t } = useTranslation();
  const errors: Record<string, string> = {};
  
  if (!values.email) {
    errors.email = t('validation.requiredField');
  }
  
  if (!values.name) {
    errors.name = t('auth.fillFullName');
  }
  
  return errors;
};
```

## Migração de Código Existente

### Antes:
```typescript
<Text>Salvar</Text>
<Button label="Cancelar" />
<TextInput placeholder="Seu nome" />
```

### Depois:
```typescript
const { t } = useTranslation();

<Text>{t('common.save')}</Text>
<Button label={t('common.cancel')} />
<TextInput placeholder={t('auth.yourNamePlaceholder')} />
```

## Dicas

1. **Sempre use o hook no topo do componente**
2. **Organize as chaves por contexto** (common, auth, anamnesis, etc.)
3. **Use TypeScript para autocompletar** (se configurado)
4. **Mantenha consistência** nas chaves usadas

