# 🌐 Sistema de Traduções (i18n)

Este projeto utiliza `react-i18next` para gerenciar traduções e internacionalização.

## 📁 Estrutura

```
src/i18n/
├── index.ts              # Configuração do i18n (fallback mínimo + lng)
├── hydration.ts          # Cache + GET /api/i18n/labels
└── README.md             # Esta documentação
```

Textos de UI vêm do backend (`i18n_bundle`), expostos pela API e aplicados em `hydration.ts`. O bootstrap local em `index.ts` mantém só um fallback mínimo (ex.: taglines do loading) até a hidratação.

## 🚀 Como Usar

### 1. Importar o hook

```typescript
import { useTranslation } from '@/hooks/i18n';
```

### 2. Usar em componentes

```typescript
import React from 'react';
import { Text } from 'react-native';
import { useTranslation } from '@/hooks/i18n';

const MyComponent = () => {
  const { t } = useTranslation();

  return <Text>{t('common.save')}</Text>;
};
```

### 3. Interpolação de variáveis

```typescript
const { t } = useTranslation();

// Com variáveis
<Text>{t('auth.introGreeting', { userName: 'João' })}</Text>

// Com pluralização
<Text>{t('anamnesis.unansweredQuestionsMessage', { count: 5 })}</Text>
```

## 📝 Estrutura das Chaves

As chaves seguem a estrutura hierárquica:

- `common.*` - Textos comuns (botões, ações)
- `auth.*` - Autenticação e registro
- `anamnesis.*` - Anamnese
- `home.*` - Tela inicial
- `marketplace.*` - Marketplace
- `cart.*` - Carrinho
- `checkout.*` - Checkout
- `activities.*` - Atividades
- `community.*` - Comunidade
- `profile.*` - Perfil
- `errors.*` - Mensagens de erro
- `validation.*` - Validações

## 🔧 Adicionar ou alterar traduções

1. Cadastre ou atualize chaves no backend (`PUT /api/i18n/labels?lang=pt-BR` ou admin equivalente). O `prisma/seed` não atualiza `i18n_bundle`.
2. Use a chave no código com `t('namespace.key')`.

### Exemplo no app:

```typescript
<Text>{t('common.newButton')}</Text>
```

## 🌍 Novos idiomas

Exige suporte no backend (bundle por `locale`), na API de labels e ajuste de `lng`/hidratação no app quando o produto suportar outro idioma além de `pt-BR`.

```typescript
// Exemplo histórico (não é o fluxo atual): resources estáticos por arquivo JSON
i18n.init({
  resources: {
    'pt-BR': { translation: ptBR },
    'en-US': { translation: enUS },
  },
  // ...
});
```

## ⚠️ Boas Práticas

1. **Sempre use chaves de tradução** - Nunca hardcode textos na UI
2. **Organize por contexto** - Use namespaces apropriados
3. **Mantenha consistência** - Use as mesmas chaves para textos similares
4. **Valide chaves** - Use TypeScript para autocompletar (se configurado)

## 🔍 Encontrar Traduções

Para encontrar onde uma tradução é usada:

```bash
grep -r "common.save" src/
```

## 📚 Documentação Oficial

- [react-i18next](https://react.i18next.com/)
- [i18next](https://www.i18next.com/)
