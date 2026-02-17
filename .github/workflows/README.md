# CI/CD - Builds Automáticos

Este diretório contém os workflows do GitHub Actions que fazem builds automáticos de iOS e Android quando há push na branch `main`.

## 📋 Configuração Necessária

### 1. Criar EXPO_TOKEN no GitHub Secrets

O workflow precisa de um token do Expo para fazer builds via EAS.

**Como obter o token:**

1. Acesse [expo.dev](https://expo.dev)
2. Vá em **Account Settings** → **Access Tokens**
3. Clique em **Create Token**
4. Dê um nome (ex: "GitHub Actions CI/CD")
5. Copie o token gerado

**Como adicionar no GitHub:**

1. No repositório GitHub, vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **New repository secret**
3. Nome: `EXPO_TOKEN`
4. Valor: cole o token do Expo
5. Clique em **Add secret**

## 🚀 O que o workflow faz

Quando há push na branch `main`:

1. **Test & Lint** (job `test`)

   - Roda o linter (`npm run lint`)
   - Executa os testes (`npm test`)

2. **Build Android** (job `build-android`)

   - Gera APK de produção via EAS Build
   - Perfil: `production-apk`
   - Backend: produção (`https://likeme-back-end-one.vercel.app`)

3. **Build iOS** (job `build-ios`)
   - Gera build iOS de produção via EAS Build
   - Perfil: `production`
   - Backend: produção (`https://likeme-back-end-one.vercel.app`)

## 📦 Resultados

Os builds ficam disponíveis em:

- [expo.dev](https://expo.dev/accounts/pixelpulselab/projects/likeme-front-end/builds)
- Você receberá notificação por email quando os builds concluírem

## 🔄 Envio Automático (Opcional)

Para enviar automaticamente para TestFlight/Google Play após o build, você pode adicionar jobs de submit no workflow. Isso requer credenciais adicionais (Apple ID, Google Service Account JSON).

Por enquanto, os builds são gerados mas não enviados automaticamente. Use:

- `./submit-to-testflight.sh` para iOS
- `eas submit --platform android --latest --profile production` para Android
