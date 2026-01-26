# 🌐 Sistema de Traduções (i18n)

Este projeto utiliza `react-i18next` para gerenciar traduções e internacionalização.

## 📁 Estrutura

```
src/i18n/
├── index.ts              # Configuração do i18n
├── locales/
│   └── pt-BR.json        # Traduções em português brasileiro
└── README.md             # Esta documentação
```

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

  return (
    <Text>{t('common.save')}</Text>
  );
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

## 🔧 Adicionar Novas Traduções

1. Abra `src/i18n/locales/pt-BR.json`
2. Adicione a chave no namespace apropriado
3. Use a chave no código com `t('namespace.key')`

### Exemplo:

```json
{
  "common": {
    "newButton": "Novo Botão"
  }
}
```

```typescript
<Text>{t('common.newButton')}</Text>
```

## 🌍 Adicionar Novos Idiomas

1. Crie um novo arquivo em `src/i18n/locales/` (ex: `en-US.json`)
2. Copie a estrutura do `pt-BR.json`
3. Traduza os valores
4. Adicione o idioma em `src/i18n/index.ts`:

```typescript
import enUS from './locales/en-US.json';

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

