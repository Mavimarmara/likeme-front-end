# 🔐 Configurar Keystore usando Variáveis de Ambiente

## ✅ Configuração Atual

O projeto agora suporta usar variáveis de ambiente para as credenciais do keystore, o que é mais seguro do que armazenar no arquivo `keystore.properties`.

## 📝 Como Configurar

### Opção 1: Usar Variáveis de Ambiente (Recomendado)

Adicione as seguintes variáveis ao seu arquivo `.env`:

```bash
# Android Keystore
ANDROID_KEYSTORE_STORE_PASSWORD=sua_senha_aqui
ANDROID_KEYSTORE_KEY_PASSWORD=sua_senha_aqui
ANDROID_KEYSTORE_KEY_ALIAS=likeme-key-alias
ANDROID_KEYSTORE_STORE_FILE=likeme-release.keystore
```

**Exemplo:**

```bash
ANDROID_KEYSTORE_STORE_PASSWORD=H#FDG.634EW83!
ANDROID_KEYSTORE_KEY_PASSWORD=H#FDG.634EW83!
ANDROID_KEYSTORE_KEY_ALIAS=likeme-key-alias
ANDROID_KEYSTORE_STORE_FILE=likeme-release.keystore
```

### Opção 2: Usar arquivo keystore.properties (Fallback)

Se você não quiser usar variáveis de ambiente, pode continuar usando o arquivo `android/keystore.properties`:

```properties
storePassword=sua_senha_aqui
keyPassword=sua_senha_aqui
keyAlias=likeme-key-alias
storeFile=likeme-release.keystore
```

## 🔄 Prioridade

O sistema usa a seguinte prioridade:

1. **Variáveis de ambiente** (se estiverem definidas)
2. **Arquivo keystore.properties** (se existir)
3. **Keystore de debug** (fallback - não adequado para produção)

## ✅ Vantagens de Usar Variáveis de Ambiente

- ✅ Mais seguro - não precisa ter o arquivo `keystore.properties` no repositório
- ✅ Pode usar diferentes senhas para diferentes ambientes (staging, production)
- ✅ Mais fácil de gerenciar em CI/CD
- ✅ Não precisa se preocupar com o arquivo sendo commitado por engano

## 🔒 Segurança

**IMPORTANTE:**

- ⚠️ NÃO commite o arquivo `.env` com as senhas reais
- ⚠️ Adicione `.env` ao `.gitignore` (já está adicionado)
- ⚠️ Use um arquivo `.env.example` para documentar as variáveis necessárias (sem as senhas reais)

## 📋 Checklist

- [ ] Variáveis de keystore adicionadas ao `.env`
- [ ] Arquivo `.env` está no `.gitignore`
- [ ] Keystore criado em `android/app/likeme-release.keystore`
- [ ] Teste o build para verificar se está funcionando

## 🧪 Testar

Após configurar, teste o build:

```bash
npm run build:android:production
```

O build deve usar as credenciais do `.env` automaticamente.
