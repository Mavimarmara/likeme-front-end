# 🚀 Como Gerar Build para TestFlight

Este guia mostra como gerar uma versão do app para distribuição no TestFlight.

## 📋 Pré-requisitos

1. ✅ Conta Apple Developer ativa ($99/ano)
2. ✅ App criado no App Store Connect
3. ✅ EAS CLI instalado (`npm install -g eas-cli`)
4. ✅ Login no EAS (`eas login`)
5. ✅ Xcode instalado (para build local)

## 🎯 Método Recomendado: Build na Nuvem (EAS)

### Passo 1: Abra um terminal

```bash
cd /Users/weber/Projetos/likeme/likeme-front-end
```

### Passo 2: Execute o script

```bash
./build-testflight.sh
```

### Passo 3: Siga as instruções

O script irá:
1. ✅ Verificar se você está logado no EAS
2. ✅ Perguntar qual tipo de build (nuvem ou local)
3. ✅ Incrementar automaticamente o buildNumber
4. ✅ Criar o build com as configurações de staging
5. ✅ Perguntar se deseja submeter automaticamente para TestFlight

### Passo 4: Aguarde o build

- ⏱️ **Tempo estimado**: 15-30 minutos
- 📊 **Acompanhe o progresso**: O terminal mostrará o status em tempo real
- 🔗 **Link do build**: Será exibido quando o build iniciar

## 🔧 Método Alternativo: Comandos Diretos

### Build na Nuvem

```bash
# 1. Fazer login no EAS (se ainda não estiver logado)
eas login

# 2. Criar build
eas build --platform ios --profile staging

# 3. Submeter para TestFlight (após o build concluir)
eas submit --platform ios --profile staging --latest
```

### Build Local (Mais Rápido)

```bash
# 1. Instalar dependências
cd ios
export LANG=en_US.UTF-8
pod install
cd ..

# 2. Criar Archive
cd ios
xcodebuild archive \
  -workspace LikeMe.xcworkspace \
  -scheme LikeMe \
  -configuration Release \
  -archivePath build/LikeMe.xcarchive \
  -allowProvisioningUpdates

# 3. Exportar .ipa
xcodebuild -exportArchive \
  -archivePath build/LikeMe.xcarchive \
  -exportPath build/export \
  -exportOptionsPlist exportOptions.plist \
  -allowProvisioningUpdates

# 4. Submeter para TestFlight
cd ..
eas submit --platform ios --profile staging --path "ios/build/export/LikeMe.ipa"
```

## 📱 Após o Build

### 1. Acessar App Store Connect

1. Vá para: https://appstoreconnect.apple.com/
2. Clique em **Apps** → **LikeMe**
3. Vá para a aba **TestFlight**

### 2. Aguardar Processamento

- ⏱️ **Tempo**: 5-15 minutos
- 📧 **Notificação**: Você receberá um email quando estiver pronto
- ⚠️ **Status**: O build aparecerá como "Processing" inicialmente

### 3. Adicionar Testadores

#### TestFlight Internal (Até 100 testadores)

1. Clique em **Internal Testing**
2. Clique em **+** para criar um grupo
3. Adicione o build ao grupo
4. Adicione emails dos testadores
5. ✅ Testadores recebem convite imediatamente

#### TestFlight External (Até 10.000 testadores)

1. Clique em **External Testing**
2. Clique em **+** para criar um grupo
3. Preencha informações de compliance
4. Adicione o build ao grupo
5. Adicione testadores
6. Submeta para revisão da Apple
7. ⏱️ Aguarde aprovação (24-48h)
8. ✅ Testadores recebem convite após aprovação

## 🔍 Verificar Configurações

### Build Number Atual

```bash
eas build:version:get --platform ios
```

### Listar Builds Recentes

```bash
eas build:list --platform ios --limit 5
```

### Ver Status de um Build

```bash
eas build:view <BUILD_ID>
```

## ⚙️ Configurações do Build

### Perfil Staging (eas.json)

```json
{
  "build": {
    "staging": {
      "distribution": "store",
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_BACKEND_URL": "https://likeme-back-end-git-staging-pixel-pulse-labs.vercel.app"
      },
      "ios": {
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "staging": {
      "ios": {
        "appleId": "6757706434",
        "ascAppId": "6757706434",
        "appleTeamId": "VS752K4DT8"
      }
    }
  }
}
```

### App Config (app.json)

- **Bundle ID**: `com.likeme.app`
- **Version**: `1.0.0`
- **Build Number**: Auto-incrementado pelo EAS

## ⚠️ Troubleshooting

### Erro: "Not logged in"

```bash
eas login
```

### Erro: "No valid iOS Distribution certificate"

```bash
eas credentials
# Selecione iOS → Manage credentials → Setup
```

### Erro: "Build failed"

1. Verifique os logs: `eas build:view <BUILD_ID>`
2. Verifique se o Bundle ID está correto
3. Verifique se há certificados válidos
4. Tente novamente: `eas build --platform ios --profile staging`

### Erro: "Submit failed"

1. Verifique se o build foi concluído com sucesso
2. Verifique se o app existe no App Store Connect
3. Verifique credenciais no `eas.json`
4. Tente submeter manualmente via Xcode Organizer

### Erro de Encoding (CocoaPods)

```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

Adicione ao seu `~/.zshrc` ou `~/.bash_profile`:

```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

## 📚 Recursos Úteis

- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Documentação EAS Submit](https://docs.expo.dev/submit/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)

## ✅ Checklist Rápido

- [ ] Logado no EAS (`eas whoami`)
- [ ] Código commitado e pushed
- [ ] Build criado (`./build-testflight.sh`)
- [ ] Build concluído com sucesso
- [ ] Build submetido para TestFlight
- [ ] Build processado no App Store Connect
- [ ] Testadores adicionados
- [ ] Testadores receberam convites

## 🎉 Sucesso!

Após seguir estes passos, seu app estará disponível no TestFlight para os testadores instalarem e testarem!

---

**Dúvidas?** Consulte o arquivo `TESTFLIGHT_SETUP.md` para mais detalhes.

