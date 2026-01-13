# 🚀 Configuração do TestFlight

Este guia explica como configurar e publicar o app LikeMe no TestFlight.

## 📋 Pré-requisitos

1. **Conta Apple Developer** (paga - $99/ano)
2. **App criado no App Store Connect**
3. **EAS CLI instalado e configurado**

## 🔧 Passo 1: Registrar Bundle ID no Apple Developer

⚠️ **IMPORTANTE**: Antes de criar o app no App Store Connect, você precisa registrar o Bundle ID.

### Registrar Bundle ID

1. Acesse [Apple Developer Portal](https://developer.apple.com/account/)
2. Vá em **Certificates, Identifiers & Profiles**
3. Clique em **Identifiers** → **+** (criar novo)
4. Selecione **App IDs** → **Continue**
5. Preencha:
   - **Description**: `LikeMe App`
   - **Bundle ID**: Selecione **Explicit**
   - **Bundle ID**: Digite `com.likeme.app` (deve ser EXATAMENTE igual ao `app.json`)
6. Selecione as **Capabilities** necessárias (Push Notifications, etc.)
7. Clique em **Continue** → **Register**

📖 **Guia Completo**: Veja `BUNDLE_ID_SETUP.md` para instruções detalhadas.

## 🔧 Passo 2: Configurar App Store Connect

1. Acesse [App Store Connect](https://appstoreconnect.apple.com/)
2. Vá em **Apps** → **+** → **New App**
3. Preencha:
   - **Platform**: iOS
   - **Name**: LikeMe
   - **Primary Language**: Portuguese (Brazil) ou English
   - **Bundle ID**: Selecione `com.likeme.app` (já registrado no Passo 1)
   - **SKU**: `likeme-ios` (identificador único)
4. Anote o **App ID** (será usado no `eas.json`)

## 🔑 Passo 2: Obter Credenciais

### Apple ID
- Email da conta Apple Developer

### App Store Connect App ID (ASC App ID)
- Encontre em: App Store Connect → Seu App → App Information → **Apple ID**
- Exemplo: `1234567890`

### Apple Team ID
- Encontre em: [Apple Developer](https://developer.apple.com/account/) → Membership → **Team ID**
- Exemplo: `ABC123DEF4`

## ⚙️ Passo 3: Atualizar eas.json

Edite o arquivo `eas.json` e substitua os valores placeholder:

```json
"submit": {
  "staging": {
    "ios": {
      "appleId": "seu-email@exemplo.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABC123DEF4"
    }
  },
  "production": {
    "ios": {
      "appleId": "seu-email@exemplo.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABC123DEF4"
    }
  }
}
```

## 🔐 Passo 4: Configurar Credenciais no EAS

### Opção 1: Usar App-Specific Password (Recomendado)

1. Gere uma senha específica para apps:
   - Acesse [appleid.apple.com](https://appleid.apple.com/)
   - Vá em **Sign-In and Security** → **App-Specific Passwords**
   - Clique em **Generate an app-specific password**
   - Nome: "EAS Build"
   - Copie a senha gerada

2. Configure no EAS:
```bash
eas credentials
```

### Opção 2: Usar Fastlane (Automático)

O EAS pode usar Fastlane automaticamente. Execute:

```bash
eas build:configure
```

E siga as instruções para configurar as credenciais.

## 🏗️ Passo 5: Criar Build para TestFlight

### Build Staging (TestFlight Internal)
```bash
eas build --platform ios --profile staging
```

### Build Production (TestFlight External)
```bash
eas build --platform ios --profile production
```

**Nota**: O build pode levar 15-30 minutos.

## 📤 Passo 6: Submeter para TestFlight

Após o build ser concluído:

### Submeter Automaticamente
```bash
# Para staging (TestFlight Internal)
eas submit --platform ios --profile staging

# Para production (TestFlight External)
eas submit --platform ios --profile production
```

### Submeter Manualmente

1. Acesse [App Store Connect](https://appstoreconnect.apple.com/)
2. Vá em **TestFlight** → **iOS Builds**
3. Clique em **+** e selecione o build
4. Preencha as informações de teste (se necessário)
5. Adicione testadores (Internal ou External)

## 👥 Passo 7: Adicionar Testadores

📖 **Guia Completo**: Veja `TESTFLIGHT_TESTERS.md` para instruções detalhadas.

### TestFlight Internal (Até 100 testadores)
1. App Store Connect → TestFlight → **Internal Testing**
2. Clique em **+** para criar grupo
3. Adicione build ao grupo
4. Adicione emails dos testadores
5. Eles receberão um convite por email automaticamente

### TestFlight External (Até 10.000 testadores)
1. App Store Connect → TestFlight → **External Testing**
2. Clique em **+** para criar grupo
3. Preencha informações de compliance
4. Adicione build ao grupo
5. Adicione testadores
6. Submeta para revisão da Apple
7. Após aprovação (24-48h), testadores receberão convite

## 📱 Passo 8: Testadores Instalarem o App

1. Testadores recebem email de convite
2. Instalam o app **TestFlight** da App Store
3. Abrem o link do convite
4. Instalam o app LikeMe pelo TestFlight

## 🔄 Workflow Recomendado

### Para Testes Internos (Staging)
```bash
# 1. Build
eas build --platform ios --profile staging

# 2. Submit automático
eas submit --platform ios --profile staging --latest

# 3. Adicionar testadores no App Store Connect
```

### Para Testes Externos (Production)
```bash
# 1. Build
eas build --platform ios --profile production

# 2. Submit automático
eas submit --platform ios --profile production --latest

# 3. Configurar grupo de teste externo no App Store Connect
```

## ⚠️ Troubleshooting

### Erro: "No valid iOS Distribution certificate"
```bash
eas credentials
# Selecione iOS → Manage credentials → Setup
```

### Erro: "App Store Connect API Key required"
- Crie uma API Key em App Store Connect → Users and Access → Keys
- Configure no EAS: `eas credentials`

### Build falha
- Verifique logs: `eas build:list`
- Verifique se o Bundle ID está correto
- Verifique se há certificados válidos

### Submit falha
- Verifique se o build foi concluído com sucesso
- Verifique se o app existe no App Store Connect
- Verifique credenciais no `eas.json`

## 📚 Recursos Úteis

- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Documentação EAS Submit](https://docs.expo.dev/submit/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)

## ✅ Checklist

- [ ] Conta Apple Developer ativa
- [ ] App criado no App Store Connect
- [ ] Bundle ID registrado (`com.likeme.app`)
- [ ] `eas.json` configurado com credenciais
- [ ] Credenciais configuradas no EAS
- [ ] Build criado com sucesso
- [ ] Build submetido para TestFlight
- [ ] Testadores adicionados
- [ ] Testadores receberam convites

