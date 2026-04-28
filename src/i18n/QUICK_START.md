# 🚀 Quick Start - Sistema de Traduções

## ✅ O que foi criado

1. **Estrutura de pastas**:

   - `src/i18n/` - Configuração do i18n e hidratação via API (`hydration.ts`)
   - `src/hooks/i18n/` - Hook customizado para usar traduções

2. **Arquivos de configuração**:

   - `src/i18n/index.ts` - Configuração do react-i18next
   - `App.tsx` - Já inicializa o i18n automaticamente

3. **Documentação**:
   - `README.md` - Documentação completa
   - `INSTALLATION.md` - Guia de instalação
   - `EXAMPLES.md` - Exemplos práticos de uso
   - `QUICK_START.md` - Este arquivo

## 📦 Passo 1: Instalar Dependências

```bash
cd likeme-front-end
npm install i18next react-i18next
```

## 🎯 Passo 2: Usar no Código

```typescript
import { useTranslation } from '@/hooks/i18n';

const MyComponent = () => {
  const { t } = useTranslation();

  return <Text>{t('common.save')}</Text>;
};
```

## 📝 Passo 3: Migrar Textos Existentes

Substitua textos hardcoded por chaves de tradução:

```typescript
// ❌ Antes
<Text>Salvar</Text>;

// ✅ Depois
const { t } = useTranslation();
<Text>{t('common.save')}</Text>;
```

## 🔍 Estrutura das Chaves

- `common.*` - Textos comuns (botões, ações)
- `auth.*` - Autenticação
- `anamnesis.*` - Anamnese
- `home.*` - Tela inicial
- `marketplace.*` - Marketplace
- `cart.*` - Carrinho
- `activities.*` - Atividades
- `community.*` - Comunidade
- `errors.*` - Erros
- `validation.*` - Validações

## 📚 Próximos Passos

1. Leia `README.md` para documentação completa
2. Veja `EXAMPLES.md` para exemplos práticos
3. Comece a migrar textos existentes gradualmente

## ⚠️ Importante

- O i18n já está inicializado no `App.tsx`
- Traduções vêm do backend (`/api/i18n/labels`) e cache local; fallback mínimo em `index.ts`
- Use sempre o hook `useTranslation` para acessar traduções
