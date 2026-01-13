# 📦 Guia Completo: Bundle ID (ID de Pacote)

## O que é Bundle ID?

O **Bundle ID** (ou **Bundle Identifier**) é um identificador único e reverso do seu app iOS. Ele funciona como um "endereço" único para seu aplicativo na App Store e no sistema iOS.

**Formato**: `com.empresa.app` (formato reverso de domínio)

**Exemplo atual do projeto**: `com.likeme.app`

## 📋 Configuração Atual do Projeto

Seu projeto já está configurado com:
- **Bundle ID**: `com.likeme.app`
- **Android Package**: `com.likeme.app`

Arquivos onde está configurado:
- `app.json` → `ios.bundleIdentifier`
- `app.config.js` → `ios.bundleIdentifier`

## 🔧 Passo 1: Registrar Bundle ID no Apple Developer

### Opção A: Registrar via Apple Developer Portal (Recomendado)

1. **Acesse o Apple Developer Portal**
   - URL: https://developer.apple.com/account/
   - Faça login com sua conta Apple Developer

2. **Navegue até Certificates, Identifiers & Profiles**
   - No menu lateral, clique em **Certificates, Identifiers & Profiles**
   - Ou acesse diretamente: https://developer.apple.com/account/resources/identifiers/list

3. **Criar novo Identifier**
   - Clique no botão **+** (canto superior esquerdo)
   - Selecione **App IDs**
   - Clique em **Continue**

4. **Configurar o App ID**
   - **Description**: `LikeMe App` (nome descritivo)
   - **Bundle ID**: Selecione **Explicit**
   - **Bundle ID**: Digite `com.likeme.app`
   - ⚠️ **IMPORTANTE**: Deve ser EXATAMENTE igual ao configurado no `app.json`

5. **Selecionar Capabilities (Recursos)**
   - Marque os recursos que seu app usa:
     - ✅ **Push Notifications** (se usar notificações)
     - ✅ **Sign in with Apple** (se usar)
     - ✅ **Associated Domains** (se usar deep links)
     - ✅ **App Groups** (se usar compartilhamento de dados)
     - Deixe desmarcado o que não usar

6. **Registrar**
   - Clique em **Continue**
   - Revise as informações
   - Clique em **Register**
   - ✅ Pronto! O Bundle ID está registrado

### Opção B: Registrar via EAS (Automático)

O EAS pode criar o Bundle ID automaticamente durante o primeiro build:

```bash
eas build:configure
```

Quando executar o primeiro build iOS, o EAS perguntará se deseja criar o Bundle ID automaticamente.

## 📱 Passo 2: Criar App no App Store Connect

Após registrar o Bundle ID, você precisa criar o app no App Store Connect:

1. **Acesse App Store Connect**
   - URL: https://appstoreconnect.apple.com/
   - Faça login com sua conta Apple Developer

2. **Criar Novo App**
   - Clique em **Apps** (menu superior)
   - Clique no botão **+** → **New App**

3. **Preencher Informações do App**
   
   **Platform**: 
   - Selecione **iOS**
   
   **Name** (Nome do App):
   - `LikeMe`
   - ⚠️ Este é o nome que aparecerá na App Store (máx. 30 caracteres)
   
   **Primary Language** (Idioma Principal):
   - Selecione: **Portuguese (Brazil)** ou **English**
   
   **Bundle ID**:
   - Clique em **Select** ou **Register a new Bundle ID**
   - Se já registrou: Selecione `com.likeme.app` da lista
   - Se não registrou: Clique em **Register a new Bundle ID** e siga o Passo 1
   
   **SKU** (Stock Keeping Unit):
   - `likeme-ios-001` ou `likeme-ios`
   - ⚠️ Este é um identificador único interno (não aparece para usuários)
   - Use algo único e descritivo
   
   **User Access** (Acesso de Usuários):
   - **Full Access**: Você tem acesso total
   - **App Manager**: Acesso limitado (se for adicionar outros usuários)

4. **Criar App**
   - Clique em **Create**
   - ✅ App criado com sucesso!

5. **Anotar o App ID**
   - Após criar, você verá a página do app
   - Vá em **App Information**
   - Anote o **Apple ID** (exemplo: `1234567890`)
   - ⚠️ Este número será usado no `eas.json` como `ascAppId`

## 🔍 Passo 3: Verificar Configuração no Projeto

### Verificar app.json

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.likeme.app"  // ✅ Deve estar assim
    }
  }
}
```

### Verificar app.config.js

```javascript
ios: {
  bundleIdentifier: 'com.likeme.app',  // ✅ Deve estar assim
  buildNumber: '1',
}
```

## ⚙️ Passo 4: Atualizar eas.json

Após criar o app no App Store Connect, atualize o `eas.json`:

```json
{
  "submit": {
    "staging": {
      "ios": {
        "appleId": "seu-email@exemplo.com",
        "ascAppId": "1234567890",  // ← Apple ID do App Store Connect
        "appleTeamId": "ABC123DEF4"  // ← Team ID do Apple Developer
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
}
```

### Onde encontrar cada valor:

**appleId**: 
- Email da sua conta Apple Developer

**ascAppId** (Apple ID do App Store Connect):
1. App Store Connect → Seu App → **App Information**
2. Copie o **Apple ID** (número, ex: `1234567890`)

**appleTeamId**:
1. https://developer.apple.com/account/
2. Vá em **Membership**
3. Copie o **Team ID** (ex: `ABC123DEF4`)

## 🎯 Estrutura do Bundle ID

### Formato Recomendado

```
com.[empresa].[app]
```

### Exemplos

- ✅ `com.likeme.app` - Correto
- ✅ `com.likeme.app.staging` - Para versão staging
- ✅ `com.likeme.app.production` - Para versão production
- ❌ `likeme.app` - Incorreto (falta `com.`)
- ❌ `com.likeme` - Incorreto (muito genérico)

### Para Múltiplos Apps

Se você tiver múltiplos apps ou ambientes:

- **Produção**: `com.likeme.app`
- **Staging**: `com.likeme.app.staging`
- **Desenvolvimento**: `com.likeme.app.dev`

⚠️ **IMPORTANTE**: Cada Bundle ID precisa ser registrado separadamente no Apple Developer.

## ✅ Checklist

- [ ] Bundle ID definido no projeto (`com.likeme.app`)
- [ ] Bundle ID registrado no Apple Developer Portal
- [ ] App criado no App Store Connect
- [ ] Apple ID do app anotado (para `ascAppId`)
- [ ] Team ID anotado (para `appleTeamId`)
- [ ] `eas.json` atualizado com credenciais
- [ ] Certificados configurados no EAS (`eas credentials`)

## 🔄 Próximos Passos

Após configurar o Bundle ID:

1. **Configurar Certificados**
   ```bash
   eas credentials
   ```

2. **Criar Build**
   ```bash
   eas build --platform ios --profile staging
   ```

3. **Submeter para TestFlight**
   ```bash
   eas submit --platform ios --profile staging --latest
   ```

## ⚠️ Problemas Comuns

### Erro: "Bundle ID already exists"
- **Causa**: O Bundle ID já está registrado por outra conta
- **Solução**: Use um Bundle ID diferente ou verifique se você tem acesso à conta que registrou

### Erro: "Bundle ID not found"
- **Causa**: Bundle ID não foi registrado no Apple Developer
- **Solução**: Registre o Bundle ID seguindo o Passo 1

### Erro: "Bundle ID mismatch"
- **Causa**: Bundle ID no projeto não corresponde ao registrado
- **Solução**: Verifique se `app.json` e `app.config.js` têm o mesmo Bundle ID

### Erro: "Invalid Bundle ID format"
- **Causa**: Formato incorreto (ex: sem `com.`)
- **Solução**: Use formato `com.empresa.app`

## 📚 Recursos

- [Apple Developer - Register an App ID](https://developer.apple.com/documentation/appstoreconnectapi/registering-an-app)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Bundle ID Best Practices](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleidentifier)

