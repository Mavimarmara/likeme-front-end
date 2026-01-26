# 📦 Instalação do Sistema de Traduções

## 1. Instalar Dependências

```bash
cd likeme-front-end
npm install i18next react-i18next
# ou
yarn add i18next react-i18next
```

## 2. Inicializar o i18n no App

No arquivo principal do app (geralmente `App.tsx` ou `index.js`), importe o i18n:

```typescript
import '@/i18n'; // Isso inicializa o i18n
```

Ou se preferir, importe diretamente:

```typescript
import './src/i18n';
```

## 3. Verificar se está funcionando

Crie um componente de teste:

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from '@/hooks/i18n';

const TestTranslation = () => {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('common.save')}</Text>
      <Text>{t('common.cancel')}</Text>
    </View>
  );
};
```

## 4. Exemplo de Migração

### Antes:
```typescript
<Text>Salvar</Text>
<Button label="Cancelar" />
```

### Depois:
```typescript
const { t } = useTranslation();

<Text>{t('common.save')}</Text>
<Button label={t('common.cancel')} />
```

## ✅ Checklist

- [ ] Dependências instaladas
- [ ] i18n inicializado no App
- [ ] Hook `useTranslation` funcionando
- [ ] Primeira tradução testada

