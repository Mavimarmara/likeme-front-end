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

## 🔄 Envio para lojas (Submit) com aprovação

A pipeline tem um **step de aprovação** antes dos submits: o job **"Aprovar envio para lojas"** (`approve`). Ele só roda depois que os builds de Android e iOS terminam e fica em **"Waiting for approval"** até alguém aprovar. Só depois disso os jobs de submit (Play Store e TestFlight) são executados.

### Configurar o step de approve

1. No repositório GitHub, vá em **Settings** → **Environments**
2. Clique em **New environment**
3. Nome: `store-submit`
4. Marque **Required reviewers** e adicione as pessoas que podem aprovar o envio
5. Salve

**Aprovação:** só o job **Aprovar envio para lojas** usa `store-submit` (uma aprovação). Build Android/iOS rodam depois, **sem** novo approve.

**Secrets Android:** no **repositório** (Actions → Secrets). O environment `store-submit` não é usado no build Android (evita segunda aprovação).

| Secret | Obrigatório | Notas |
|--------|-------------|--------|
| `ANDROID_KEYSTORE_BASE64` | Sim | Keystore em base64 (uma linha) |
| `ANDROID_KEYSTORE_STORE_PASSWORD` | Sim | Senha do keystore (EAS) |
| `ANDROID_KEYSTORE_KEY_PASSWORD` | Sim | Senha da chave (EAS; pode diferir da store) |
| `ANDROID_KEYSTORE_KEY_ALIAS` | Sim | Alias UUID da EAS (ex. `95c2a3e1...`) |

iOS e submit continuam com secrets do **repositório** (sem environment extra).

- **Submit Android**: usa `GOOGLE_SERVICE_ACCOUNT_JSON` (secret)
- **Submit iOS / assinatura Xcode**: `ASC_API_KEY_P8` (conteúdo do `.p8`); opcional `ASC_API_KEY_ID` (ex. `74BTTLL273`), `ASC_API_ISSUER_ID` (UUID em Integrations)
