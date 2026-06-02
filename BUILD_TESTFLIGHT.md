# Como gerar build para TestFlight (local)

Este guia descreve como gerar uma versão do app para distribuição no TestFlight com Xcode/Gradle, sem infraestrutura de build na nuvem da Expo.

## 📋 Pré-requisitos

1. ✅ Conta Apple Developer ativa ($99/ano)
2. ✅ App criado no App Store Connect
3. ✅ Xcode instalado (versão mais recente)
4. ✅ macOS (necessário para builds iOS)
5. ✅ CocoaPods instalado (`sudo gem install cocoapods`)
6. ✅ Certificados e Perfis de Provisionamento configurados no Xcode

## 🎯 Método: Build Local

### Passo 1: Na raiz do front-end

Garanta a pasta `ios/` (se não existir: `npx expo prebuild --platform ios`). Depois:

```bash
cd /Users/weber/Projetos/likeme/likeme-front-end
npm run ios:xcode:archive:production
```

(Alternativa Release: `npm run ios:xcode:archive:release`. Para archive + export + validação + upload: `npm run ios:appstore:pipeline`.)

### Passo 2: Aguarde a conclusão

- ⏱️ **Tempo estimado**: 5-15 minutos (dependendo do hardware)
- 📊 **Processo local**: Sem filas, sem depender de servidores externos
- 📁 **Localização do Archive**: `ios/build/LikeMe.xcarchive`

## 📤 Upload para TestFlight

Após o build concluir, você tem duas opções:

### Opção 1: Via Xcode Organizer (Recomendado)

1. Abra o **Xcode**
2. Vá em **Window** → **Organizer** (ou pressione `⌘⇧2`)
3. Selecione o Archive mais recente na lista
4. Clique em **Distribute App**
5. Escolha **App Store Connect**
6. Siga o wizard:
   - **Distribute**: App Store Connect
   - **Upload**: ✅
   - **Include bitcode**: Desmarque (não é mais necessário)
   - **Upload symbols**: ✅ (recomendado para crash reports)
   - **Manage Version and Build Number**: Automático
7. Clique em **Upload**
8. ✅ Aguarde o upload concluir

### Opção 2: Via Transporter App

1. Primeiro, exporte o .ipa:

   - Abra o Xcode Organizer
   - Selecione o Archive
   - Clique em **Distribute App**
   - Escolha **Custom**
   - Selecione **App Store Connect**
   - Escolha **Export**
   - Salve o .ipa em um local conveniente

2. Abra o **Transporter** (App da Apple)
3. Arraste o arquivo .ipa para o Transporter
4. Clique em **Deliver**
5. ✅ Aguarde o upload concluir

## 📱 Após o Upload

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

## 🔧 Comandos Manuais

Se preferir executar os comandos manualmente:

```bash
# 1. Navegar para o diretório
cd /Users/weber/Projetos/likeme/likeme-front-end

# 2. Gerar projeto iOS (se necessário)
npx expo prebuild --platform ios

# 3. Instalar pods
cd ios
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
pod install
cd ..

# 4. Criar Archive
cd ios
xcodebuild archive \
  -workspace LikeMe.xcworkspace \
  -scheme LikeMe \
  -configuration Release \
  -archivePath build/LikeMe.xcarchive \
  -allowProvisioningUpdates
cd ..
```

## ⚙️ Configurações

### Bundle ID

- **Produção**: `app.likeme.com`

### Certificados

- Configurados automaticamente via Xcode
- Use **Apple Development** para TestFlight Internal
- Use **Apple Distribution** para TestFlight External e App Store

### Perfil de Provisionamento

- **Development**: Para testes internos
- **Ad Hoc**: Para distribuição limitada
- **App Store**: Para TestFlight External e App Store

## ⚠️ Troubleshooting

### Erro: "Xcode não encontrado"

```bash
# Instale o Xcode pela App Store
# Ou use o Xcode Command Line Tools:
xcode-select --install
```

### Erro: "CocoaPods não encontrado"

```bash
sudo gem install cocoapods
```

### Erro de Encoding (CocoaPods)

```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

Adicione ao seu `~/.zshrc`:

```bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
```

### Erro: "No valid iOS Distribution certificate"

1. Abra o Xcode
2. Vá em **Xcode** → **Settings** → **Accounts**
3. Selecione sua conta Apple Developer
4. Clique em **Manage Certificates**
5. Clique em **+** → **Apple Distribution**

### Erro: "Provisioning profile doesn't include signing certificate"

1. Abra o Xcode
2. Abra o projeto em `ios/LikeMe.xcworkspace`
3. Vá em **Signing & Capabilities**
4. Marque **Automatically manage signing**
5. Selecione seu Team

### Archive não aparece no Organizer

1. Verifique se o build foi **Release** (não Debug)
2. Verifique se escolheu **Generic iOS Device** como destino
3. Tente limpar o build: `xcodebuild clean`

## 🤖 GitHub Actions — secrets de assinatura iOS (CI)

O workflow `.github/workflows/build.yml` (jobs `build-ios` e `ios-appstore-pipeline`) importa **certificado** e **perfil App Store** a partir de secrets. **Team ID** no projeto: `VS752K4DT8` (alinhado a `ios/ExportOptions-AppStore.plist` e ao Xcode).

### Secrets no repositório (Settings → Secrets and variables → Actions)

| Secret | O que é |
|--------|--------|
| `IOS_CERTIFICATE_P12_BASE64` | Certificado **Apple Distribution** (ou iPhone Distribution) exportado como `.p12`, codificado em Base64 (uma linha). |
| `IOS_CERTIFICATE_PASSWORD` | Senha definida na exportação do `.p12` no Acesso às Chaves. |
| `IOS_PROVISIONING_PROFILE_BASE64` | Perfil **App Store** para o bundle `app.likeme.com`, ficheiro `.mobileprovision` em Base64 (uma linha). |
| `KEYCHAIN_PASSWORD` | Palavra-passe da keychain temporária criada no runner pelo `Apple-Actions/import-codesign-certs` (pode ser uma string forte fixa; não é a senha da Apple). |

Gerar Base64 no macOS (exemplos):

```bash
base64 -i caminho/para/Distribution.p12 | tr -d '\n' | pbcopy
base64 -i caminho/para/AppStore_app_likeme.mobileprovision | tr -d '\n' | pbcopy
```

Colar cada resultado no secret correspondente. O `.p12` deve incluir a **chave privada** do certificado de distribuição da equipa.

O perfil no Developer Portal deve ser do tipo **App Store**, associado ao App ID `app.likeme.com`, e assinado com o mesmo certificado que está no `.p12`.

### Referência

- [Instalar certificado Apple em runners macOS (GitHub Docs)](https://docs.github.com/actions/deployment/deploying-xcode-applications/installing-an-apple-certificate-on-macos-runners-for-xcode-development)

## 📚 Recursos Úteis

- [Xcode Organizer](https://developer.apple.com/documentation/xcode/distributing-your-app-to-registered-devices)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [TestFlight Documentation](https://developer.apple.com/testflight/)
- [Code Signing Guide](https://developer.apple.com/support/code-signing/)

## ✅ Checklist Rápido

- [ ] Xcode instalado e configurado
- [ ] CocoaPods instalado
- [ ] Certificados configurados
- [ ] Projeto iOS gerado (se necessário)
- [ ] Archive criado (`npm run ios:xcode:archive:production` ou fluxo no Xcode Organizer)
- [ ] Archive distribuído via Xcode Organizer
- [ ] Build processado no App Store Connect
- [ ] Testadores adicionados
- [ ] Testadores receberam convites

## 🎉 Vantagens do Build Local

- ⚡ **Mais rápido**: Sem filas de build
- 💰 **Sem custos**: Não depende de serviços pagos
- 🔒 **Mais controle**: Build totalmente local
- 🎯 **Mais flexível**: Customize o processo como quiser
- 🐛 **Debug mais fácil**: Logs locais e imediatos

---

**Dúvidas?** Consulte a documentação oficial do Xcode e App Store Connect.
